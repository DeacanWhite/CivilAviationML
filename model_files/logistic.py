# Import necessary libraries
from matplotlib import pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split, learning_curve
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline

# Load your dataset
try:
    df = pd.read_csv('processed_data/combined_logistic_non_cancelled_flights.csv')
except FileNotFoundError as e:
    print("Error: File not found. Please check the file path.")
    raise e

# Define the target variable (Delayed or not)
df['Delayed'] = df['ArriveDelayAmount'].apply(lambda x: 1 if x > 0 else 0)

# Extract features from Date and PlannedDepartTime
df['FlightDate'] = pd.to_datetime(df['FlightDate'], errors='coerce')
df['DayOfWeek'] = df['FlightDate'].dt.dayofweek  # Monday=0, Sunday=6
df['Hour'] = pd.to_datetime(df['PlannedDepartTime'], format='%H%M', errors='coerce').dt.hour

# Drop rows with NaN values after transformations
df = df.dropna(subset=['DayOfWeek', 'Hour', 'FlightDate'])

# Define features and target
X = df[['Airline', 'Origin', 'Destination', 'DayOfWeek', 'Hour']]
y = df['Delayed']

# Split the data into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a pipeline with OneHotEncoder, StandardScaler, and Logistic Regression
preprocessor = ColumnTransformer(
    transformers=[
        ('onehot', OneHotEncoder(drop='first', handle_unknown='ignore'), ['Airline', 'Origin', 'Destination']),
        ('scaler', StandardScaler(), ['DayOfWeek', 'Hour'])  # Scale numeric features
    ],
    remainder='passthrough'  # Keep other features as they are
)

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(multi_class='multinomial', solver='lbfgs', C=0.000001))
])

# Train the model
model_pipeline.fit(X_train, y_train)

# Save the model to disk
joblib.dump(model_pipeline, 'logistic_regression_model.pkl')

# Make predictions on the test set
y_pred = model_pipeline.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.4f}')
print("Classification Report:")
print(classification_report(y_test, y_pred))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.title('Confusion Matrix')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.show()

# Learning Curve
train_sizes, train_scores, test_scores = learning_curve(model_pipeline, X_train, y_train, cv=5, scoring='accuracy', n_jobs=-1)
train_scores_mean = train_scores.mean(axis=1)
test_scores_mean = test_scores.mean(axis=1)

plt.plot(train_sizes, train_scores_mean, label='Training score', color='blue')
plt.plot(train_sizes, test_scores_mean, label='Cross-validation score', color='green')

plt.xlabel('Training Size')
plt.ylabel('Accuracy Score')
plt.title('Learning Curve')
plt.legend()
plt.show()

# Load the model from disk for separate testing
loaded_model = joblib.load('logistic_regression_model.pkl')

# Sample separate test case for user prediction
user_input = {
    'Airline': ['US'],
    'Origin': ['CLT'],
    'Destination': ['SAV'],
    'FlightDate': ['2023-11-02'],  # Example date
    'PlannedDepartTime': ['1230']  # Example time in HHMM format
}

# Convert to DataFrame
user_df = pd.DataFrame(user_input)

# Extract features from Date and PlannedDepartTime for user input
try:
    user_df['FlightDate'] = pd.to_datetime(user_df['FlightDate'], errors='coerce')
    user_df['DayOfWeek'] = user_df['FlightDate'].dt.dayofweek
    user_df['Hour'] = pd.to_datetime(user_df['PlannedDepartTime'], format='%H%M', errors='coerce').dt.hour
    user_df = user_df.dropna(subset=['DayOfWeek', 'Hour'])  # Drop rows if any date/time conversion fails
except Exception as e:
    print("Error processing user input:", e)
    raise e

# Select only the necessary columns for prediction
X_user = user_df[['Airline', 'Origin', 'Destination', 'DayOfWeek', 'Hour']]

# Make prediction using the model
try:
    y_user_pred = loaded_model.predict(X_user)
    print(f"Prediction for user input: {y_user_pred[0]} (1 = Delayed, 0 = Not Delayed)")
except Exception as e:
    print("Error during prediction:", e)
