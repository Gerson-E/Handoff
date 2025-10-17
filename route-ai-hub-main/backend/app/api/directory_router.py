from __future__ import annotations

from fastapi import APIRouter


router = APIRouter()


@router.get("/facilities")
async def list_facilities() -> list[dict]:
    return []


