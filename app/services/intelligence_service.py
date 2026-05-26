from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.claims_model import Claim
from app.models.policies_model import Policy
from app.models.agents_model import Agent
from app.models.customers_model import Customer


# ==========================================
# FRAUD ANALYTICS
# ==========================================

def fraud_summary(db: Session):

    total_claims = db.query(Claim).count()

    high_risk = db.query(Claim).filter(
        Claim.fraud_score >= 70
    ).count()

    medium_risk = db.query(Claim).filter(
        Claim.fraud_score.between(40, 69)
    ).count()

    low_risk = db.query(Claim).filter(
        Claim.fraud_score < 40
    ).count()

    return {
        "total_claims": total_claims,
        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk
    }


# ==========================================
# LOSS RATIO (IMPORTANT INSURANCE KPI)
# ==========================================

def loss_ratio(db: Session):

    total_premium = db.query(
        func.sum(Policy.premium_amount)
    ).scalar() or 0

    total_claims = db.query(
        func.sum(Claim.claim_amount)
    ).scalar() or 0

    ratio = (
        total_claims / total_premium * 100
        if total_premium > 0 else 0
    )

    return {
        "total_premium": round(total_premium, 2),
        "total_claims": round(total_claims, 2),
        "loss_ratio_percent": round(ratio, 2)
    }


# ==========================================
# AGENT PERFORMANCE SCORE
# ==========================================

def agent_performance(db: Session):

    agents = db.query(Agent).all()

    results = []

    for agent in agents:

        policies = db.query(Policy).filter(
            Policy.agent_id == agent.agent_id
        ).count()

        claims = db.query(Claim).join(Policy).filter(
            Policy.agent_id == agent.agent_id
        ).count()

        score = (policies * 10) - (claims * 5)

        results.append({
            "agent_id": agent.agent_id,
            "agent_name": agent.agent_name,
            "policies_sold": policies,
            "claims_generated": claims,
            "performance_score": score
        })

    return sorted(
        results,
        key=lambda x: x["performance_score"],
        reverse=True
    )


# ==========================================
# CLAIM SEVERITY ANALYSIS
# ==========================================

def claim_severity_distribution(db: Session):

    low = db.query(Claim).filter(
        Claim.claim_amount < 50000
    ).count()

    medium = db.query(Claim).filter(
        Claim.claim_amount.between(50000, 200000)
    ).count()

    high = db.query(Claim).filter(
        Claim.claim_amount > 200000
    ).count()

    return {
        "low_severity": low,
        "medium_severity": medium,
        "high_severity": high
    }


# ==========================================
# CLAIM TYPE ANALYTICS
# ==========================================

def claim_type_analysis(db: Session):

    results = db.query(
        Claim.claim_type,
        func.count(Claim.claim_id)
    ).group_by(Claim.claim_type).all()

    return [
        {
            "claim_type": r[0],
            "count": r[1]
        }
        for r in results
    ]


# ==========================================
# REGION-LEVEL RISK (via Agent region)
# ==========================================

def region_risk_analysis(db: Session):

    results = db.query(
        Agent.region,
        func.avg(Claim.fraud_score)
    ).join(Policy, Policy.agent_id == Agent.agent_id
    ).join(Claim, Claim.policy_id == Policy.policy_id
    ).group_by(Agent.region).all()

    return [
        {
            "region": r[0],
            "avg_fraud_score": round(r[1] or 0, 2)
        }
        for r in results
    ]


# ==========================================
# EXECUTIVE KPI DASHBOARD
# ==========================================

def executive_kpis(db: Session):

    total_customers = db.query(Customer).count()
    total_agents = db.query(Agent).count()
    total_policies = db.query(Policy).count()
    total_claims = db.query(Claim).count()

    approved_claims = db.query(Claim).filter(
        Claim.status == "Approved"
    ).count()

    rejected_claims = db.query(Claim).filter(
        Claim.status == "Rejected"
    ).count()

    return {
        "total_customers": total_customers,
        "total_agents": total_agents,
        "total_policies": total_policies,
        "total_claims": total_claims,
        "approved_claims": approved_claims,
        "rejected_claims": rejected_claims
    }