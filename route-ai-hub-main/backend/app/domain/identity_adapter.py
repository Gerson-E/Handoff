from __future__ import annotations

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.models import Patient


async def get_patient_profile(session: AsyncSession, patient_id: str) -> Optional[dict]:
    """Fetch patient by external_id and return a JSON-friendly dict.

    Returns None if not found.
    """
    result = await session.execute(
        select(Patient).where(Patient.external_id == patient_id).limit(1)
    )
    patient = result.scalar_one_or_none()
    if not patient:
        return None
    return {
        "id": patient.external_id,
        "name": patient.name,
        "lat": patient.lat,
        "lon": patient.lon,
        "attributes": patient.attributes or {},
    }



