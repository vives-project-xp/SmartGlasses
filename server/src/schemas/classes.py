from pydantic import BaseModel, Field


class ClassesResponse(BaseModel):
    classes: list[str] = Field(..., description="List of class names")


class LSTMClassesResponse(BaseModel):
    classes: dict[str, int] = Field(...,
                                    description="List of LSTM class names")
