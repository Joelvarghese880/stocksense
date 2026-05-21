from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.stock import Stock
from app.models.product import Product

def get_low_stock_alerts(db: Session, warehouse_id: int = None):
    """
    Returns all stock entries where quantity <= product's low_stock_threshold
    """
    query = db.query(Stock).join(Product).filter(
        Stock.quantity <= Product.low_stock_threshold
    )
    if warehouse_id:
        query = query.filter(Stock.warehouse_id == warehouse_id)

    low_stock = query.all()

    alerts = []
    for s in low_stock:
        alerts.append({
            "product_id": s.product_id,
            "product_name": s.product.name,
            "sku": s.product.sku,
            "warehouse_id": s.warehouse_id,
            "warehouse_name": s.warehouse.name,
            "current_quantity": s.quantity,
            "threshold": s.product.low_stock_threshold,
            "status": "OUT OF STOCK" if s.quantity == 0 else "LOW STOCK"
        })
    return alerts