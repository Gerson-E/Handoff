from __future__ import annotations

from fastapi import APIRouter


router = APIRouter()


@router.get("/patients/{id}")
async def get_patient(id: str) -> dict:
    return {"id": id}


