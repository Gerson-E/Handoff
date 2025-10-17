from __future__ import annotations

import os
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.config import get_settings
from ..db.session import get_db
from ..db.models import Patient, Facility, Event
from ..domain.routing_engine import decide_route
from ..ai.llm_classifier import classify_request_text
from ..ai.llm_explainer import explain_decision
from ..core.metrics import get_metrics


router = APIRouter()


class RouteRequest(BaseModel):
    patient_id: str
    request_type: Optional[str] = None
    department: Optional[str] = None
    urgency: Optional[str] = None
    location_hint: Optional[str] = None
    free_text: Optional[str] = None
    intended_site: Optional[str] = None


class RouteResponse(BaseModel):
    route_to_facility_id: str
    route_to_endpoint: str
    confidence: float
    decision_status: Optional[str] = Field(default=None)
    reason: Optional[str] = None
    features_used: Optional[Dict[str, float]] = None
    decision_id: str
    ttl_seconds: Optional[int] = Field(default=3600)


@router.post("/route", response_model=RouteResponse, summary="Route a clinical request")
async def route_request(
    body: RouteRequest,
    db: AsyncSession = Depends(get_db),
    idempotency_key: Optional[str] = Header(default=None, alias="Idempotency-Key"),
) -> RouteResponse:
    settings = get_settings()

    # Idempotency: if provided, return previous decision
    if idempotency_key:
        existing = await db.execute(
            select(Event.decision).where(Event.idempotency_key == idempotency_key)
        )
        row = existing.first()
        if row and row[0]:
            return RouteResponse(**row[0])

    # Validate patient exists
    patient_row = await db.execute(
        select(Patient).where(Patient.external_id == body.patient_id).limit(1)
    )
    patient = patient_row.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    # Classify if needed
    req_type = body.request_type
    if not req_type and settings.ai_classify and (body.free_text or ""):
        req_type = classify_request_text(body.free_text or "")

    # Decide route
    decision = await decide_route(
        db,
        {
            "patient_id": body.patient_id,
            "request_type": req_type,
            "department": body.department,
            "urgency": body.urgency,
            "location_hint": body.location_hint,
            "free_text": body.free_text,
            "intended_site": body.intended_site,
        },
    )

    # Optional AI explanation
    if settings.ai_explain:
        # find facility name for prompt context
        fac_ext = decision.get("route_to_facility_id")
        fac_name = fac_ext
        if fac_ext:
            fac_row = await db.execute(select(Facility).where(Facility.external_id == fac_ext).limit(1))
            fac = fac_row.scalar_one_or_none()
            if fac:
                fac_name = fac.name
        decision["reason"] = explain_decision(body.patient_id, fac_name or "", decision.get("features_used", {}))

    # Persist event
    routed_facility_internal_id = None
    if decision.get("route_to_facility_id"):
        fac_row = await db.execute(
            select(Facility).where(Facility.external_id == decision["route_to_facility_id"]).limit(1)
        )
        fac = fac_row.scalar_one_or_none()
        routed_facility_internal_id = fac.id if fac else None

    ev = Event(
        patient_id=patient.id,
        routed_facility_id=routed_facility_internal_id,
        request_text=body.free_text,
        decision=decision,
        idempotency_key=idempotency_key,
    )
    db.add(ev)
    await db.commit()

    # Metrics
    get_metrics().record_decision(decision.get("decision_status", "failed"), float(decision.get("confidence", 0.0)))

    return RouteResponse(**decision)


