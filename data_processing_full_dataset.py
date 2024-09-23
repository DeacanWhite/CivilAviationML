import os
import pandas as pd
import time
import glob

# Start the timer
start_time = time.time()

# Path to the folder containing the CSV files
path = 'unprocessed_data/*.csv'

# Set the export directory
export_directory = 'processed_data/'

# check if the import directory exists, if not create it
if not os.path.exists('unprocessed_data'):
    os.makedirs('unprocessed_data')

# check if the export directory exists, if not create it
if not os.path.exists('processed_data'):
    os.makedirs('processed_data')

# Get a list of all CSV files in the folder
all_files = glob.glob(path)

# Loop through each file
for filename in all_files:
    # Load the dataset
    df = pd.read_csv(filename)

    # Extract only the filename without the extension
    name_without_extension = os.path.splitext(os.path.basename(filename))[0]

    
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

    #$ Drop Unnecessary Columns
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

    # End the timer
    end_time = time.time()

    # Calculate and print the time taken
    time_taken = end_time - start_time
    print(f"Time taken to load the dataset: {time_taken} seconds")

    # Start the timer for the data processing
    start_time = time.time()

    # Drop rows with missing values in PlannedDepartTime and PlannedArriveTime
    df = df.dropna(subset=['PlannedDepartTime','PlannedArriveTime'], how='any')

    # format the initial time columns for all 
    df['PlannedDepartTime'] = df['PlannedDepartTime'].apply(lambda x: f'{int(x // 100):02}:{int(x % 100):02}')
    df['PlannedArriveTime'] = df['PlannedArriveTime'].apply(lambda x: f'{int(x // 100):02}:{int(x % 100):02}')

    # Separate cancelled and non-cancelled flights
    cancelled_flights = df[df['Cancelled'] == 1]
    non_cancelled_flights = df[df['Cancelled'] != 1]

    # Drop rows with missing values in non-cancelled flights
    non_cancelled_flights = non_cancelled_flights.dropna(subset=['PlannedDepartTime', 'ActualDepartTime', 'PlannedArriveTime', 'ActualArriveTime'], how='any')

    # format the remaining columns for non_cancelled_flights
    non_cancelled_flights['ActualDepartTime'] = non_cancelled_flights['ActualDepartTime'].apply(lambda x: f'{int(x // 100):02}:{int(x % 100):02}')
    non_cancelled_flights['ActualArriveTime'] = non_cancelled_flights['ActualArriveTime'].apply(lambda x: f'{int(x // 100):02}:{int(x % 100):02}')

    # Function to convert HH:MM to total minutes
    def time_to_minutes(time_str):
        if pd.notna(time_str):
            hours, minutes = map(int, time_str.split(':'))
            return hours * 60 + minutes
        return None

    # Apply the function only to rows where DepartDelayAmount is NaN
    mask_depart = non_cancelled_flights['DepartDelayAmount'].isna()
    non_cancelled_flights.loc[mask_depart, 'DepartDelayAmount'] = (
        non_cancelled_flights.loc[mask_depart, 'ActualDepartTime'].apply(time_to_minutes) - 
        non_cancelled_flights.loc[mask_depart, 'PlannedDepartTime'].apply(time_to_minutes)
    ).astype(int)

    # Apply the function only to rows where ArriveDelayAmount is NaN
    mask_arrive = non_cancelled_flights['ArriveDelayAmount'].isna()
    non_cancelled_flights.loc[mask_arrive, 'ArriveDelayAmount'] = (
        non_cancelled_flights.loc[mask_arrive, 'ActualArriveTime'].apply(time_to_minutes) - 
        non_cancelled_flights.loc[mask_arrive, 'PlannedArriveTime'].apply(time_to_minutes)
    ).astype(int)

    # End the timer for the data processing
    end_time = time.time()
    print(f"Time taken to process the dataset: {time_taken} seconds")

    # Write non-cancelled flights DataFrame to a CSV file
    non_cancelled_flights.to_csv(os.path.join(export_directory, f'{name_without_extension}_non_cancelled_flights.csv'), index=False)

    cancelled_flights.to_csv(os.path.join(export_directory, f'{name_without_extension}_cancelled_flights.csv'), index=False)

    ## Print the processed DataFrames and NaN counts
    print('\n')
    print(f'DataFrames for {filename}:')

    # Print the processed DataFrame
    print(non_cancelled_flights.head(), '\n')
    print(cancelled_flights.head(), '\n')

    # Print the number of NaN values in each column in non_cancelled_flights
    nan_counts = non_cancelled_flights.isnull().sum()
    print(nan_counts)
    print('\n')

    # Print the number of NaN values in each column in cancelled_flights
    nan_counts = cancelled_flights.isnull().sum()
    print(nan_counts)