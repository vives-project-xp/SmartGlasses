from typing import TypedDict
from fastapi import FastAPI

app = FastAPI()

class MessageResponse(TypedDict):
    message: str

@app.get("/")
async def root() -> MessageResponse:
    return {"message": "Hello World"}
