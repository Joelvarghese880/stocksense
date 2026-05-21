from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    sku = Column(String(50), unique=True, nullable=False)  # Stock Keeping Unit
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    low_stock_threshold = Column(Integer, default=10)  # alert trigger
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    category = relationship("Category", backref="products")
    stock_entries = relationship("Stock", back_populates="product")