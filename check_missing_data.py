import os
import pandas as pd
import glob

# Path to the folder containing the CSV files
path = 'test/*.csv'

# Get a list of all CSV files in the folder
all_files = glob.glob(path)

# Loop through each file
for filename in all_files:
    # Load the dataset
    df = pd.read_csv(filename)

    name_without_extension = os.path.splitext(filename)[0]

    # Rename the columns
    df.rename(columns={
        'FL_DATE': 'FlightDate', 
        'OP_CARRIER': 'Airline', 
        'ORIGIN': 'Origin', 
        'DEST': 'Destination',
        'CRS_DEP_TIME': 'PlannedDepartTime',
        'DEP_TIME': 'ActualDepartTime', 
        'DEP_DELAY': 'DepartDelayAmount',
        'CRS_ARR_TIME': 'PlannedArriveTime', 
        'ARR_TIME': 'ActualArriveTime', 
        'ARR_DELAY': 'ArriveDelayAmount',
        'CANCELLED': 'Cancelled'
    }, inplace=True)

    # Drop Unnecessary Columns
    df = df.drop([
        'OP_CARRIER_FL_NUM', 
        'CRS_ELAPSED_TIME', 
        'TAXI_OUT', 
        'WHEELS_OFF', 
        'WHEELS_ON', 
        'TAXI_IN', 
        'CRS_ELAPSED_TIME', 
        'ACTUAL_ELAPSED_TIME', 
        'AIR_TIME', 'DISTANCE', 
        'CANCELLATION_CODE', 
        'DIVERTED', 
        'CARRIER_DELAY',  
        'WEATHER_DELAY',  
        'NAS_DELAY',  
        'SECURITY_DELAY',  
        'LATE_AIRCRAFT_DELAY',  
        'Unnamed: 27'
    ], axis=1)
    
    df.to_csv(f'{name_without_extension}_non_cancelled_flights.csv', index=False)
    # Count NaN values for each column
    nan_counts = df.isnull().sum()
    
    # Print the file name and NaN counts
    print(f'NaN counts for {filename}:')
    print(nan_counts)
    print('\n')
