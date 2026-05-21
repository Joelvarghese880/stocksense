from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WarehouseCreate(BaseModel):
    name: str
    location: Optional[str] = None

class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None

class WarehouseOut(BaseModel):
    id: int
    name: str
    location: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True