import numpy as np
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.stock import StockMovement


def get_daily_demand(db: Session, product_id: int, days: int = 90):
    """
    Aggregates past OUT movements per day for a product.
    Returns a list of (day_index, quantity_out) pairs.
    """
    cutoff = datetime.utcnow() - timedelta(days=days)

    movements = db.query(StockMovement).filter(
        StockMovement.product_id == product_id,
        StockMovement.movement_type == "OUT",
        StockMovement.created_at >= cutoff
    ).all()

    if not movements:
        return []

    # Group by date
    daily = {}
    for m in movements:
        date_key = m.created_at.date()
        daily[date_key] = daily.get(date_key, 0) + m.quantity

    # Sort by date and convert to indexed list
    sorted_days = sorted(daily.items())
    return [(i, qty) for i, (_, qty) in enumerate(sorted_days)]


def forecast_demand(db: Session, product_id: int, forecast_days: int = 30):
    """
    Trains a simple linear regression on past daily demand
    and predicts demand for the next N days.
    """
    data = get_daily_demand(db, product_id)

    # Not enough data — return average-based fallback
    if len(data) < 3:
        return _fallback_forecast(db, product_id, forecast_days)

    X = np.array([d[0] for d in data]).reshape(-1, 1)
    y = np.array([d[1] for d in data])

    # Linear regression manually (no sklearn import needed for this)
    x_mean = np.mean(X)
    y_mean = np.mean(y)
    
    numerator = np.sum((X.flatten() - x_mean) * (y - y_mean))
    denominator = np.sum((X.flatten() - x_mean) ** 2)
    
    slope = numerator / denominator if denominator != 0 else 0
    intercept = y_mean - slope * x_mean

    # Predict next N days
    last_index = X[-1][0]
    predictions = []
    today = datetime.utcnow().date()

    for i in range(1, forecast_days + 1):
        day_index = last_index + i
        predicted_qty = max(0, round(slope * day_index + intercept))
        future_date = today + timedelta(days=i)
        predictions.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "predicted_demand": int(predicted_qty)
        })

    total_predicted = sum(p["predicted_demand"] for p in predictions)
    avg_daily = round(total_predicted / forecast_days, 1)

    return {
        "product_id": product_id,
        "forecast_days": forecast_days,
        "total_predicted_demand": total_predicted,
        "avg_daily_demand": avg_daily,
        "predictions": predictions,
        "data_points_used": len(data),
        "method": "linear_regression"
    }


def _fallback_forecast(db: Session, product_id: int, forecast_days: int):
    """
    When there's not enough historical data,
    use simple average of available movements.
    """
    movements = db.query(StockMovement).filter(
        StockMovement.product_id == product_id,
        StockMovement.movement_type == "OUT"
    ).all()

    if not movements:
        avg_daily = 0
    else:
        total = sum(m.quantity for m in movements)
        avg_daily = round(total / max(len(movements), 1), 1)

    today = datetime.utcnow().date()
    predictions = []
    for i in range(1, forecast_days + 1):
        future_date = today + timedelta(days=i)
        predictions.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "predicted_demand": int(avg_daily)
        })

    return {
        "product_id": product_id,
        "forecast_days": forecast_days,
        "total_predicted_demand": int(avg_daily * forecast_days),
        "avg_daily_demand": avg_daily,
        "predictions": predictions,
        "data_points_used": len(movements),
        "method": "average_fallback"
    }