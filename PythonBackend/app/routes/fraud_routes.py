from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.fraud_service import (
    run_fraud_detection
)

router = APIRouter(
    prefix="/fraud",
    tags=["Fraud Detection"]
)


@router.get("/")
def fraud_home():

    return {
        "message": "Fraud Detection Module Running"
    }


@router.post("/predict/{claim_id}")

def predict_fraud(
    claim_id: int,
    db: Session = Depends(get_db)
):

    result = run_fraud_detection(
        claim_id,
        db
    )

    return result