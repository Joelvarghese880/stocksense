from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

def get_all(db: Session, skip: int = 0, limit: int = 20):
    return db.query(Product).offset(skip).limit(limit).all()

def get_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_by_sku(db: Session, sku: str):
    return db.query(Product).filter(Product.sku == sku).first()

def create(db: Session, data: ProductCreate):
    obj = Product(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update(db: Session, product_id: int, data: ProductUpdate):
    obj = get_by_id(db, product_id)
    if not obj:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj

def delete(db: Session, product_id: int):
    obj = get_by_id(db, product_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj