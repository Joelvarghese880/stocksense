from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.stock import Stock, StockMovement
from app.models.product import Product
from app.schemas.stock import StockIn, StockOut2, StockTransfer
from fastapi import HTTPException


def get_stock(db: Session, product_id: int, warehouse_id: int):
    return db.query(Stock).filter(
        and_(Stock.product_id == product_id, Stock.warehouse_id == warehouse_id)
    ).first()


def get_all_stock(db: Session, warehouse_id: int = None):
    query = db.query(Stock)
    if warehouse_id:
        query = query.filter(Stock.warehouse_id == warehouse_id)
    return query.all()


def stock_in(db: Session, data: StockIn):
    # Get or create stock entry
    stock = get_stock(db, data.product_id, data.warehouse_id)
    if not stock:
        stock = Stock(
            product_id=data.product_id,
            warehouse_id=data.warehouse_id,
            quantity=0
        )
        db.add(stock)

    stock.quantity += data.quantity

    # Record movement
    movement = StockMovement(
        product_id=data.product_id,
        warehouse_id=data.warehouse_id,
        movement_type="IN",
        quantity=data.quantity,
        note=data.note
    )
    db.add(movement)
    db.commit()
    db.refresh(stock)
    return stock


def stock_out(db: Session, data: StockOut2):
    stock = get_stock(db, data.product_id, data.warehouse_id)

    # Check if stock exists and is sufficient
    if not stock or stock.quantity < data.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock. Available: {stock.quantity if stock else 0}"
        )

    stock.quantity -= data.quantity

    # Record movement
    movement = StockMovement(
        product_id=data.product_id,
        warehouse_id=data.warehouse_id,
        movement_type="OUT",
        quantity=data.quantity,
        note=data.note
    )
    db.add(movement)
    db.commit()
    db.refresh(stock)
    return stock


def transfer_stock(db: Session, data: StockTransfer):
    # Check source stock
    source = get_stock(db, data.product_id, data.from_warehouse_id)
    if not source or source.quantity < data.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock in source warehouse. Available: {source.quantity if source else 0}"
        )

    # Deduct from source
    source.quantity -= data.quantity

    # Add to destination
    dest = get_stock(db, data.product_id, data.to_warehouse_id)
    if not dest:
        dest = Stock(
            product_id=data.product_id,
            warehouse_id=data.to_warehouse_id,
            quantity=0
        )
        db.add(dest)
    dest.quantity += data.quantity

    # Record two movements
    db.add(StockMovement(
        product_id=data.product_id,
        warehouse_id=data.from_warehouse_id,
        movement_type="TRANSFER",
        quantity=data.quantity,
        note=data.note or f"Transfer to warehouse {data.to_warehouse_id}"
    ))
    db.add(StockMovement(
        product_id=data.product_id,
        warehouse_id=data.to_warehouse_id,
        movement_type="TRANSFER",
        quantity=data.quantity,
        note=data.note or f"Transfer from warehouse {data.from_warehouse_id}"
    ))

    db.commit()
    return {"message": "Transfer successful", "quantity": data.quantity}


def get_movements(db: Session, product_id: int = None, warehouse_id: int = None, limit: int = 50):
    query = db.query(StockMovement)
    if product_id:
        query = query.filter(StockMovement.product_id == product_id)
    if warehouse_id:
        query = query.filter(StockMovement.warehouse_id == warehouse_id)
    return query.order_by(StockMovement.created_at.desc()).limit(limit).all()