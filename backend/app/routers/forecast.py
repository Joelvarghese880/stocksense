from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.ml.forecaster import forecast_demand
from app.schemas.forecast import ForecastOut
from app.auth import get_current_user
from app.models.user import User
from app.models.product import Product

router = APIRouter(prefix="/forecast", tags=["Forecast"])


@router.get("/{product_id}", response_model=ForecastOut)
def get_forecast(
    product_id: int,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    result = forecast_demand(db, product_id, forecast_days=days)
    return result


@router.get("/")
def get_all_forecasts(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Returns forecast summary for all products"""
    products = db.query(Product).all()
    summaries = []

    for p in products:
        result = forecast_demand(db, p.id, forecast_days=days)
        summaries.append({
            "product_id": p.id,
            "product_name": p.name,
            "sku": p.sku,
            "total_predicted_demand": result["total_predicted_demand"],
            "avg_daily_demand": result["avg_daily_demand"],
            "method": result["method"]
        })

    return summaries