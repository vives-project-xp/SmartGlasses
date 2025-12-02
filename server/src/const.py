import tomllib
from enum import Enum
from pathlib import Path
from typing import Final


def _get_version() -> str:
    """Read version from pyproject.toml."""
    pyproject_path = Path(__file__).parent.parent / "pyproject.toml"
    with open(pyproject_path, "rb") as f:
        data = tomllib.load(f)
    return data["project"]["version"]


__version__: Final = _get_version()


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
