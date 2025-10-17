from __future__ import annotations

from fastapi import APIRouter, Depends
import os
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
    cfg_key = (os.getenv("API_KEY") or "").strip()
    return {
        "status": "ok",
        "db": ok_db,
        "llm": bool(llm.enabled),
        "sse_clients": get_metrics().snapshot().get("sse_clients", 0),
        "auth_required": bool(cfg_key),
        "api_key_len": len(cfg_key),
    }


@router.get("/metrics")
async def metrics() -> dict:
    return get_metrics().snapshot()


