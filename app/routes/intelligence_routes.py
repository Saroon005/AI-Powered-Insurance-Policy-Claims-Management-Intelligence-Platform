from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.intelligence_service import (
    fraud_summary,
    loss_ratio,
    agent_performance,
    claim_severity_distribution,
    claim_type_analysis,
    region_risk_analysis,
    executive_kpis
)

router = APIRouter(
    prefix="/intelligence",
    tags=["Insurance Intelligence"]
)


# ==========================================
# FRAUD DASHBOARD
# ==========================================

@router.get("/fraud-summary")
def fraud(db: Session = Depends(get_db)):
    return fraud_summary(db)


# ==========================================
# LOSS RATIO
# ==========================================

@router.get("/loss-ratio")
def loss(db: Session = Depends(get_db)):
    return loss_ratio(db)


# ==========================================
# AGENT PERFORMANCE
# ==========================================

@router.get("/agent-performance")
def agents(db: Session = Depends(get_db)):
    return agent_performance(db)


# ==========================================
# CLAIM SEVERITY
# ==========================================

@router.get("/claim-severity")
def severity(db: Session = Depends(get_db)):
    return claim_severity_distribution(db)


# ==========================================
# CLAIM TYPE ANALYTICS
# ==========================================

@router.get("/claim-types")
def types(db: Session = Depends(get_db)):
    return claim_type_analysis(db)


# ==========================================
# REGION RISK
# ==========================================

@router.get("/region-risk")
def region(db: Session = Depends(get_db)):
    return region_risk_analysis(db)


# ==========================================
# EXECUTIVE DASHBOARD
# ==========================================

@router.get("/kpis")
def kpis(db: Session = Depends(get_db)):
    return executive_kpis(db)