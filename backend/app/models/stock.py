from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String, func
from sqlalchemy.orm import relationship
from app.database import Base

class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    product = relationship("Product", back_populates="stock_entries")
    warehouse = relationship("Warehouse")


class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    movement_type = Column(String(20), nullable=False)  # "IN", "OUT", "TRANSFER"
    quantity = Column(Integer, nullable=False)
    note = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product")
    warehouse = relationship("Warehouse")