from __future__ import annotations

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.models import Facility
from ..utils.geo import haversine_km


async def list_directory(session: AsyncSession) -> List[dict]:
    rows = (await session.execute(select(Facility))).scalars().all()
    return [
        {
            "id": f.external_id,
            "name": f.name,
            "type": f.type,
            "is_active": f.is_active,
            "lat": f.lat,
            "lon": f.lon,
            "supported_services": f.supported_services or {},
            "capacity_score": f.capacity_score,
        }
        for f in rows
    ]


async def get_candidates(
    session: AsyncSession,
    request_type: Optional[str],
    department: Optional[str],
    patient: Optional[dict],
) -> List[dict]:
    """Return candidate facilities with computed distance and capability flag.

    - Only active facilities
    - Capability true if supported_services holds a key related to request_type or department
    """
    rows = (await session.execute(select(Facility).where(Facility.is_active == True))).scalars().all()  # noqa: E712

    def has_capability(f: Facility) -> bool:
        caps = (f.supported_services or {})
        key = (request_type or department or "").strip().upper()
        if not key:
            return True
        # simple mapping: look for exact or substring key
        if key in caps:
            return bool(caps[key])
        # heuristic: map common types
        aliases = {
            "IMAGING": ["MRI", "CT", "XRAY", "ULTRASOUND"],
            "LAB": ["LAB", "BLOOD"],
            "CARDIOLOGY": ["CARDIOLOGY"],
        }
        for target in aliases.get(key, []):
            if target in caps and caps[target]:
                return True
        return False

    p_coords = (patient.get("lat"), patient.get("lon")) if patient else (None, None)
    out: List[dict] = []
    for f in rows:
        dist_km: Optional[float] = None
        if p_coords[0] is not None and p_coords[1] is not None:
            dist_km = haversine_km((p_coords[0], p_coords[1]), (f.lat, f.lon))
        out.append(
            {
                "id": f.external_id,
                "name": f.name,
                "type": f.type,
                "lat": f.lat,
                "lon": f.lon,
                "is_active": f.is_active,
                "capacity_score": f.capacity_score,
                "has_capability": has_capability(f),
                "distance_km": dist_km,
            }
        )
    return out


