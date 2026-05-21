from sqlalchemy.orm import Session
from app.models.warehouse import Warehouse
from app.schemas.warehouse import WarehouseCreate, WarehouseUpdate

def get_all(db: Session):
    return db.query(Warehouse).all()

def get_by_id(db: Session, warehouse_id: int):
    return db.query(Warehouse).filter(Warehouse.id == warehouse_id).first()

def create(db: Session, data: WarehouseCreate):
    obj = Warehouse(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update(db: Session, warehouse_id: int, data: WarehouseUpdate):
    obj = get_by_id(db, warehouse_id)
    if not obj:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj

def delete(db: Session, warehouse_id: int):
    obj = get_by_id(db, warehouse_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj