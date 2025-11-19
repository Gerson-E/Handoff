from __future__ import annotations

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from typing import AsyncIterator, List
import asyncio
from ..utils.sse import format_sse, keepalive
from ..core.metrics import get_metrics
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends
from ..db.session import get_db
from ..db.models import Event, Patient, Facility


router = APIRouter()


@router.get("/events")
async def list_events(limit: int = Query(100), db: AsyncSession = Depends(get_db)) -> List[dict]:
    q = await db.execute(select(Event).order_by(Event.ts.desc()).limit(limit))
    rows = q.scalars().all()
    out: List[dict] = []
    for e in rows:
        out.append({
            "ts": e.ts.isoformat(),
            "patient_id": e.patient_id,
            "routed_facility_id": e.routed_facility_id,
            "request_text": e.request_text,
            "decision": e.decision,
        })
        
    return out


async def _event_stream(db: AsyncSession) -> AsyncIterator[str]:
    # Very simple poller for recent events plus 25s keepalive
    last_seen = None
    while True:
        q = await db.execute(select(Event).order_by(Event.ts.desc()).limit(10))
        rows = q.scalars().all()
        if rows:
            newest_ts = rows[0].ts
            if newest_ts != last_seen:
                last_seen = newest_ts
                items = [
                    {"ts": e.ts.isoformat(), "patient_id": e.patient_id, "facility_id": e.routed_facility_id}
                    for e in rows
                ]
                yield format_sse(event="events", data={"items": items})
        for _ in range(5):
            await asyncio.sleep(5)
            yield keepalive()


@router.get("/events/stream")
async def events_stream(db: AsyncSession = Depends(get_db)) -> StreamingResponse:
    async def gen():
        get_metrics().inc_sse()
        async for chunk in _event_stream(db):
            yield chunk
        get_metrics().dec_sse()
    return StreamingResponse(gen(), media_type="text/event-stream")


