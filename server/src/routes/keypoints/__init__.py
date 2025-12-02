from typing import Any, cast

import cv2 as cv
import numpy as np
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import RedirectResponse
from mediapipe.python.solutions import hands as mp_hands
from mediapipe.python.solutions import holistic as mp_holistic

from const import FastAPITags
from schemas import HandKeypointsResponse, HandLandmark, LSTMFrame, PoseLandmark

router = APIRouter(
    prefix="/keypoints",
    tags=[FastAPITags.KEYPOINTS],
)

# Initialize MediaPipe Hands once at module load for maximum performance
# This eliminates the overhead of creating a new instance for each request
_hands_detector = mp_hands.Hands(
    static_image_mode=True,  # Optimized for single images
    max_num_hands=2,  # Detect up to 2 hands
    min_detection_confidence=0.5,  # Balanced detection threshold
    min_tracking_confidence=0.5,  # Balanced tracking threshold
)
_holistic_detector = mp_holistic.Holistic(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)


def prepare_image(image_data: bytes) -> np.ndarray[Any, Any]:
    """Read and convert uploaded image to RGB numpy array."""
    # convert to numpy image
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv.imdecode(nparr, cv.IMREAD_COLOR)

    # Convert BGR to RGB for MediaPipe
    img_rgb = cv.cvtColor(img, cv.COLOR_BGR2RGB)
    return img_rgb


@router.post("/", deprecated=True)
def root(
    image: UploadFile = File(...),
) -> HandKeypointsResponse:
    """
    Redirect to /hands endpoint for hand keypoint extraction.
    """
    return cast(HandKeypointsResponse, RedirectResponse(url="/hands"))


@router.post("/hands")
async def extract_hands_keypoints(
    image: UploadFile = File(...),
) -> HandKeypointsResponse:
    """
    Extract hand keypoints from an uploaded image using MediaPipe Hands.
    """
    # read bytes
    data = await image.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty image file")

    # Prepare image
    img_rgb = prepare_image(data)

    # Use the persistent detector instance for faster processing
    results = _hands_detector.process(img_rgb)  # type: ignore

    if not results or not results.multi_hand_landmarks:  # type: ignore
        # no hand detected
        raise HTTPException(status_code=404, detail="No hand detected")

    hand_landmarks = results.multi_hand_landmarks[0]  # type: ignore
    landmarks: list[HandLandmark] = []
    for lm in cast(list[mp_hands.HandLandmark], hand_landmarks.landmark):  # type: ignore
        # lm.x, lm.y, lm.z are normalized to [0,1] (z is relative)
        landmarks.append(HandLandmark(x=float(lm.x), y=float(lm.y), z=float(lm.z)))  # type: ignore

    return HandKeypointsResponse(landmarks=landmarks)


@router.post("/pose")
async def extract_pose_keypoints(
    image: UploadFile = File(...),
) -> LSTMFrame:
    """
    Extract pose and hand keypoints from an uploaded image using MediaPipe Holistic.
    """
    # read bytes
    data = await image.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty image file")

    # Prepare image
    img_rgb = prepare_image(data)
    # Use the persistent detector instance for faster processing
    results: Any = _holistic_detector.process(img_rgb)  # type: ignore

    if not results:
        raise HTTPException(status_code=500, detail="Holistic processing failed")

    pose_landmarks = results.pose_landmarks
    left_hand_landmarks = results.left_hand_landmarks
    right_hand_landmarks = results.right_hand_landmarks

    if not pose_landmarks and not left_hand_landmarks and not right_hand_landmarks:
        raise HTTPException(status_code=404, detail="No pose or hands detected")

    pose: list[PoseLandmark] = []
    if pose_landmarks:
        for lm in pose_landmarks.landmark:  # type: ignore
            pose.append(
                PoseLandmark(
                    x=float(lm.x),
                    y=float(lm.y),
                    z=float(lm.z),
                    visibility=float(getattr(lm, "visibility", 0.0)),
                )
            )

    lh: list[HandLandmark] = []
    if left_hand_landmarks:
        for lm in left_hand_landmarks.landmark:  # type: ignore
            lh.append(HandLandmark(x=float(lm.x), y=float(lm.y), z=float(lm.z)))

    rh: list[HandLandmark] = []
    if right_hand_landmarks:
        for lm in right_hand_landmarks.landmark:  # type: ignore
            rh.append(HandLandmark(x=float(lm.x), y=float(lm.y), z=float(lm.z)))

    return LSTMFrame(
        pose=pose,
        left_hand=lh,
        right_hand=rh,
    )
