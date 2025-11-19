from __future__ import annotations

from typing import Tuple
import math


def haversine_km(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    """Great-circle distance between two lat/lon points in kilometers."""
    (lat1, lon1), (lat2, lon2) = a, b
    r = 6371.0  # km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    sin_dphi = math.sin(dphi / 2)
    sin_dl = math.sin(dl / 2)
    h = sin_dphi * sin_dphi + math.cos(phi1) * math.cos(phi2) * sin_dl * sin_dl
    return 2 * r * math.asin(min(1.0, math.sqrt(h)))


