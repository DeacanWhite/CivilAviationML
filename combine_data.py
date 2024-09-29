import os
import pandas as pd
import glob

# Path to the folder containing the processed datasets
path = 'processed_data/'  # Adjust the path as needed

# Get all files that match the naming patterns
non_cancelled_files_logistic = glob.glob(os.path.join(path, '*_logistic_non_cancelled_flights.csv'))
cancelled_files_logistic = glob.glob(os.path.join(path, '*_logistic_cancelled_flights.csv'))
non_cancelled_files_general = glob.glob(os.path.join(path, '*_non_cancelled_flights.csv'))
cancelled_files_general = glob.glob(os.path.join(path, '*_cancelled_flights.csv'))

# Create empty lists to store DataFrames
non_cancelled_dfs = []
cancelled_dfs = []
non_cancelled_logistic_dfs = []
cancelled_logistic_dfs = []

# Function to combine and save datasets
def combine_and_save(dataframes, output_filename):
    if dataframes:
        combined_df = pd.concat(dataframes, ignore_index=True)
        combined_df.to_csv(os.path.join(path, output_filename), index=False)
        print(f"{output_filename} saved successfully.")
    else:
        print(f"No data available to combine for {output_filename}.")

# Process _logistic files
if non_cancelled_files_logistic:
    for file in non_cancelled_files_logistic:
        df = pd.read_csv(file)
        non_cancelled_logistic_dfs.append(df)
    combine_and_save(non_cancelled_logistic_dfs, 'combined_logistic_non_cancelled_flights.csv')

if cancelled_files_logistic:
    for file in cancelled_files_logistic:
        df = pd.read_csv(file)
        cancelled_logistic_dfs.append(df)
    combine_and_save(cancelled_logistic_dfs, 'combined_logistic_cancelled_flights.csv')

# Process general files
if non_cancelled_files_general:
    for file in non_cancelled_files_general:
        df = pd.read_csv(file)
        non_cancelled_dfs.append(df)
    combine_and_save(non_cancelled_dfs, 'combined_non_cancelled_flights.csv')

if cancelled_files_general:
    for file in cancelled_files_general:
        df = pd.read_csv(file)
        cancelled_dfs.append(df)
    combine_and_save(cancelled_dfs, 'combined_cancelled_flights.csv')

print("All available datasets have been processed.")
