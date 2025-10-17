from __future__ import annotations

from fastapi import FastAPI
from fastapi.responses import JSONResponse


class AppError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def _handle_app_error(_, exc: AppError):
        return JSONResponse(status_code=400, content={"detail": exc.message})


