# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import datetime as dt

app = FastAPI()

logistic_model = joblib.load("./trained_models/logistic_regression_model.pkl")


class PredictionRequest(BaseModel):
    airline : str
    origin : str
    destination : str
    date : dt.date

@app.post("/predict")
async def predict_delay(data : PredictionRequest):
    try:
        input_data = [[data.airline, data.origin, data.destination, data.date]]

        prediction = logistic_model(input_data)

        return {"prediction" : prediction[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
