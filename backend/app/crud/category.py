from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

def get_all(db: Session):
    return db.query(Category).all()

def get_by_id(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()

def create(db: Session, data: CategoryCreate):
    obj = Category(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update(db: Session, category_id: int, data: CategoryUpdate):
    obj = get_by_id(db, category_id)
    if not obj:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj

def delete(db: Session, category_id: int):
    obj = get_by_id(db, category_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj