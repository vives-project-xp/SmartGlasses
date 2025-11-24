# Smart Gestures

[![Python](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.7.0+-ee4c2c.svg)](https://pytorch.org/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A Python package for sign language alphabet recognition using PyTorch and MediaPipe hand tracking.

## Overview

Smart Gestures is a comprehensive toolkit for building sign language recognition systems. It provides pre-trained models, training utilities, and production-ready inference capabilities for recognizing hand gestures from MediaPipe landmarks. The package is designed to be easy to integrate into existing applications while providing flexibility for researchers and developers who want to train custom models.

The package supports multiple sign language alphabets and includes battle-tested utilities for data preprocessing, augmentation, model training with advanced callbacks (early stopping, learning rate scheduling, checkpointing), and real-time inference. Whether you're building a web API, a mobile app backend, or conducting research, Smart Gestures provides the tools you need.

### What's Inside

Smart Gestures provides three main components:

**ASL Model** - American Sign Language alphabet recognition with a simple feedforward neural network trained on 21-landmark hand poses. Includes complete data loading, training, and inference utilities with CSV-based dataset support.

**VGT Model** - Vlaamse Gebarentaal (Flemish Sign Language) alphabet recognition with advanced normalization techniques and data augmentation. Features sophisticated training callbacks including early stopping, learning rate scheduling, and model checkpointing for optimal performance.

**LSTM Model** - Experimental sequence-based gesture recognition using LSTM networks for temporal gesture patterns. Supports dynamic gesture recognition beyond static alphabet poses.

## Features

**Pre-trained Models** - Ready-to-use ASL and VGT alphabet recognition models with high accuracy rates, optimized for production deployment.

**Data Loading & Preprocessing** - Flexible data loaders supporting CSV and JSON formats with built-in normalization, augmentation, and batching.

**Training Utilities** - Complete training pipeline with advanced callbacks including early stopping, model checkpointing, learning rate scheduling (step decay, plateau), and progress tracking.

**Model Architecture** - Lightweight feedforward neural networks optimized for real-time inference with dropout regularization and configurable layer sizes.

**Data Augmentation** - Built-in augmentation techniques including rotation, Gaussian noise, and coordinate scaling to improve model robustness.

**Production Ready** - Easy integration with web frameworks (FastAPI, Flask), designed for REST APIs and real-time applications.

**Real-time Inference** - Optimized for low-latency predictions from MediaPipe hand landmarks with support for both CPU and GPU inference.

**Flexible Dataset Support** - Works with custom datasets in standardized formats, includes tools for dataset creation and validation.

## Installation

Install Smart Gestures using pip. The package requires Python 3.9+ and will automatically install all necessary dependencies including PyTorch, MediaPipe, and NumPy.

### From PyPI (Recommended)

```bash
pip install smart-gestures
```

### From Source

```bash
pip install git+https://github.com/vives-project-xp/SmartGlasses.git#subdirectory=notebooks/package
```

### Development Installation

```bash
git clone https://github.com/vives-project-xp/SmartGlasses.git
cd SmartGlasses/notebooks/package
pip install -e .
```

### Requirements

- Python 3.9 - 3.12
- PyTorch 2.7.0+
- MediaPipe 0.10.21
- NumPy 1.26.4
- Pandas 2.3.3
- tqdm 4.67.1

All dependencies are automatically installed with the package.

## Quick Start

Get up and running with Smart Gestures in minutes. This section shows you how to load a pre-trained model and make predictions from hand landmarks.

### Basic Usage

#### ASL Model

```python
from smart_gestures.alphabet.asl_model import ASLModel, get_classes

# Load classes
classes = get_classes()
# Create model
model = ASLModel()
# Make a prediction
predicted_letter = model.predict(input_tensor)
print(f"Predicted sign: {predicted_letter}")

```

#### VGT Model

```python
from smart_gestures.alphabet.vgt_model import VGTModel, get_classes

# Load classes
classes = get_classes()
# Create model
model = VGTModel()
# Make a prediction
predicted_letter = model.predict(input_tensor)
print(f"Predicted sign: {predicted_letter}")

```

#### LSTM Model

```python
from smart_gestures.gestures.lstm_model import LSTMModel, get_classes
# Load classes
classes = get_classes()
# Create model
model = LSTMModel()
# Make a prediction
predicted_gesture = model.predict(input_sequence)
print(f"Predicted gesture: {predicted_gesture}")
```

## Package Structure

Understanding the package structure helps you navigate the codebase and extend functionality:

```
smart_gestures/
├── __init__.py                     # Main package entry point
├── alphabet/                       # Alphabet recognition models
│   ├── __init__.py
│   ├── asl_model/                  # American Sign Language
│   │   ├── __init__.py             # Exports: get_classes, ASLModel class
|   │   ├── model.py                # Script defining the ASLModel architecture and class
│   │   ├── data/                   # Dataset storage
│   │   │   └── hand_landmarks.csv  # Training data
│   │   └── models/                 # Pre-trained model
|   │       └── asl_model.pth
│   └── vgt_model/                  # Flemish Sign Language
│       ├── __init__.py             # Exports: get_classes, VGTModel class
│       ├── model.py                # Script defining the VGTModel architecture and class
│       ├── data/                   # Processed dataset storage
│       │   └── hand_landmarks.json # Training data
│       └── models/                 # Pre-trained model
│           └── vgt_model.pth       
└── gestures/                       # Dynamic gesture recognition
    └── lstm_model/                 # LSTM-based sequence models (experimental)
        ├── __init__.py             # Exports: get_classes, LSTMModel class
        ├── model.py                # Script defining the LSTMModel architecture and class
        ├── data/                   # Dataset storage
        │   └── gesture_map.json    # Training data
        └── models/                 # Pre-trained model
             └── lstm_model.pth

```

## Data Format & Requirements

Smart Gestures works with MediaPipe hand landmarks for the alphabet recognition models (ASL and VGT) and sequences of hand and body landmarks for the LSTM model.

### Hand Landmark Structure

MediaPipe provides 21 landmarks per hand:
- **0**: Wrist
- **1-4**: Thumb (CMC, MCP, IP, Tip)
- **5-8**: Index finger (MCP, PIP, DIP, Tip)
- **9-12**: Middle finger (MCP, PIP, DIP, Tip)
- **13-16**: Ring finger (MCP, PIP, DIP, Tip)
- **17-20**: Pinky (MCP, PIP, DIP, Tip)

### Body Landmark Structure (for LSTM)
MediaPipe provides 33 body landmarks:
- **0**: Nose
- **1-10**: Eyes, Ears, Mouth
- **11-22**: Shoulders, Elbows, Wrists, Hands
- **23-32**: Hips, Knees, Ankles, Feet

### Landmark Coordinates
Each landmark has three coordinates:
- **x**: Horizontal position (normalized 0-1)
- **y**: Vertical position (normalized 0-1)
- **z**: Depth position (relative to the camera)

### Input Format

The ASL and VGT models expect input as a list of 21 landmarks, each represented as a dictionary with x, y, z keys:

```python

# List of dictionaries (from MediaPipe)
landmarks = [
    {"x": 0.5, "y": 0.3, "z": 0.1},
    {"x": 0.6, "y": 0.4, "z": 0.2},
    # ... 21 landmarks total
]
```

The LSTM model expects a sequence of such landmark lists for dynamic gesture recognition.

```python
# List of frames, each containing 258 landmarks
sequence = [
    [ {"x": 0.5, "y": 0.3, "z": 0.1}, ... ],  # Frame 1
    [ {"x": 0.6, "y": 0.4, "z": 0.2}, ... ],  # Frame 2
    # ... more frames
]
```

## FastAPI Integration

Smart Gestures is designed for easy integration with modern web frameworks. Here's a complete example of building a REST API with FastAPI for real-time sign language recognition.

### Complete FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from smart_gestures.alphabet.asl_model import ASLModel, get_classes
from pydantic import BaseModel
from schemas import ClassesResponse, PredictBody, PredictResponse

app = FastAPI()
# Load ASL model
classes = get_classes()
model = ASLModel()

class PredictionRequest(BaseModel):
    landmarks: list[dict]  # List of landmarks with x, y, z keys

@app.post("/predict")
async def predict(body: PredictBody) -> PredictResponse:
    landmarks = [landmark.model_dump() for landmark in body.landmarks]
    if len(landmarks) != 21:
        raise HTTPException(status_code=400, detail="Expected 21 landmarks.")
    try:
        prediction, confidence = model.predict(landmarks)
        return PredictResponse(prediction=prediction, confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/classes", response_model=ClassesResponse)
async def get_classes_endpoint():
    return ClassesResponse(classes=classes)
```

### Using the API

```python
import requests

# Single prediction
response = requests.post(
    "http://localhost:8000/predict",
    json={
        "landmarks": [
            {"x": 0.5, "y": 0.3, "z": 0.1},
            {"x": 0.6, "y": 0.4, "z": 0.2},
            # ... 21 landmarks total
        ]
    }
)

result = response.json()
print(f"Predicted: {result['prediction']}")
print(f"Confidence: {result['confidence']:.2%}")
```

### VGT Model with FastAPI

```python
from fastapi import FastAPI, HTTPException
from smart_gestures.alphabet.asl_model import ASLModel, get_classes
from pydantic import BaseModel
from schemas import ClassesResponse, PredictBody, PredictResponse

app = FastAPI()
# Load VGT model
classes = get_classes()
model = VGTModel()

class PredictionRequest(BaseModel):
    landmarks: list[dict]  # List of landmarks with x, y, z keys

@app.post("/predict")
async def predict(body: PredictBody) -> PredictResponse:
    landmarks = [landmark.model_dump() for landmark in body.landmarks]
    if len(landmarks) != 21:
        raise HTTPException(status_code=400, detail="Expected 21 landmarks.")
    try:
        prediction, confidence = model.predict(landmarks)
        return PredictResponse(prediction=prediction, confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/classes", response_model=ClassesResponse)
async def get_classes_endpoint():
    return ClassesResponse(classes=classes)

```

### LSTM Model with FastAPI

```python
from fastapi import FastAPI, HTTPException
from smart_gestures.gestures.lstm_model import LSTMModel, get_classes
from pydantic import BaseModel
from schemas import ClassesResponse, PredictBody, PredictResponse

app = FastAPI()
# Load LSTM model
classes = get_classes()
model = LSTMModel()

class PredictionRequest(BaseModel):
    sequence: list[list[dict]]  # List of frames, each with landmarks

@app.post("/predict")
async def predict(body: PredictBody) -> PredictResponse:
    sequence = [
        [landmark.model_dump() for landmark in frame.landmarks]
        for frame in body.sequence
    ]
    try:
        prediction, confidence = model.predict(sequence)
        return PredictResponse(prediction=prediction, confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/classes", response_model=ClassesResponse)
async def get_classes_endpoint():
    return ClassesResponse(classes=classes)
```

## Model Architecture

### Feedforward Neural Network

Both ASL and VGT models use a compact feedforward neural network optimized for real-time inference:

```
Input Layer: 63 features
├─ 21 hand landmarks × 3 coordinates (x, y, z)
│
Hidden Layer 1: 128 neurons
├─ Linear transformation (63 → 128)
├─ ReLU activation
└─ Dropout (p=0.3) for regularization
│
Hidden Layer 2: 64 neurons
├─ Linear transformation (128 → 64)
├─ ReLU activation
└─ Dropout (p=0.3) for regularization
│
Output Layer: num_classes neurons
├─ Linear transformation (64 → num_classes)
└─ Raw logits (apply softmax for probabilities)
```

**Key Features:**
- **Lightweight**: ~10K parameters for fast inference
- **Regularization**: Dropout prevents overfitting
- **Flexible**: Configurable input dimensions and class count
- **Efficient**: Optimized for CPU and GPU execution

**PyTorch Implementation:**
```python
import torch.nn as nn

class HandGestureModel(nn.Module):
    def __init__(self, in_dim=63, num_classes=26):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(in_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, num_classes)
        )
    
    def forward(self, x):
        return self.model(x)
```

### LSTM Network

The LSTM model is designed for sequence-based gesture recognition:

```Input Layer: Sequence of frames
├─ Each frame: 258 features (21 hand + 33 body landmarks × 3 coordinates)
│LSTM Layer: 128 hidden units
├─ Processes input sequences
│LSTM Layer: 128 hidden units
├─ Processes input sequences
└─ Output Layer: num_classes neurons
 └─ Raw logits (apply softmax for probabilities)
```
**Key Features:**
- **Temporal Modeling**: Captures sequential patterns in gestures
- **Scalable**: Handles variable-length input sequences
- **Robust**: Suitable for dynamic gesture recognition tasks

**PyTorch Implementation:**
```python
import torch.nn as nn
class GestureLSTMModel(nn.Module):
    def __init__(self, input_size=258, hidden_size=128, num_classes=10, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, num_classes)
    
    def forward(self, x):
        h_lstm, _ = self.lstm(x)
        out = self.fc(h_lstm[:, -1, :])  # Use the last time step
        return out
```

## Performance Benchmarks

| Model | Classes | Accuracy | Parameters | Inference Time* |
|-------|---------|----------|------------|-----------------|
| ASL   | 26      | ~95%     | ~10K       | <5ms            |
| VGT   | 26      | ~93%     | ~10K       | <5ms            |
| LSTM  | Custom  | Varies   | ~50K       | <10ms           |

*CPU inference time on Intel i7. GPU inference is typically <1ms.


## License

GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

## Authors

- **Simon Stijnen**
- **Lynn Deleare**
- **Olivier Westerman**

Maintained by **VIVES University of Applied Sciences - Project XP**

## Links

- **Documentation**: [GitHub Repository](https://github.com/vives-project-xp/SmartGlasses)
- **Issue Tracker**: [GitHub Issues](https://github.com/vives-project-xp/SmartGlasses/issues)
- **Source Code**: [GitHub](https://github.com/vives-project-xp/SmartGlasses/tree/main/notebooks/package)

## Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for hand tracking
- [PyTorch](https://pytorch.org/) for the deep learning framework
- VIVES University of Applied Sciences for supporting this project
