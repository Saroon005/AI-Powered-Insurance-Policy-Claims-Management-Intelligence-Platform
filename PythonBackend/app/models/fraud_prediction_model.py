from sqlalchemy import (
    Column,
    BigInteger,
    Double,
    String,
    Text,
    TIMESTAMP,
    ForeignKey
)

from sqlalchemy.sql import func

from app.core.database import Base


class FraudPrediction(Base):

    __tablename__ = "fraud_predictions"

    prediction_id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True
    )

    claim_id = Column(
        BigInteger,
        ForeignKey("claims.claim_id")
    )

    fraud_probability = Column(Double)

    risk_status = Column(String(100))

    recommendation = Column(Text)

    generated_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )