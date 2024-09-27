# Import necessary libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

from parameters import non_cancelled_flights_df as df

# Preprocess the data

#convert FlightDate to datetime
df['FlightDate'] = pd.to_datetime(df['FlightDate'])

#extract day of the year
df['DayOfYear'] = df['FlightDate'].dt.dayofyear

#extract day of the week
df['DayOfWeek'] = df['FlightDate'].dt.weekday

#convert Time columns from string to datetime
df['PlannedDepartTime'] = pd.to_datetime(df['PlannedDepartTime'], format='%H:%M', errors='coerce')
df['PlannedArriveTime'] = pd.to_datetime(df['PlannedArriveTime'], format='%H:%M', errors='coerce')

#extract features
df['PlannedDepartHour'] = df['PlannedDepartTime'].dt.hour
df['PlannedDepartMinute'] = df['PlannedDepartTime'].dt.minute
df['PlannedArriveHour'] = df['PlannedArriveTime'].dt.hour
df['PlannedArriveMinute'] = df['PlannedArriveTime'].dt.minute

#calculate average delay by airline
average_delay_by_airline = df.groupby('Airline')['DepartDelayAmount'].mean().reset_index()
average_delay_by_airline.columns = ['Airline', 'AverageDepartDelay_Airline']

#merge with original df
df = df.merge(average_delay_by_airline, on = 'Airline', how = 'left')

#calculate average delay by DayOfYear
average_delay_by_DayOfYear = df.groupby('DayOfYear')['DepartDelayAmount'].mean().reset_index()
average_delay_by_DayOfYear.columns = ['DayOfYear', 'AverageDepartDelay_DayOfYear']

#merge with original df
df = df.merge(average_delay_by_DayOfYear, on = 'DayOfYear', how = 'left')

#calculate average delay by Origin
average_delay_by_Origin = df.groupby('Origin')['DepartDelayAmount'].mean().reset_index()
average_delay_by_Origin.columns = ['Origin', 'AverageDepartDelay_Origin']

#merge with original df
df = df.merge(average_delay_by_Origin, on = 'Origin', how = 'left')

#calculate average delay by DayOfWeek
average_delay_by_DayOfWeek = df.groupby('DayOfWeek')['DepartDelayAmount'].mean().reset_index()
average_delay_by_DayOfWeek.columns = ['DayOfWeek', 'AverageDepartDelay_DayOfWeek']

#merge with original df
df = df.merge(average_delay_by_DayOfWeek, on = 'DayOfWeek', how = 'left')

#calculate average delay by Destination
average_delay_by_Destination = df.groupby('Destination')['DepartDelayAmount'].mean().reset_index()
average_delay_by_Destination.columns = ['Destination', 'AverageDepartDelay_Destination']

#merge with original df
df = df.merge(average_delay_by_Destination, on = 'Destination', how = 'left')

# Create delay categories (binning delay into 5 categories)
# Categories: On-time (<= 0 min), Small (1-15 min), Moderate (16-30 min), Large (31-60 min), Severe (>60 min)

bins = [-float('inf'), 0, 15, 30, 60, float('inf')]
labels = ['On-time', 'Small', 'Moderate', 'Large', 'Severe']
df['DelayCategory'] = pd.cut(df['DepartDelayAmount'], bins=bins, labels=labels)

# Drop rows with missing values
df = df.dropna()





# 20% Sample for testing training, MUST BE REMOVED
df = df.sample(frac=0.2, random_state=42)  # 20% sample







# Define the features and target variable
X = df[['Airline', 'Origin', 'Destination', 'PlannedDepartHour', 'PlannedDepartMinute', 'DayOfYear', 'DayOfWeek','PlannedArriveMinute', 'PlannedArriveHour', 'AverageDepartDelay_Airline', 'AverageDepartDelay_DayOfYear', 'AverageDepartDelay_DayOfWeek', 'AverageDepartDelay_Origin']]
y = df['DelayCategory']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('onehot', OneHotEncoder(drop='first', handle_unknown='ignore'), ['Airline', 'Origin', 'Destination']),
        ('scaler', StandardScaler(), ['PlannedDepartHour', 'PlannedDepartMinute', 'DayOfYear', 'DayOfWeek', 'PlannedArriveMinute', 'PlannedArriveHour', 'AverageDepartDelay_Airline', 'AverageDepartDelay_DayOfYear', 'AverageDepartDelay_Origin', 'AverageDepartDelay_DayOfWeek'])
    ],
    remainder='passthrough'
)

# Create a Random Forest Classifier pipeline
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),  # Apply preprocessing first
    ('classifier', RandomForestClassifier(n_estimators=50, max_depth=10, n_jobs=-1, random_state=42, class_weight='balanced'))  # Then apply the Random Forest model
])

# Train the model on the training data
print("Training the Random Forest Classifier...")
pipeline.fit(X_train, y_train)

# Make predictions on the test data
print("Making predictions on the test data...")
y_pred = pipeline.predict(X_test)

# Evaluate the model's performance
print("\nModel Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

