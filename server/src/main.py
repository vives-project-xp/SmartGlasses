from typing import Dict, List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from typing_extensions import TypedDict

import numpy as np
import torch
from pydantic import BaseModel, Field
import sys
import os
import uvicorn

# Add the path to the asl_model directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../notebooks/alphabet/asl_model'))

from data_utils import *
from model_utils import *

app = FastAPI()


class MessageResponse(TypedDict):
    message: str


@app.get("/")
async def root() -> MessageResponse:
    return {"message": "Hello World"}

# ---- Config ----
IN_DIM = 63           # 21 landmarks * (x,y,z)
NUM_POINTS = 21       # exact 21 punten


# ---- Data schema ----
class Landmark(BaseModel):
    x: float
    y: float
    z: float = 0.0

class PredictBody(BaseModel):
    landmarks: List[Landmark] = Field(..., min_items=NUM_POINTS, max_items=NUM_POINTS)


_classes_raw = get_classes()
if isinstance(_classes_raw, dict):
    # index->naam dict naar lijst; gesorteerd op index
    class_names: List[str] = [name for _, name in sorted(((int(k), v) for k, v in _classes_raw.items()),
                                                         key=lambda kv: kv[0])]
else:
    class_names = list(_classes_raw)

# Create model and load weights
model = create_model(num_classes=len(class_names), in_dim=IN_DIM)
model_path = os.path.join(os.path.dirname(__file__), '../../notebooks/alphabet/asl_model/models/hand_gesture_model.pth')
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=DEVICE))
model.eval()


# ---- Endpoints ----
@app.get("/class-names")
def get_class_names():
    return {"classes": class_names}

@app.post("/predict")
def predict(body: PredictBody):
    # naar (21,3) -> (1,63)
    pts = np.array([[lm.x, lm.y, lm.z] for lm in body.landmarks], dtype=np.float32)
    if pts.shape != (NUM_POINTS, 3):
        raise HTTPException(status_code=400, detail=f"Expected shape (21,3), got {pts.shape}")

    # Belangrijk: pas hier dezelfde preprocessing toe als bij training indien nodig
    x = torch.from_numpy(pts.reshape(1, IN_DIM)).to(DEVICE)

    with torch.no_grad():
        logits = model(x)
        pred_idx = int(torch.argmax(logits, dim=1).item())
        pred_name = class_names[pred_idx]

    return {"prediction": pred_name}


class ConnectionManager:
    """Manage active WebSocket connections keyed by client id."""

    def __init__(self) -> None:
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str) -> None:
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str) -> None:
        self.active_connections.pop(client_id, None)

    async def send_personal_message(self, message: str, client_id: str) -> None:
        ws = self.active_connections.get(client_id)
        if ws:
            await ws.send_text(message)

    async def broadcast(self, message: str) -> None:
        for connection in list(self.active_connections.values()):
            try:
                await connection.send_text(message)
            except Exception:
                # ignore send errors; clients that error will be cleaned up on disconnect
                pass


manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """Accept a websocket connection for a client and echo/broadcast messages.

    Path parameter:
    - client_id: arbitrary identifier for the connecting client (string)

    Behaviour:
    - on connect: accepts and announces the join to all clients
    - while connected: relays incoming text messages to all clients
    - on disconnect: removes client and announces the leave
    """
    await manager.connect(websocket, client_id)
    await manager.broadcast(f"Client {client_id} connected")
    try:
        while True:
            data = await websocket.receive_text()
            # simple broadcast protocol; you can replace with JSON or other formats
            await manager.broadcast(f"{client_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await manager.broadcast(f"Client {client_id} disconnected")

if __name__ == "__main__":
   uvicorn.run(app, host="0.0.0.0", port=9999)