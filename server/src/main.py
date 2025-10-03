from typing import Dict, TypedDict

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()


class MessageResponse(TypedDict):
    message: str


@app.get("/")
async def root() -> MessageResponse:
    return {"message": "Hello World"}


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
