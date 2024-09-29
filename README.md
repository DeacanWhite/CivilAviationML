## **Flight Delay Project Setup**

This guide explains how we configure the project environment, perform data processing, train the model, and use the model for prediction.

## **1. Environment Setup**

### **Using pip**

To set up the project environment using Conda, we follow these steps:

#### 1.1 **Install Conda**:
   - We first ensure that Conda is installed on our system. We can download it from [Anaconda](https://www.anaconda.com/products/individual) or use Miniconda.
   
#### 1.2 **Create a Conda environment**:
   We create a new Conda environment for the project using the following command:
   ```bash
   conda create --name crop_yield_prediction python=3.8
   ```

### 1.3. **Activate the environment**:
   We activate the newly created environment:
   ```bash
   conda activate crop_yield_prediction
   ```

### 1.4 **Install the prerequisites and dependencies**:

	Ensure you have the following Python libraries installed:
	- pandas
	- scikit-learn
	- matplotlib
	- seaborn
	- joblib

 We install the necessary Python libraries specified in the project using the following Conda or pip commands:
   ```bash
   pip install pandas scikit-learn matplotlib seaborn joblib
   ```

### **Clone the project repository**:
   If the project code is stored in a repository (e.g., GitHub), we can clone it using:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
---

## **2. Data Processing**

#### **Processing the Dataset**

Before processing the dataset, you need to determine which model you would like to use. If using the Logistic Regression model, use data_processing_logistic_model.py. If using any other model (Linear or RandomForest) then use data_processing_other_models.py. The key difference between these is how they format time values. For the sake of simplicity, all examples will be shown using **data_processing_logistic_model.py**:

#### 2.1 **Create Directories**:
   To begin, create two folders.
   - unprocessed_data
   - processed_data
  
#### ** Directory Structure**

	The script assumes the following directory structure:
	```
	/your_project_directory/
	│
	├── unprocessed_data/           # Input CSV files (raw flight data)
	│   └── year_data_file.csv
	│
	├── processed_data/             # Output folder for processed files
	│   ├── year_logistic_non_cancelled_flights.csv
	│   └── year_logistic_cancelled_flights.csv
	│
	└── data_processing_logistic_model.py  # This script
	
	# Other model and processing files. 
	```
Make sure both `unprocessed_data/` and `processed_data/` directories exist 			before running the script.

#### 2.2  **Parameters That Can Be Changed**

- **Input File Path**: 
  The script reads CSV files from the `unprocessed_data/` folder:
  ```python
  path = 'unprocessed_data/*.csv'
  ```

- **Output Directory**: 
  Processed files are saved in the `processed_data/` folder. You can change this by modifying:
  ```python
  export_directory = 'processed_data/'
  ```

- **Sample Size**: 
  The number of rows sampled from non-cancelled flights can be adjusted using:
  ```python
  sampled_flights = non_cancelled_flights.sample(n=120000, random_state=42)
  ```
  Modify the `n` value to increase or decrease the number of sampled rows.

#### 2.3 How to Run

1. Place your raw CSV files in the `unprocessed_data/` folder.
2. Run the script:
   ```bash
   python data_processing_logistic_model.py
   ```
3. The processed data will be available in the `processed_data/` directory.

**NOTE:** If files are already processed, then place them `processed_data/`

#### Example Output

For each input file, you will get:
- **Processed Non-Cancelled Flights**: 
  - e.g., `2013_logistic_non_cancelled_flights.csv`
- **Processed Cancelled Flights**: 
  - e.g., `2013_logistic_cancelled_flights.csv`

#### 2.4 Combining Data
Once all files are processed, the `combine_data.py` script is used to combine the processed datasets into single files.

**After Running the script the combined datasets are saved as:**
- combined_logistic_non_cancelled_flights.csv
- combined_logistic_cancelled_flights.csv
- combined_non_cancelled_flights.csv
- combined_cancelled_flights.csv

**Logistic Regression model will use:**`_logistic_non_cancelled_flights.csv`

**Other models will use:**`_non_cancelled_flights.csv`

#### Notes

- The script measures and prints the time taken for both data loading and processing.
- NaN values and data previews are printed for debugging purposes.
- In order to get data for other models, users will need to run the `data_processing_other_models.py` file before combining.


## **3. Model Training**

We now train our machine learning model using the processed dataset.

### **Logistic Regression Example**:

#### 3.1 **Import the Processed Dataset**:
   ```python
# Load your dataset (adjust the path as needed)
df = pd.read_csv('processed_data/combined_logistic_non_cancelled_flights.csv')
   ```

#### 3.2 **Train and Save the Model**:

The model is trained using the following steps:
- **Preprocessing:** Categorical columns (Airline, Origin, Destination) are encoded using one-hot encoding. These encoded features are combined with numerical features, forming a pipeline for streamlined preprocessing and model training.

- **Training:** The dataset is split into training and testing sets. The model is then trained on 80% of the data (training set). The split can be adjusted as needed:
	```python
	# Define features and target
	X = df[['Airline', 'Origin', 'Destination', 'DepartDelayAmount', 'ArriveDelayAmount']]
	y = df['Delayed']
	
	# Split the data into training and testing sets (80% training, 20% testing)
	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
	```
- **Saving the Model:** The trained model is saved as `logistic_regression_model.pkl`.
   ```python
	# Train the model
	model_pipeline.fit(X_train, y_train)

	# Save the model to disk
	joblib.dump(model_pipeline, 'logistic_regression_model.pkl')
   ```

#### 3.3 **Evaluating the Model**:
Once training is complete, the model is evaluated using the test set (20% of the data). The following metrics are then outputted to console:

- **Accuracy:** Measures the percentage of correct predictions.
- **Classification Report:** Provides precision, recall, F1-score, and support for each class.
- **Confusion Matrix:** Visualizes the performance of the classification model.

The model also includes several visualisations to help identify various factors. These visualisations include:
- **Learning Curve:** Plots training and cross-validation accuracy over different training set sizes.
- **Confusion Matrix:** Displays a heatmap of the confusion matrix for the test set.
- **Logistic Regression Line:** Shows the logistic regression decision boundary for DepartDelayAmount vs Delayed with and without Airline as the hue.

#### 3.4 **Alternative Models**:
We also experimented with more advanced models such as **Random Forest Classification** and  **Linear Regression**, hoping for better results. However, these did not produce the desired results and we instead stuck with **Logistic Regression** as our main model. These models are still included.

---

## **4. Using the Model for Prediction**

Finally, now that the model has been trained and evaluated, we can use it for predictions on new or unseen data. For example, this model was trained on data from 2009-2017. We could use 2018 data to test the model and see how it performs.

### **Steps for Prediction**:

#### 4.2 **Load the Trained Model**:
   Firstly we load the model that we trained earlier:
   ```python
    # Load the model from disk
    loaded_model = joblib.load('logistic_regression_model.pkl')
   ```
#### 4.2 **Load the New Data**:
   then load the new dataset. **NOTE**: This data must be in the same format as the model (data used to train the model):
   ```python
    # Load the separate test dataset
    df_test = pd.read_csv('processed_data/2018_logistic_non_cancelled_flights.csv')
   ```

#### 4.3 **Preprocess the New Data**:
   To ensure the data is formatted correctly, we preprocess it similarly to how we processed the training data:
   ```python
    # Preprocess the test dataset
    df_test['Delayed'] = df_test['ArriveDelayAmount'].apply(lambda x: 1 if x > 0 else 0)
    X_test_separate = df_test[['Airline', 'Origin', 'Destination', 'DepartDelayAmount', 'ArriveDelayAmount']]
   ```

#### 4.4 **Make Predictions**:
   Finally, once all that is complete we can use the trained model to make predictions:
   ```python
    # Make predictions on the separate test set using the loaded model
    y_pred_separate = loaded_model.predict(X_test_separate)
   ```

## 5. **Other Models**
### **Data Processing**
**Place Raw CSV Files:** Add your raw flight data files into the unprocessed_data/ folder.
**Run Processing Script:** Run the data_processing_other_models.py script for pre-processing:
```bash
python data_processing_other_models.py
```
**Import the Processed Dataset:**
```python
# Load your dataset (adjust the path as needed)
df = pd.read_csv('processed_data/_non_cancelled_flights.csv')
```
#### 5.1 **Linear Regression Model**

**Train and Save the Model**
**Training:**
```python
X = df[['Airline', 'Origin', 'Destination', 'PlannedDepartHour', 'PlannedDepartMinute', 'DayOfYear', 'DayOfWeek','PlannedArriveMinute', 'PlannedArriveHour', 'AverageDepartDelay_Airline', 'AverageDepartDelay_DayOfYear', 'AverageDepartDelay_DayOfWeek', 'AverageDepartDelay_Origin']]
y = df['ArriveDelayAmount']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Linear Regression model
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', LinearRegression())
])
pipeline.fit(X_train, y_train)
```
**Saving the Model:**
```python
joblib.dump(pipeline, 'linear_regression_model.pkl')
```
#### 5.2 **Random Forest Classifier**
**Train and Save the Model**
**Define Categories**
```python
bins = [-float('inf'), 0, 15, 30, 60, float('inf')]
labels = ['On-time', 'Small', 'Moderate', 'Large', 'Severe']
df['DelayCategory'] = pd.cut(df['DepartDelayAmount'], bins=bins, labels=labels)
```
**Training:**
```python
X = df[['Airline', 'Origin', 'Destination', 'PlannedDepartHour', 'PlannedDepartMinute', 'DayOfYear', 'DayOfWeek','PlannedArriveMinute', 'PlannedArriveHour', 'AverageDepartDelay_Airline', 'AverageDepartDelay_DayOfYear', 'AverageDepartDelay_DayOfWeek', 'AverageDepartDelay_Origin']]
y = df['DelayCategory']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),  # Apply preprocessing first
    ('classifier', RandomForestClassifier(n_estimators=50, max_depth=10, n_jobs=-1, random_state=42, class_weight='balanced'))  # Then apply the Random Forest model
])
pipeline.fit(X_train, y_train)
```
**Saving the Model:**
```python
joblib.dump(pipeline, 'randomForest_classifier_model.pkl')
```
#### 5.3 **Parameters that Can Be Changed**
**Save and Load Directory for Models:**

**Save Directory:** You can specify where the trained models are saved by adjusting the file paths in the joblib.dump() functions. For example:
```python
joblib.dump(pipeline, 'models/linear_regression_model.pkl')  # Save Linear Regression model
joblib.dump(pipeline, 'models/randomForest_classifier_model.pkl')  # Save Random Forest Classifier model
```
**Load Directory:** Similarly, to load models for predictions, update the path:
```python
loaded_model = joblib.load('models/linear_regression_model.pkl')
```
**Random Forest Model Depth:**

To change the depth of the Random Forest Classifier:
```python
RandomForestClassifier(n_estimators=50, max_depth=10, n_jobs=-1, random_state=42, class_weight='balanced')
```
Modify max_depth to set the desired depth of the model (e.g., max_depth=15).

**Number of Estimators (Random Forest):**

To change the number of decision trees used by the Random Forest model:
```python
RandomForestClassifier(n_estimators=50, max_depth=10, n_jobs=-1, random_state=42, class_weight='balanced')
```
Adjust the n_estimators parameter (e.g., n_estimators=100) to control the number of trees in the forest.

**Test Size:**

Change the proportion of the dataset allocated for testing versus training:
```python
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```
Adjust test_size (e.g., test_size=0.3) to use 30% of the data for testing.

## 6. **Model Evaluation Summary**
#### Evaluation Metrics:
**Accuracy:** Used for classification.
**Mean Squared Error (MSE):** Evaluated the linear regression model.
**R² Score:** Measured the proportion of variance explained by the regression model.
---

