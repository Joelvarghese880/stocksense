from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import warehouse as crud
from app.schemas.warehouse import WarehouseCreate, WarehouseUpdate, WarehouseOut
from app.auth import get_current_user, require_admin
from app.models.user import User
from typing import List

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])

@router.get("/", response_model=List[WarehouseOut])
def list_warehouses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_all(db)

@router.get("/{warehouse_id}", response_model=WarehouseOut)
def get_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    obj = crud.get_by_id(db, warehouse_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return obj

@router.post("/", response_model=WarehouseOut, status_code=201)
def create_warehouse(
    data: WarehouseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return crud.create(db, data)

@router.put("/{warehouse_id}", response_model=WarehouseOut)
def update_warehouse(
    warehouse_id: int,
    data: WarehouseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    obj = crud.update(db, warehouse_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return obj

@router.delete("/{warehouse_id}")
def delete_warehouse(
    warehouse_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    obj = crud.delete(db, warehouse_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return {"message": "Deleted successfully"}