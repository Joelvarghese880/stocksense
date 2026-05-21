from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import product as crud
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut
from app.auth import get_current_user, require_admin
from app.models.user import User
from typing import List

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=List[ProductOut])
def list_products(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_all(db, skip, limit)

@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    obj = crud.get_by_id(db, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Product not found")
    return obj

@router.post("/", response_model=ProductOut, status_code=201)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    if crud.get_by_sku(db, data.sku):
        raise HTTPException(status_code=400, detail="SKU already exists")
    return crud.create(db, data)

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    obj = crud.update(db, product_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Product not found")
    return obj

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    obj = crud.delete(db, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Deleted successfully"}