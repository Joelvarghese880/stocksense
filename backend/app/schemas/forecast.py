from pydantic import BaseModel
from typing import List

class DailyPrediction(BaseModel):
    date: str
    predicted_demand: int

class ForecastOut(BaseModel):
    product_id: int
    forecast_days: int
    total_predicted_demand: int
    avg_daily_demand: float
    predictions: List[DailyPrediction]
    data_points_used: int
    method: str