from __future__ import annotations

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.auth import APIKeyMiddleware
from .core.logging import RequestIdLoggingMiddleware

from .api.route_router import router as route_router
from .api.event_router import router as event_router
from .api.fhir_router import router as fhir_router
from .api.meta_router import router as meta_router
from .api.directory_router import router as directory_router
from .api.patient_router import router as patient_router
from .core.logging import configure_logging
from .core.metrics import RequestTimingMiddleware
import logging, os


def create_app() -> FastAPI:
    configure_logging()

    app = FastAPI(title="Handoff Smart Router API", version="0.1.0")

    frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(RequestIdLoggingMiddleware)
    app.add_middleware(APIKeyMiddleware)
    app.add_middleware(RequestTimingMiddleware)

    app.include_router(route_router)
    app.include_router(event_router)
    app.include_router(fhir_router)
    app.include_router(directory_router)
    app.include_router(patient_router)
    app.include_router(meta_router)

    return app


app = create_app()

# Log auth settings on startup
logger = logging.getLogger("uvicorn")
api_key = (os.getenv("API_KEY") or "").strip()
logger.info("Auth required: %s, API_KEY len=%d", bool(api_key), len(api_key))


