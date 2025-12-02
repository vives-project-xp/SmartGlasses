from pydantic import BaseModel, Field

from const import NUM_POINTS

from .landmarks import HandLandmark


class HandKeypointsResponse(BaseModel):
    landmarks: list[HandLandmark] = Field(
        min_length=NUM_POINTS,
        max_length=NUM_POINTS,
        description="List of detected hand keypoints",
    )
