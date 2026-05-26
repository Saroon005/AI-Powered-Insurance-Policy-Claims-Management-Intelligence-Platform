from fastapi import APIRouter

router = APIRouter(
    prefix="/fraud",
    tags=["Fraud Detection"]
)


@router.get("/")
def fraud_home():
    return {
        "message": "Fraud Detection Module"
    }