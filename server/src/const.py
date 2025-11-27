from enum import Enum
from typing import Final

from pydantic import BaseModel

__version__: Final = "0.1.0"


class FastAPITags(Enum):
    ROOT = "Default"
    WEBSOCKET = "WebSocket"
    ALPHABET = "Alphabet"
    ASL_MODEL = "ASL Model"
    VGT_MODEL = "VGT Model"
    KEYPOINTS = "Keypoints"
    GESTURES = "Gestures"
    LSTM_MODEL = "LSTM Model"


IN_DIM = 63  # 21 landmarks * (x,y,z)
NUM_POINTS = 21  # exact 21 punten

# LSTM Model Constants
LSTM_SEQUENCE_LENGTH = 40  # Number of frames required for LSTM prediction
LSTM_POSE_LANDMARKS = 33  # MediaPipe Pose landmarks
LSTM_HAND_LANDMARKS = 21  # MediaPipe Hand landmarks per hand


# ---- Data schema ----
class Landmark(BaseModel):
    """Single landmark with x, y coordinates and optional z depth."""

    x: float
    y: float
    z: float = 0.0


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
