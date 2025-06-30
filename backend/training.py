import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import joblib

# 1. Load the dataset
df = pd.read_csv("Final_DataSet_Expanded.csv")

# 2. Separate features and target
X = df.drop("product", axis=1)  # Replace with your actual column name
y = df["product"]

# 3. Convert text features to numbers
X = pd.get_dummies(X)

# 4. Split into training and test data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Train the Decision Tree model
model = DecisionTreeClassifier(criterion="entropy")
model.fit(X_train, y_train)

# 6. Save the trained model
joblib.dump(model, "recommendation_model.pkl")
joblib.dump(X.columns.tolist(), "model_columns.pkl")

print("✅ Model training complete and saved!")

# Import metrics
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

# Print results
print("\nModel Evaluation Metrics:")
print(f"Accuracy: {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
print(f"F1-Score: {f1:.2f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

