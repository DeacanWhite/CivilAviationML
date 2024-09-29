import pandas as pd
from pandas.core.common import random_state
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import datetime
import joblib
#importing the dataframe from parameters script
from parameters import non_cancelled_flights_df as df

#dropping NaNs
df = df.dropna()
print("loading data...\n")

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







# Drop the original columns
df = df.drop(columns=['PlannedDepartTime','FlightDate', 'ActualDepartTime', 'PlannedArriveTime', 'ActualArriveTime'])

df = df.dropna()
#define features and targets
X = df[['Airline', 'Origin', 'Destination', 'PlannedDepartHour', 'PlannedDepartMinute', 'DayOfYear', 'DayOfWeek','PlannedArriveMinute', 'PlannedArriveHour', 'AverageDepartDelay_Airline', 'AverageDepartDelay_DayOfYear', 'AverageDepartDelay_DayOfWeek', 'AverageDepartDelay_Origin']]
y = df['DepartDelayAmount']

#splitting data into test and train sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state = 42)

#define data preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('onehot', OneHotEncoder(drop='first', handle_unknown='ignore'), ['Airline', 'Origin', 'Destination']),
        ('scaler', StandardScaler(), ['PlannedDepartHour', 'PlannedDepartMinute', 'DayOfYear', 'DayOfWeek', 'PlannedArriveMinute', 'PlannedArriveHour', 'AverageDepartDelay_Airline', 'AverageDepartDelay_DayOfYear', 'AverageDepartDelay_Origin', 'AverageDepartDelay_DayOfWeek'])
    ],
    remainder='passthrough'
)
print("data loaded")
print("data types: \n ", df.dtypes)
#Create the pipeline with data processor and linear regression model
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', LinearRegression())
])

print("Beginning model training")
#train the model
pipeline.fit(X_train, y_train)
print("Finished training\n\n")

# Save the model to disk
joblib.dump(pipeline, 'linear_regression_model.pkl')

#make predictions on the test set
y_pred = pipeline.predict(X_test)

#model evaluation
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Mean Squared Error: {mse:.4f}')
print(f'R2 Score: {r2:.4f}')