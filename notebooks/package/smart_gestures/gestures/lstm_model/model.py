import json
import os
from pathlib import Path
from typing import cast, Callable

import numpy as np
import torch
import torch.nn as nn
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence

# Constants
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IN_DIM = 258
HIDDEN_DIM = 128
NUM_LAYERS = 2
SEQUENCE_LENGTH = 40

# Paths
THIS_DIR = Path(__file__).parent
DATA_DIR = THIS_DIR / "data"
MODEL_DIR = THIS_DIR / "models"

CLASSES_MAP_PATH = DATA_DIR / "gesture_map.json"
MODEL_FILE = MODEL_DIR / "lstm_model.pth"

if not CLASSES_MAP_PATH.exists():
    raise FileNotFoundError(f"Classes map file not found: {CLASSES_MAP_PATH}")
if not MODEL_FILE.exists():
    raise FileNotFoundError(f"Model file not found: {MODEL_FILE}")


def normalize_landmarks(sequence: np.ndarray) -> np.ndarray:
    """
    Normalize the hand landmarks in the sequence.
    The normalization centers the hand landmarks based on the root landmark (first hand landmark of the first frame)
    and scales them based on the distance from the wrist to the middle finger MCP joint.
    Args:
        sequence (np.ndarray): Input sequence of hand landmarks.
    Returns:
        np.ndarray: Normalized sequence of hand landmarks.
    """
    if sequence.ndim != 2:
        raise ValueError("Input sequence must be a 2D array")

    N_frames = sequence.shape[0]
    pose_size = 33 * 4

    hand_keypoints_3d = sequence[:, pose_size:].reshape(N_frames, -1, 3)

    if hand_keypoints_3d.shape[1] < 2:
        return sequence

    root_coords = hand_keypoints_3d[0, 0, :3]
    centered_hand_keypoints = hand_keypoints_3d - root_coords

    wrist_to_middle_dist = np.linalg.norm(centered_hand_keypoints[0, 9])

    scale = wrist_to_middle_dist
    if scale < 1e-6:
        scale = 1.0

    normalize_landmarks = centered_hand_keypoints / scale
    normalize_landmarks_flat = normalize_landmarks.reshape(N_frames, -1)
    normalized_sequence = np.concatenate(
        [sequence[:, :pose_size], normalize_landmarks_flat], axis=1
    )

    return normalized_sequence


class GestureLSTM(nn.Module):
    """LSTM-based Gesture Recognition Model"""

    def __init__(
        self,
        in_dim: int,
        hidden_dim: int,
        num_layers: int,
        num_classes: int,
        dropout: float = 0.2,
    ):
        super(GestureLSTM, self).__init__()
        self.lstm = nn.LSTM(
            input_size=in_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout,
            bidirectional=False,
        )
        self.fc = nn.Linear(hidden_dim, num_classes)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor, sequence_lengths: torch.Tensor) -> torch.Tensor:
        sorted_lengths, sorted_idx = sequence_lengths.sort(0, descending=True)
        x_sorted = x[sorted_idx]

        packed_input = pack_padded_sequence(
            x_sorted,
            sorted_lengths.cpu(),
            batch_first=True,
            enforce_sorted=True,
        )

        packed_output, _ = self.lstm(packed_input)

        output, _ = pad_packed_sequence(packed_output, batch_first=True)

        last_time_step_out_sorted = output[
            torch.arange(output.size(0)), sorted_lengths - 1
        ]

        _, unsorted_idx = sorted_idx.sort(0)
        last_time_step_out = last_time_step_out_sorted[unsorted_idx]

        out = self.dropout(last_time_step_out)
        out = self.fc(out)

        return out


def create_model(num_classes: int) -> nn.Module:
    """
    Create a LSTM-based gesture recognition model.
    Args:
        num_classes (int): Number of output classes.
    Returns:
        nn.Module: The created model.
    """
    model = GestureLSTM(
        in_dim=IN_DIM,
        hidden_dim=HIDDEN_DIM,
        num_layers=NUM_LAYERS,
        num_classes=num_classes,
    )
    return model.to(DEVICE)


def get_classes() -> dict[str, int]:
    """
    Load the class names from the gesture_map.json file.
    Returns:
        list[str]: List of class names.
    """
    return json.load(open(CLASSES_MAP_PATH, "r", encoding="utf-8"))


class LSTMModel:
    """
    A high level class for the LSTM gesture recognition model.
    This class handles loading the model, preparing input data, and making predictions.
    """

    def __init__(self):
        self.classes = get_classes()
        self.idx_to_class = {idx: name for name, idx in self.classes.items()}
        self.model = create_model(num_classes=len(self.classes))

        state_dict = torch.load(MODEL_FILE, map_location=DEVICE)
        self.model.load_state_dict(state_dict)
        self.model.eval()

    def prepare_input(self, sequence: np.ndarray) -> tuple[torch.Tensor, torch.Tensor]:
        sequence = normalize_landmarks(sequence)

        N_frames, N_featrures = sequence.shape

        if N_frames > SEQUENCE_LENGTH:
            padded_sequence = sequence[:SEQUENCE_LENGTH, :]
            actual_length = SEQUENCE_LENGTH
        else:
            padding = np.zeros(
                (SEQUENCE_LENGTH - N_frames, N_featrures), dtype=np.float32
            )
            padded_sequence = np.concatenate([sequence, padding], axis=0)
            actual_length = N_frames

        x_tensor = torch.from_numpy(padded_sequence).float().unsqueeze(0)
        length_tensor = torch.tensor([actual_length], dtype=torch.int64)

        return x_tensor, length_tensor

    def predict(self, sequence: list[list[float]] | np.ndarray) -> tuple[str, float]:
        if not isinstance(sequence, np.ndarray):
            sequence = np.array(sequence, dtype=np.float32)

        if sequence.ndim != 2 or sequence.shape[1] != IN_DIM:
            raise ValueError(
                f"Input sequence must be of shape (N_frames, {IN_DIM}), got {sequence.shape}"
            )

        x_tensor, length_tensor = self.prepare_input(sequence)
        x_tensor = x_tensor.to(DEVICE)

        with torch.no_grad():
            logits = self.model(x_tensor, length_tensor)
            pred_idx = int(torch.argmax(logits, dim=1).item())
            pred_name = self.idx_to_class[pred_idx]
            confidence = float(torch.softmax(
                logits, dim=1)[0, pred_idx].item())

        return pred_name, confidence
