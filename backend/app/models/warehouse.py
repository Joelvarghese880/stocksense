from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database import Base

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())