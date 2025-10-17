from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from ..db.session import get_db
from ..core.metrics import get_metrics
from ..ai.provider import LLMClient


router = APIRouter()


@router.get("/health")
async def health(db: AsyncSession = Depends(get_db)) -> dict:
    ok_db = True
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        ok_db = False
    llm = LLMClient()
    return {
        "status": "ok",
        "db": ok_db,
        "llm": bool(llm.enabled),
        "sse_clients": get_metrics().snapshot().get("sse_clients", 0),
    }


@router.get("/metrics")
async def metrics() -> dict:
    return get_metrics().snapshot()


