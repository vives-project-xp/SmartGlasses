from fastapi import APIRouter, HTTPException
from smart_gestures.gestures.lstm_model import LSTMModel, get_classes

from const import FastAPITags
from schemas import LSTMClassesResponse, LSTMPredictBody, LSTMPredictResponse

classes = get_classes()

model = LSTMModel()

router = APIRouter(
    prefix="/lstm",
    tags=[FastAPITags.LSTM_MODEL],
)


@router.get("/classes")
async def lstm_model_classes() -> LSTMClassesResponse:
    """
    Get the list of gesture classes that the LSTM model can predict.
    
    Returns:
        LSTMClassesResponse: A list of class names.
    """
    print(f"{classes=}")
    return LSTMClassesResponse(classes=classes)


@router.post("/predict")
async def lstm_model_predict(body: LSTMPredictBody) -> LSTMPredictResponse:
    """
    Predict a gesture from a sequence of keypoint frames.
    
    The LSTM model requires a sequence of frames, where each frame contains
    258 features: [POSE (33*4=132), Left Hand (21*3=63), Right Hand (21*3=63)].
    
    Args:
        body: LSTMPredictBody containing a sequence of keypoint frames.
        
    Returns:
        LSTMPredictResponse: The predicted gesture name and confidence score.
        
    Raises:
        HTTPException: If the input sequence is invalid or prediction fails.
    """
    try:
        # Convert the sequence to the format expected by the model
        sequence = body.to_numpy_sequence()
        
        # Get prediction and confidence from the model
        pred_name, confidence = model.predict(sequence) # type: ignore
        
        return LSTMPredictResponse(prediction=pred_name, confidence=confidence)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


__all__ = [
    "router",
]
