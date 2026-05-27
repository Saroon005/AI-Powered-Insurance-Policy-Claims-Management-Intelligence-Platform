from sqlalchemy import func

from app.models.claims_model import Claim
from app.models.policies_model import Policy
from app.models.agents_model import Agent
from app.models.customers_model import Customer
from app.models.fraud_prediction_model import (
    FraudPrediction
)


# ==========================================
# CLAIMS TREND ANALYTICS
# ==========================================

def get_claims_trend(db):

    results = (
        db.query(
            func.month(Claim.incident_date).label("month"),
            func.count(Claim.claim_id).label("total_claims")
        )
        .group_by(
            func.month(Claim.incident_date)
        )
        .all()
    )

    data = []

    for row in results:

        data.append({
            "month": row.month,
            "total_claims": row.total_claims
        })

    return data


# ==========================================
# TOP AGENTS ANALYTICS
# ==========================================

def get_top_agents(db):

    results = (
        db.query(
            Agent.agent_name,
            func.count(
                Policy.policy_id
            ).label("total_policies"),
            func.sum(
                Policy.premium_amount
            ).label("premium_collected")
        )
        .join(
            Policy,
            Agent.agent_id == Policy.agent_id
        )
        .group_by(Agent.agent_name)
        .order_by(
            func.sum(
                Policy.premium_amount
            ).desc()
        )
        .limit(5)
        .all()
    )

    data = []

    for row in results:

        data.append({
            "agent_name": row.agent_name,
            "total_policies": row.total_policies,
            "premium_collected": float(
                row.premium_collected or 0
            )
        })

    return data


# ==========================================
# FRAUD CLAIMS ANALYTICS
# ==========================================

def get_fraud_claims(db):

    results = (
        db.query(
            FraudPrediction.claim_id,
            FraudPrediction.fraud_probability,
            FraudPrediction.risk_status
        )
        .filter(
            FraudPrediction.fraud_probability >= 40
        )
        .all()
    )

    data = []

    for row in results:

        data.append({
            "claim_id": row.claim_id,
            "fraud_probability": row.fraud_probability,
            "risk_status": row.risk_status
        })

    return data


# ==========================================
# LOSS RATIO ANALYTICS
# ==========================================

def get_loss_ratio(db):

    total_claims = (
        db.query(
            func.sum(Claim.claim_amount)
        ).scalar()
    )

    total_premium = (
        db.query(
            func.sum(Policy.premium_amount)
        ).scalar()
    )

    total_claims = total_claims or 0
    total_premium = total_premium or 1

    loss_ratio = (
        total_claims / total_premium
    ) * 100

    return {
        "total_claims_paid": total_claims,
        "total_premium_collected": total_premium,
        "loss_ratio": round(loss_ratio, 2)
    }


# ==========================================
# RENEWAL RATE ANALYTICS
# ==========================================

def get_renewal_rate(db):

    total_policies = (
        db.query(
            func.count(Policy.policy_id)
        ).scalar()
    )

    renewed_policies = (
        db.query(
            func.count(Policy.policy_id)
        )
        .filter(
            Policy.status == "RENEWED"
        )
        .scalar()
    )

    total_policies = total_policies or 1
    renewed_policies = renewed_policies or 0

    renewal_rate = (
        renewed_policies / total_policies
    ) * 100

    return {
        "total_policies": total_policies,
        "renewed_policies": renewed_policies,
        "renewal_rate": round(renewal_rate, 2)
    }


# ==========================================
# DASHBOARD SUMMARY
# ==========================================

def get_dashboard_summary(db):

    total_customers = (
        db.query(
            func.count(Customer.customer_id)
        ).scalar()
    )

    total_policies = (
        db.query(
            func.count(Policy.policy_id)
        ).scalar()
    )

    total_claims = (
        db.query(
            func.count(Claim.claim_id)
        ).scalar()
    )

    fraud_cases = (
        db.query(
            func.count(
                FraudPrediction.prediction_id
            )
        )
        .filter(
            FraudPrediction.fraud_probability >= 70
        )
        .scalar()
    )

    return {
        "total_customers": total_customers,
        "total_policies": total_policies,
        "total_claims": total_claims,
        "high_risk_fraud_cases": fraud_cases
    }