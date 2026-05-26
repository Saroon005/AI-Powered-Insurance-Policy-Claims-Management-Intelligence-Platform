import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

import joblib


print("Loading Dataset...")

df = pd.read_csv("datasets/fraud_training_data.csv")

# Features
X = df[
    [
        "claim_amount",
        "premium_amount",
        "policy_age",
        "repeat_claims"
    ]
]

# Target
y = df["fraud_flag"]

# Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Predictions
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Model Accuracy: {accuracy}")

# Save Model
joblib.dump(model, "app/ml/fraud_model.pkl")

print("Fraud Model Saved Successfully")