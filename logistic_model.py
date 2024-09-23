# Importing necessary libraries
from matplotlib import pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split, learning_curve
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline

# Load your dataset (adjust the path as needed)
df = pd.read_csv('processed_data/2012_sampled_non_cancelled_flights.csv')

# Define the target variable (Delayed or not)
df['Delayed'] = df['ArriveDelayAmount'].apply(lambda x: 1 if x > 0 else 0)

# Define features and target
X = df[['Airline', 'Origin', 'Destination', 'DepartDelayAmount', 'ArriveDelayAmount']]
y = df['Delayed']

# Split the data into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a pipeline with OneHotEncoder and Logistic Regression
preprocessor = ColumnTransformer(
    transformers=[
        ('onehot', OneHotEncoder(drop='first', handle_unknown='ignore'), ['Airline', 'Origin', 'Destination'])
    ],
    remainder='passthrough'  # Keep the numerical features as they are
)

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(multi_class='multinomial', solver='lbfgs', C=0.0001))
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

# Load the model from disk
loaded_model = joblib.load('logistic_regression_model.pkl')

# Load the separate test dataset
df_test = pd.read_csv('processed_data/2017_sampled_non_cancelled_flights.csv')

# Preprocess the test dataset
df_test['Delayed'] = df_test['ArriveDelayAmount'].apply(lambda x: 1 if x > 0 else 0)
X_test_separate = df_test[['Airline', 'Origin', 'Destination', 'DepartDelayAmount', 'ArriveDelayAmount']]

# Make predictions on the separate test set using the loaded model
y_pred_separate = loaded_model.predict(X_test_separate)

# Evaluate the model on the separate test set
accuracy_separate = accuracy_score(df_test['Delayed'], y_pred_separate)
print(f'Separate Test Accuracy: {accuracy_separate:.4f}')
print("Classification Report for Separate Test Set:")
print(classification_report(df_test['Delayed'], y_pred_separate))

# Confusion matrix for the separate test set
cm_separate = confusion_matrix(df_test['Delayed'], y_pred_separate)
sns.heatmap(cm_separate, annot=True, fmt="d", cmap="Blues")
plt.title('Confusion Matrix for Separate Test Set')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.show()

# Scatter plot with regression line for DepartDelayAmount vs Delayed
plt.figure(figsize=(10, 6))
sns.regplot(x='DepartDelayAmount', y='Delayed', data=df, logistic=True, ci=None)
plt.xlabel('Departure Delay Amount')
plt.ylabel('Probability of Delay')
plt.title('Logistic Regression Line for Departure Delay Amount vs Delayed')
plt.show()

# Plotting logistic regression decision boundary with Airline as hue
plt.figure(figsize=(10, 6))
sns.lmplot(x='DepartDelayAmount', y='Delayed', hue='Airline', data=df, logistic=True, ci=None)
plt.xlabel('Departure Delay Amount')
plt.ylabel('Probability of Delay')
plt.title('Logistic Regression Line with Airline Hue')
plt.show()
