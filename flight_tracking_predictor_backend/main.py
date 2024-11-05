from fastapi import FastAPI, HTTPException, Depends, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import datetime as dt
import time
import uuid

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; adjust for specific origins in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Load the pre-trained model
model_path = './trained_models/logistic_regression_model.pkl'
try:
    logistic_model = joblib.load(model_path)
    print("Model loaded successfully.")
except FileNotFoundError:
    print(f"Error: Model file not found at {model_path}")
    exit()

class PredictionInput(BaseModel):
    airline: str
    origin: str
    destination: str
    flight_date: dt.date
    planned_depart_time: str  # Expecting HHMM format

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
    data_store[prediction_id] = {"data": data.dict(), "status": "processing"}
    background_tasks.add_task(process_data, prediction_id)
    return {"status": "data received, processing data", "id": prediction_id}

async def process_data(prediction_id: str):
    try:
        raw_data = data_store[prediction_id]["data"]
        user_input = {
            'Airline': [raw_data['airline']],
            'Origin': [raw_data['origin']],
            'Destination': [raw_data['destination']],
            'FlightDate': [raw_data['flight_date']],
            'PlannedDepartTime': [raw_data['planned_depart_time']]
        }
        user_df = pd.DataFrame(user_input)
        
        # Process the date and time fields
        user_df['FlightDate'] = pd.to_datetime(user_df['FlightDate'], errors='coerce')
        user_df['DayOfWeek'] = user_df['FlightDate'].dt.dayofweek
        user_df['Hour'] = pd.to_datetime(user_df['PlannedDepartTime'], format='%H%M', errors='coerce').dt.hour
        
        # Check for invalid date or time
        if user_df[['DayOfWeek', 'Hour']].isna().any().any():
            data_store[prediction_id]["status"] = "failed: invalid date or time format"
            return
        
        # Store processed data
        data_store[prediction_id]["processed_data"] = user_df[['Airline', 'Origin', 'Destination', 'DayOfWeek', 'Hour']].iloc[0].tolist()
        data_store[prediction_id]["status"] = "data processing complete"
    except Exception as e:
        data_store[prediction_id]["status"] = f"failed: {str(e)}"

@app.post("/predict/{prediction_id}")
async def predict_delay(prediction_id: str):
    try:
        if prediction_id not in data_store:
            raise HTTPException(status_code=404, detail="Prediction ID not found")
        
        if "processed_data" not in data_store[prediction_id]:
            raise HTTPException(status_code=400, detail="Data not processed yet")
        
        processed_input = [data_store[prediction_id]["processed_data"]]
        
        # Predict delay probability
        delay_prob = logistic_model.predict_proba(processed_input)[0][1]
        
        # Store prediction result
        data_store[prediction_id]["status"] = "prediction complete"
        data_store[prediction_id]["result"] = {"delay_probability": delay_prob}
        
        return {"status": "success", "prediction_id": prediction_id, "delay_probability": delay_prob}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/result/{prediction_id}")
async def get_result(prediction_id: str):
    if prediction_id in data_store:
        return {"status": data_store[prediction_id]["status"], "result": data_store[prediction_id].get("result")}
    else:
        raise HTTPException(status_code=404, detail="Result not found")

@app.post("/trigger_visuals/")
async def trigger_visuals(background_tasks: BackgroundTasks):
    background_tasks.add_task(generate_visuals)
    return {"status": "visualization triggered"}

async def generate_visuals():
    try:
        print("Generating visuals...")
    except Exception as e:
        print(f"Visualization failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
