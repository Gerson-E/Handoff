from __future__ import annotations

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, Index, JSON
from .session import Base
from datetime import datetime


class Facility(Base):
    __tablename__ = "facilities"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String, index=True, unique=True)
    name: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    lat: Mapped[float] = mapped_column(Float)
    lon: Mapped[float] = mapped_column(Float)
    supported_services: Mapped[dict] = mapped_column(JSON, default=dict)
    capacity_score: Mapped[float] = mapped_column(Float, default=0.0)
    address: Mapped[str | None] = mapped_column(String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    hours: Mapped[str | None] = mapped_column(String, nullable=True)

    __table_args__ = (
        Index("ix_facilities_type_active", "type", "is_active"),
    )


class Patient(Base):
    __tablename__ = "patients"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String, index=True, unique=True)
    name: Mapped[str] = mapped_column(String)
    lat: Mapped[float] = mapped_column(Float)
    lon: Mapped[float] = mapped_column(Float)
    attributes: Mapped[dict] = mapped_column(JSON, default=dict)


class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id", ondelete="CASCADE"), index=True)
    routed_facility_id: Mapped[int | None] = mapped_column(
        ForeignKey("facilities.id", ondelete="SET NULL"), nullable=True, index=True
    )
    request_text: Mapped[str | None] = mapped_column(String, nullable=True)
    decision: Mapped[dict] = mapped_column(JSON, default=dict)
    idempotency_key: Mapped[str | None] = mapped_column(String, nullable=True, index=True)

    __table_args__ = (
        Index("ix_events_patient_ts", "patient_id", "ts"),
        Index("ix_events_routed_facility_ts", "routed_facility_id", "ts"),
    )



