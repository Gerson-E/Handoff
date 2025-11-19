from __future__ import annotations

from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db.session import get_db
from ..db.models import Patient, Facility, Event
from ..core.config import get_settings
from ..domain.routing_engine import decide_route
from ..ai.llm_classifier import classify_request_text
from ..ai.llm_explainer import explain_decision
from ..core.metrics import get_metrics


router = APIRouter(prefix="/fhir")


def _first_coding_code(resource: Dict[str, Any], field: str) -> Optional[str]:
    obj = resource.get(field)
    if isinstance(obj, dict):
        coding = obj.get("coding") or []
        if isinstance(coding, list) and coding:
            code = coding[0].get("code") or coding[0].get("display") or None
            return code
        # allow plain text fallback
        return obj.get("text")
    if isinstance(obj, list) and obj:
        entry = obj[0]
        if isinstance(entry, dict):
            coding = entry.get("coding") or []
            if isinstance(coding, list) and coding:
                return coding[0].get("code") or coding[0].get("display")
            return entry.get("text")
    return None


def _extract_patient_id(subject_ref: Optional[str]) -> Optional[str]:
    if not subject_ref:
        return None
    # Accept forms like "Patient/123" or plain "123"
    if "/" in subject_ref:
        parts = subject_ref.split("/")
        return parts[-1] or None
    return subject_ref


@router.post("/ServiceRequest", summary="FHIR adapter → /route")
async def fhir_service_request(
    body: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
    idempotency_key: Optional[str] = Header(default=None, alias="Idempotency-Key"),
) -> Dict[str, Any]:
    settings = get_settings()

    patient_ref = (body.get("subject") or {}).get("reference") if isinstance(body.get("subject"), dict) else body.get("subject")
    patient_id = _extract_patient_id(patient_ref)
    if not patient_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing subject.reference")

    # Ensure patient exists
    row = await db.execute(select(Patient).where(Patient.external_id == patient_id).limit(1))
    patient = row.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    # Map FHIR fields → internal DTO
    request_type = _first_coding_code(body, "code")
    department = _first_coding_code(body, "category")
    location_hint = None
    loc_ref = None
    loc_field = body.get("locationReference") or body.get("locationCode")
    if isinstance(loc_field, dict):
        loc_ref = loc_field.get("reference") or loc_field.get("text")
    elif isinstance(loc_field, str):
        loc_ref = loc_field
    location_hint = loc_ref

    free_text = None
    if isinstance(body.get("code"), dict):
        free_text = body["code"].get("text")

    # Classify if missing and enabled
    if not request_type and settings.ai_classify and (free_text or ""):
        request_type = classify_request_text(free_text or "")

    decision = await decide_route(
        db,
        {
            "patient_id": patient_id,
            "request_type": request_type,
            "department": department,
            "location_hint": location_hint,
            "free_text": free_text,
        },
    )

    # Optional AI explanation
    if settings.ai_explain:
        fac_ext = decision.get("route_to_facility_id")
        fac_name = fac_ext
        if fac_ext:
            frow = await db.execute(select(Facility).where(Facility.external_id == fac_ext).limit(1))
            fac = frow.scalar_one_or_none()
            if fac:
                fac_name = fac.name
        decision["reason"] = explain_decision(patient_id, fac_name or "", decision.get("features_used", {}))

    # Persist Event (with optional idempotency)
    routed_facility_internal_id = None
    if decision.get("route_to_facility_id"):
        frow = await db.execute(select(Facility).where(Facility.external_id == decision["route_to_facility_id"]).limit(1))
        fac = frow.scalar_one_or_none()
        routed_facility_internal_id = fac.id if fac else None
    ev = Event(
        patient_id=patient.id,
        routed_facility_id=routed_facility_internal_id,
        request_text=free_text,
        decision=decision,
        idempotency_key=idempotency_key,
    )
    db.add(ev)
    await db.commit()

    get_metrics().record_decision(decision.get("decision_status", "failed"), float(decision.get("confidence", 0.0)))

    # Return OperationOutcome with extension
    outcome = {
        "resourceType": "OperationOutcome",
        "issue": [{"severity": "information", "code": "informational", "diagnostics": "Routed"}],
        "extension": [
            {
                "url": "http://example.org/handoff-routing",
                "valueCodeableConcept": {
                    "text": "routing-decision",
                },
                "extension": [
                    {"url": "facilityId", "valueString": decision.get("route_to_facility_id")},
                    {"url": "endpointUrl", "valueString": decision.get("route_to_endpoint")},
                    {"url": "confidence", "valueDecimal": float(decision.get("confidence", 0.0))},
                    {"url": "decisionStatus", "valueString": decision.get("decision_status")},
                ],
            }
        ],
    }
    return outcome


