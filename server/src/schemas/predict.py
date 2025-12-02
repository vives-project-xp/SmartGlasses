from pydantic import BaseModel, Field

from const import NUM_POINTS

from .landmarks import HandLandmark


class PredictBody(BaseModel):
    landmarks: list[HandLandmark] = Field(
        min_length=NUM_POINTS,
        max_length=NUM_POINTS,
        description="List of landmarks representing hand keypoints",
    )


class PredictResponse(BaseModel):
    prediction: str = Field(
        ...,
        description="Predicted class name",
    )
    confidence: float = Field(
        ...,
        description="Confidence score of the prediction",
        ge=0.0,
        le=1.0,
    )
