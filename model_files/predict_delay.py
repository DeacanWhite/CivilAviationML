import pandas as pd
import joblib
from datetime import datetime

# Load the pre-trained model
model_path = 'model_files\logistic_regression_model_new.pkl'
try:
    model = joblib.load(model_path)
    print("Model loaded successfully.")
except FileNotFoundError:
    print(f"Error: Model file not found at {model_path}")
    exit()

# Function to process user input and predict delay probability
def predict_delay(airline, origin, destination, flight_date, planned_depart_time):
    # Prepare user input as a dictionary
    user_input = {
        'Airline': [airline],
        'Origin': [origin],
        'Destination': [destination],
        'FlightDate': [flight_date],
        'PlannedDepartTime': [planned_depart_time]
    }

    # Convert user input to DataFrame
    user_df = pd.DataFrame(user_input)

    # Process the date and time fields
    try:
        # Convert FlightDate to datetime and extract day of the week
        user_df['FlightDate'] = pd.to_datetime(user_df['FlightDate'], errors='coerce')
        user_df['DayOfWeek'] = user_df['FlightDate'].dt.dayofweek
        
        # Convert PlannedDepartTime to datetime and extract hour
        user_df['Hour'] = pd.to_datetime(user_df['PlannedDepartTime'], format='%H%M', errors='coerce').dt.hour
        
        # Check for any NaN values after conversion
        if user_df[['DayOfWeek', 'Hour']].isna().any().any():
            print("Error: Invalid date or time format in user input.")
            return None
    except Exception as e:
        print("Error processing user input:", e)
        return None

    # Select only the necessary columns for prediction
    X_user = user_df[['Airline', 'Origin', 'Destination', 'DayOfWeek', 'Hour']]

    # Predict delay probability
    try:
        # Get delay probability
        delay_prob = model.predict_proba(X_user)[0][1]
        print(f"Delay Probability: {delay_prob * 100:.2f}%")
        return delay_prob
    except Exception as e:
        print("Error during prediction:", e)
        return None

# Sample user input (replace these values with actual user inputs)
airline = 'B6'
origin = 'LAX'
destination = 'SAV'
flight_date = '2018-11-02'  # YYYY-MM-DD format
planned_depart_time = '2030'  # HHMM format

# Run prediction
predict_delay(airline, origin, destination, flight_date, planned_depart_time)
