from __future__ import annotations

import math
import random
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from .models import Facility, Patient, Event
from .session import engine, Base
from datetime import datetime, timedelta


LA_CENTER = (34.0522, -118.2437)


def _jitter(base: tuple[float, float], km: float) -> tuple[float, float]:
    # rough conversion: 1 deg lat ~ 111km, lon scaled by cos(lat)
    lat_k = km / 111.0
    lon_k = km / (111.0 * math.cos(math.radians(base[0]) or 1e-6))
    return base[0] + random.uniform(-lat_k, lat_k), base[1] + random.uniform(-lon_k, lon_k)


async def seed_basic(session: AsyncSession) -> None:
    exists_fac = await session.execute(select(Facility).limit(1))
    if exists_fac.scalar_one_or_none():
        return

    # Facilities: ~10, some without MRI capability
    facilities: List[Facility] = []
    for i in range(10):
        lat, lon = _jitter(LA_CENTER, km=random.uniform(0.5, 30))
        supports_mri = random.random() > 0.3
        supports_ct = True
        ftype = random.choice(["hospital", "clinic", "imaging_center"]) 
        facilities.append(
            Facility(
                external_id=f"facility-{i:03d}",
                name=f"Facility {i:03d}",
                type=ftype,
                is_active=True,
                lat=lat,
                lon=lon,
                supported_services={"MRI": supports_mri, "CT": supports_ct},
                capacity_score=round(random.uniform(0.2, 0.9), 3),
            )
        )

    session.add_all(facilities)
    await session.flush()

    # Patients: ~100 around LA
    patients: List[Patient] = []
    for i in range(100):
        lat, lon = _jitter(LA_CENTER, km=random.uniform(0.1, 50))
        patients.append(
            Patient(
                external_id=f"patient-{i:05d}",
                name=f"Patient {i:05d}",
                lat=lat,
                lon=lon,
                attributes={"age": random.randint(18, 90)},
            )
        )

    session.add_all(patients)
    await session.flush()

    # Events: a few recent events per patient
    now = datetime.utcnow()
    events: List[Event] = []
    for i, p in enumerate(patients):
        for _ in range(random.randint(0, 3)):
            ts = now - timedelta(minutes=random.randint(0, 60 * 24))
            routed = random.choice(facilities) if random.random() > 0.2 else None
            events.append(
                Event(
                    ts=ts,
                    patient_id=p.id,
                    routed_facility_id=routed.id if routed else None,
                    request_text=random.choice([None, "Needs MRI", "Follow-up"]),
                    decision={"confidence": round(random.uniform(0.3, 0.95), 2)},
                )
            )

    session.add_all(events)
    await session.commit()


async def create_all(engine_in: AsyncEngine | None = None) -> None:
    eng = engine_in or engine
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def main_async() -> None:
    await create_all()
    async with sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)() as session:
        await seed_basic(session)


def _run():
    import asyncio
    asyncio.run(main_async())


if __name__ == "__main__":
    _run()


