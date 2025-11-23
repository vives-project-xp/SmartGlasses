"""
LSTM Gesture Model Subpackage

This subpackage contains the implementation of the LSTM-based gesture recognition model.

Available Components:
- LSTMModel: A class that encapsulates the LSTM gesture recognition model and its utilities.
- get_classes: Function to load the gesture classes used by the model.

"""
# import the necessary components
from .model import LSTMModel, get_classes

# export the components
__all__ = [
    "LSTMModel",
    "get_classes",
]
