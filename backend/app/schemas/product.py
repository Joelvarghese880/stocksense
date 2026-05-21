from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.category import CategoryOut

class ProductCreate(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    price: float
    low_stock_threshold: int = 10
    category_id: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    low_stock_threshold: Optional[int] = None
    category_id: Optional[int] = None

class ProductOut(BaseModel):
    id: int
    name: str
    sku: str
    description: Optional[str]
    price: float
    low_stock_threshold: int
    category_id: int
    category: CategoryOut
    created_at: datetime

    class Config:
        from_attributes = True