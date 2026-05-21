from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class CategoryOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True  # tells Pydantic to read from ORM objects