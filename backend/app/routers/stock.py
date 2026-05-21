from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import stock as crud
from app.crud import alerts
from app.schemas.stock import StockIn, StockOut2, StockTransfer, StockOut, StockMovementOut
from app.auth import get_current_user, require_admin
from app.models.user import User
from typing import List, Optional

router = APIRouter(prefix="/stock", tags=["Stock"])


# --- View current stock levels ---
@router.get("/", response_model=List[StockOut])
def get_stock_levels(
    warehouse_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_all_stock(db, warehouse_id)


# --- Stock IN ---
@router.post("/in", response_model=StockOut)
def add_stock(
    data: StockIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # both roles can do stock-in
):
    return crud.stock_in(db, data)


# --- Stock OUT ---
@router.post("/out", response_model=StockOut)
def remove_stock(
    data: StockOut2,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.stock_out(db, data)


# --- Transfer ---
@router.post("/transfer")
def transfer(
    data: StockTransfer,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)  # only admin can transfer
):
    return crud.transfer_stock(db, data)


# --- Movement history / audit log ---
@router.get("/movements", response_model=List[StockMovementOut])
def get_movements(
    product_id: Optional[int] = None,
    warehouse_id: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_movements(db, product_id, warehouse_id, limit)


# --- Low stock alerts ---
@router.get("/alerts")
def low_stock_alerts(
    warehouse_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return alerts.get_low_stock_alerts(db, warehouse_id)