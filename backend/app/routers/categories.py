from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import category as crud
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryOut
from app.auth import get_current_user, require_admin
from app.models.user import User
from typing import List

router = APIRouter(prefix="/categories", tags=["Categories"])

# Anyone logged in can view
@router.get("/", response_model=List[CategoryOut])
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_all(db)

@router.get("/{category_id}", response_model=CategoryOut)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    obj = crud.get_by_id(db, category_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Category not found")
    return obj

# Only admin can create, update, delete
@router.post("/", response_model=CategoryOut, status_code=201)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return crud.create(db, data)

@router.put("/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    obj = crud.update(db, category_id, data)
    if not obj:
        raise HTTPException(status_code=404, detail="Category not found")
    return obj

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    obj = crud.delete(db, category_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Deleted successfully"}