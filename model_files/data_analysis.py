import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the CSV file into a DataFrame
file_path = 'processed_data/combined_logistic_non_cancelled_flights.csv'  # Replace with your actual file path
data = pd.read_csv(file_path)

# Group by the Origin, then calculate the mean DepartDelayAmount and ArriveDelayAmount for each origin
depart_delay_avg_by_origin = data.groupby('Origin')['DepartDelayAmount'].mean().reset_index()
arrive_delay_avg_by_origin = data.groupby('Origin')['ArriveDelayAmount'].mean().reset_index()

# Sort the data in ascending order by DepartDelayAmount and ArriveDelayAmount
depart_delay_avg_by_origin = depart_delay_avg_by_origin.sort_values(by='DepartDelayAmount')
arrive_delay_avg_by_origin = arrive_delay_avg_by_origin.sort_values(by='ArriveDelayAmount')

# Set up the plotting environment
sns.set(style="whitegrid")

# Create subplots for average DepartDelayAmount and ArriveDelayAmount against Origin
fig, axes = plt.subplots(2, 1, figsize=(14, 12))

# Plot average DepartDelayAmount vs. Origin (sorted)
sns.barplot(data=depart_delay_avg_by_origin, x='Origin', y='DepartDelayAmount', ax=axes[0])
axes[0].set_title('Average Depart Delay Amount by Origin')
axes[0].set_xlabel('Origin')
axes[0].set_ylabel('Average Depart Delay Amount (minutes)')
axes[0].tick_params(axis='x', rotation=90)

# Plot average ArriveDelayAmount vs. Origin (sorted)
sns.barplot(data=arrive_delay_avg_by_origin, x='Origin', y='ArriveDelayAmount', ax=axes[1])
axes[1].set_title('Average Arrive Delay Amount by Origin')
axes[1].set_xlabel('Origin')
axes[1].set_ylabel('Average Arrive Delay Amount (minutes)')
axes[1].tick_params(axis='x', rotation=90)

# Adjust layout for better readability
plt.tight_layout()

# Display the plots
plt.show()