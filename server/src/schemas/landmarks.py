from pydantic import BaseModel


class PoseLandmark(BaseModel):
    """Pose landmark with x, y, z coordinates and visibility score."""

    x: float
    y: float
    z: float
    visibility: float


class HandLandmark(BaseModel):
    """Hand landmark with x, y, z coordinates."""

    x: float
    y: float
    z: float
