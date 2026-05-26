from datetime import datetime


def calculate_policy_age(policy_start_date):

    today = datetime.today().date()

    age_days = (today - policy_start_date).days

    return age_days


def calculate_claim_ratio(claim_amount, premium_amount):

    if premium_amount == 0:
        return 0

    return round(claim_amount / premium_amount, 2)


def derive_risk_flag(claim_ratio):

    if claim_ratio > 1.5:
        return "HIGH"

    elif claim_ratio > 0.8:
        return "MEDIUM"

    return "LOW"