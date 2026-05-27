from datetime import datetime

from sqlalchemy.orm import Session

from app.models.claims_model import Claim
from app.models.policies_model import Policy
from app.models.customers_model import Customer

from app.models.fraud_prediction_model import FraudPrediction

from app.ml.predictor import predict_fraud_probability


def calculate_rule_based_score(
    claim_amount,
    premium_amount,
    policy_age,
    kyc_status,
    repeat_claims
):

    score = 0

    claim_ratio = claim_amount / premium_amount

    # Rule 1
    if claim_ratio > 0.8:
        score += 30

    # Rule 2
    if repeat_claims > 2:
        score += 25

    # Rule 3
    if policy_age < 15:
        score += 20

    # Rule 4
    if kyc_status != "VERIFIED":
        score += 15

    return score


def classify_risk(score):

    if score >= 70:
        return "HIGH RISK"

    elif score >= 40:
        return "MEDIUM RISK"

    return "LOW RISK"


def recommendation_engine(risk_status):

    if risk_status == "HIGH RISK":
        return (
            "Request additional documents "
            "and manual investigation."
        )

    elif risk_status == "MEDIUM RISK":
        return (
            "Surveyor verification recommended."
        )

    return "Claim appears normal."


def run_fraud_detection(
    claim_id: int,
    db: Session
):

    # Fetch Claim
    claim = db.query(Claim).filter(
        Claim.claim_id == claim_id
    ).first()

    if not claim:
        return {
            "success": False,
            "message": "Claim not found"
        }

    # Fetch Policy
    policy = db.query(Policy).filter(
        Policy.policy_id == claim.policy_id
    ).first()

    # Fetch Customer
    customer = db.query(Customer).filter(
        Customer.customer_id == claim.customer_id
    ).first()

    # Calculate Policy Age
    today = datetime.today().date()

    policy_age = (
        today - policy.start_date
    ).days

    # Repeat Claims
    repeat_claims = db.query(Claim).filter(
        Claim.customer_id == claim.customer_id
    ).count()

    # Rule-Based Score
    rule_score = calculate_rule_based_score(
        claim.claim_amount,
        policy.premium_amount,
        policy_age,
        customer.kyc_status,
        repeat_claims
    )

    # ML Prediction
    prediction, ml_probability = (
        predict_fraud_probability(
            claim.claim_amount,
            policy.premium_amount,
            policy_age,
            repeat_claims
        )
    )

    # Final Score
    final_score = int(
        (rule_score + ml_probability) / 2
    )

    risk_status = classify_risk(final_score)

    recommendation = recommendation_engine(
        risk_status
    )

    # Save Prediction
    fraud_prediction = FraudPrediction(
        claim_id=claim.claim_id,
        fraud_probability=final_score,
        risk_status=risk_status,
        recommendation=recommendation
    )

    db.add(fraud_prediction)

    # Update Claim Fraud Score
    claim.fraud_score = final_score

    db.commit()

    return {
        "success": True,
        "claim_id": claim.claim_id,
        "fraud_probability": final_score,
        "risk_status": risk_status,
        "recommendation": recommendation,
        "ml_probability": ml_probability,
        "rule_score": rule_score
    }