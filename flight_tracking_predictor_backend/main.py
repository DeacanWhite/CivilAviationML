# main.py
from fastapi import FastAPI, HTTPException, Depends, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import joblib
import datetime as dt
import time
import uuid

app = FastAPI()

logistic_model = joblib.load("./trained_models/logistic_regression_model.pkl")



class PredictionInput(BaseModel):
    airline : str
    origin : str
    destination : str
    date : dt.date


data_store = {}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Request: {request.url} - Duration: {process_time} seconds")
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "error": "An error occurred"}
    )

@app.post("/submit")
async def submit_input_data(data: PredictionInput, background_tasks: BackgroundTasks):

    prediction_id = str(uuid.uuid4())

    data_store[prediction_id] = {"data": data, "status": "processing"}

    background_tasks.add_task(process_data, prediction_id)

    return {"status": "data received, processing data", "id": prediction_id}

async def process_data(prediction_id: str):

    #input data processing for model input logic
    try:
        data_store[prediction_id]["status"] = "data processing complete"

    except Exception as e:
        data_store[prediction_id]["status"] = f"failed: {str(e)}"


@app.post("/predict")
async def predict_delay(data : PredictionInput):
    try:
        input_data = [[data.airline, data.origin, data.destination, data.date]]

        prediction = logistic_model.predict(input_data)

        return {"status": "success", "prediction": prediction[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"prediction failed: {str(e)}")
    

@app.get("/result/{prediction_id}")
async def get_result(prediction_id: str):
    if prediction_id in data_store:
        return {"status": data_store[prediction_id]["status"], "result": data_store[prediction_id].get("result")}
    else:
        raise HTTPException(status_code = 404, detail = "Result not found")
    
@app.post("/trigger_visuals/")
async def trigger_visuals(background_tasks: BackgroundTasks):

    background_tasks.add_task(generate_visuals)
    return {"status": "visualization triggered"}

async def generate_visuals():

    #visualization logic here

    try:
        print("visuals")
    except Exception as e:
        print(f"Visualization failed: {str(e)}")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
