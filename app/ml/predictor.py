import joblib

# Load trained model
model = joblib.load("app/ml/fraud_model.pkl")


def predict_fraud_probability(
    claim_amount,
    premium_amount,
    policy_age,
    repeat_claims
):

    features = [[
        claim_amount,
        premium_amount,
        policy_age,
        repeat_claims
    ]]

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features)[0][1]

    return prediction, round(probability * 100, 2)