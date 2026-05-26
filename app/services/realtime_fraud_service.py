import random

from app.core.event_bus import publish_event


# ==========================================
# RULE BASED FRAUD SCORING
# ==========================================

def calculate_fraud_score(claim):

    score = 0

    # High claim amount risk
    if claim["claim_amount"] > 200000:
        score += 40

    # Suspicious claim types
    if claim["claim_type"] in ["Theft", "Accident"]:
        score += 20

    # Rapid claim after policy start
    if claim["days_since_policy_start"] < 30:
        score += 25

    # Random noise (simulates real-world uncertainty)
    score += random.randint(0, 10)

    return min(score, 100)


# ==========================================
# RISK CLASSIFICATION ENGINE
# ==========================================

def classify_risk(score):

    if score >= 75:
        return "HIGH_RISK"
    elif score >= 40:
        return "MEDIUM_RISK"
    else:
        return "LOW_RISK"


# ==========================================
# REAL-TIME CLAIM PROCESSOR
# ==========================================

def process_claim_realtime(claim):

    score = calculate_fraud_score(claim)
    risk = classify_risk(score)

    result = {
        "claim_id": claim["claim_id"],
        "fraud_score": score,
        "risk_level": risk,
        "action": (
            "FLAG_FOR_INVESTIGATION"
            if risk == "HIGH_RISK"
            else "APPROVE"
        )
    }

    # Publish event to stream
    publish_event("FRAUD_ANALYZED", result)

    # If high risk → send alert event
    if risk == "HIGH_RISK":

        publish_event(
            "FRAUD_ALERT",
            {
                "claim_id": claim["claim_id"],
                "message": "High fraud risk detected",
                "score": score
            }
        )

    return result


# ==========================================
# SIMULATED LIVE CLAIM STREAM
# ==========================================

def simulate_live_claims():

    sample_claims = [
        {
            "claim_id": 101,
            "claim_amount": 500000,
            "claim_type": "Theft",
            "days_since_policy_start": 10
        },
        {
            "claim_id": 102,
            "claim_amount": 20000,
            "claim_type": "Health",
            "days_since_policy_start": 200
        },
        {
            "claim_id": 103,
            "claim_amount": 150000,
            "claim_type": "Accident",
            "days_since_policy_start": 5
        }
    ]

    results = []

    for claim in sample_claims:

        result = process_claim_realtime(claim)
        results.append(result)

    return results