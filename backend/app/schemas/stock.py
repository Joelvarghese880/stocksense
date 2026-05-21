from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.product import ProductOut
from app.schemas.warehouse import WarehouseOut

# --- Stock level ---
class StockOut(BaseModel):
    id: int
    product_id: int
    warehouse_id: int
    quantity: int
    updated_at: datetime
    product: ProductOut
    warehouse: WarehouseOut

    class Config:
        from_attributes = True

# --- Stock movement inputs ---
class StockIn(BaseModel):
    product_id: int
    warehouse_id: int
    quantity: int
    note: Optional[str] = None

class StockOut2(BaseModel):  # stock-out operation
    product_id: int
    warehouse_id: int
    quantity: int
    note: Optional[str] = None

class StockTransfer(BaseModel):
    product_id: int
    from_warehouse_id: int
    to_warehouse_id: int
    quantity: int
    note: Optional[str] = None

# --- Stock movement log ---
class StockMovementOut(BaseModel):
    id: int
    product_id: int
    warehouse_id: int
    movement_type: str
    quantity: int
    note: Optional[str]
    created_at: datetime
    product: ProductOut
    warehouse: WarehouseOut

    class Config:
        from_attributes = True