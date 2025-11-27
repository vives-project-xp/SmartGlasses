import numpy as np
from numpy.typing import NDArray
from pydantic import BaseModel, Field, field_validator

from const import (
    LSTM_HAND_LANDMARKS,
    LSTM_POSE_LANDMARKS,
    LSTM_SEQUENCE_LENGTH,
    HandLandmark,
    PoseLandmark,
)


class LSTMFrame(BaseModel):
    """
    Single frame containing pose and hand landmarks for LSTM gesture recognition.

    Structure:
    - pose: 33 pose landmarks (MediaPipe Pose)
    - left_hand: 21 left hand landmarks (MediaPipe Hands)
    - right_hand: 21 right hand landmarks (MediaPipe Hands)

    Each frame contains:
    - 33 × 4 = 132 pose features (x, y, z, visibility)
    - 21 × 3 = 63 left hand features (x, y, z)
    - 21 × 3 = 63 right hand features (x, y, z)
    Total: 258 features per frame
    """

    pose: list[PoseLandmark] = Field(
        ...,
        description="33 MediaPipe Pose landmarks with x, y, z, visibility",
        min_length=LSTM_POSE_LANDMARKS,
        max_length=LSTM_POSE_LANDMARKS,
    )
    left_hand: list[HandLandmark] = Field(
        ...,
        description="21 MediaPipe left hand landmarks with x, y, z",
        min_length=LSTM_HAND_LANDMARKS,
        max_length=LSTM_HAND_LANDMARKS,
    )
    right_hand: list[HandLandmark] = Field(
        ...,
        description="21 MediaPipe right hand landmarks with x, y, z",
        min_length=LSTM_HAND_LANDMARKS,
        max_length=LSTM_HAND_LANDMARKS,
    )

    def to_feature_array(self) -> NDArray[np.float32]:
        """
        Convert frame to flat feature array of 258 values.

        Returns:
            NDArray[np.float32]: Array of shape (258,) containing [pose, left_hand, right_hand]
        """
        pose_features = np.array(
            [[lm.x, lm.y, lm.z, lm.visibility] for lm in self.pose]).flatten()
        left_hand_features = np.array(
            [[lm.x, lm.y, lm.z] for lm in self.left_hand]).flatten()
        right_hand_features = np.array(
            [[lm.x, lm.y, lm.z] for lm in self.right_hand]).flatten()

        return np.concatenate([pose_features, left_hand_features, right_hand_features])


class LSTMPredictBody(BaseModel):
    """
    Request body for LSTM gesture prediction.

    The LSTM model requires EXACTLY 40 consecutive frames to make a prediction.
    Each frame must contain:
    - 33 pose landmarks (MediaPipe Pose)
    - 21 left hand landmarks (MediaPipe Hands)
    - 21 right hand landmarks (MediaPipe Hands)

    **Frontend Implementation Guide:**
    1. Capture 40 consecutive frames from the camera
    2. For each frame, extract landmarks using MediaPipe:
       - Pose landmarks (33 points with x, y, z, visibility)
       - Left hand landmarks (21 points with x, y, z)
       - Right hand landmarks (21 points with x, y, z)
    3. Send all 40 frames in a single request
    """

    frames: list[LSTMFrame] = Field(
        ...,
        description=f"Sequence of exactly {LSTM_SEQUENCE_LENGTH} frames with pose and hand landmarks",
        min_length=LSTM_SEQUENCE_LENGTH,
        max_length=LSTM_SEQUENCE_LENGTH,
    )

    @field_validator("frames")
    @classmethod
    def validate_frames(cls, v: list[LSTMFrame]) -> list[LSTMFrame]:
        """Validate that we have exactly 40 frames."""
        if len(v) != LSTM_SEQUENCE_LENGTH:
            raise ValueError(
                f"LSTM model requires exactly {LSTM_SEQUENCE_LENGTH} frames, " f"received {len(v)} frames")
        return v

    def to_numpy_sequence(self) -> NDArray[np.float32]:
        """
        Convert the sequence of frames to a numpy array for model prediction.

        Returns:
            NDArray[np.float32]: Array of shape (40, 258) containing all frame features
        """
        return np.array([frame.to_feature_array() for frame in self.frames], dtype=np.float32)


class LSTMPredictResponse(BaseModel):
    """Response containing the predicted gesture and confidence score."""

    prediction: str = Field(
        ...,
        description="Predicted gesture class name",
    )
    confidence: float = Field(
        ...,
        description="Confidence score of the prediction (0.0 to 1.0)",
        ge=0.0,
        le=1.0,
    )
