from fastapi import APIRouter

from const import FastAPITags

from . import lstm_model

router = APIRouter(
    prefix="/gestures",
    tags=[FastAPITags.GESTURES],
)

router.include_router(lstm_model.router)

__all__ = [
    "router",
]
