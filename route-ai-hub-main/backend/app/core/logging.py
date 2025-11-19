from __future__ import annotations

import logging
import json
import time
import uuid
from typing import Any, Dict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )


class RequestIdLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("x-request-id") or f"req-{uuid.uuid4().hex[:8]}"
        start = time.time()
        response: Response
        response = await call_next(request)
        duration_ms = int((time.time() - start) * 1000)
        log: Dict[str, Any] = {
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "duration_ms": duration_ms,
        }
        logging.getLogger("request").info(json.dumps(log))
        response.headers["x-request-id"] = request_id
        return response


