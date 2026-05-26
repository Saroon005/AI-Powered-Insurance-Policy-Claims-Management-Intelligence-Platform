from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.analytics_service import (
    get_claims_trend,
    get_top_agents,
    get_fraud_claims,
    get_loss_ratio,
    get_renewal_rate,
    get_dashboard_summary
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def analytics_home():

    return {
        "message": "Analytics Module Running"
    }


# ==========================================
# CLAIMS TREND API
# ==========================================

@router.get("/claims-trend")

def claims_trend(
    db: Session = Depends(get_db)
):

    return get_claims_trend(db)


# ==========================================
# TOP AGENTS API
# ==========================================

@router.get("/top-agents")

def top_agents(
    db: Session = Depends(get_db)
):

    return get_top_agents(db)


# ==========================================
# FRAUD CLAIMS API
# ==========================================

@router.get("/fraud-claims")

def fraud_claims(
    db: Session = Depends(get_db)
):

    return get_fraud_claims(db)


# ==========================================
# LOSS RATIO API
# ==========================================

@router.get("/loss-ratio")

def loss_ratio(
    db: Session = Depends(get_db)
):

    return get_loss_ratio(db)


# ==========================================
# RENEWAL RATE API
# ==========================================

@router.get("/renewal-rate")

def renewal_rate(
    db: Session = Depends(get_db)
):

    return get_renewal_rate(db)


# ==========================================
# DASHBOARD SUMMARY API
# ==========================================

@router.get("/dashboard-summary")

def dashboard_summary(
    db: Session = Depends(get_db)
):

    return get_dashboard_summary(db)