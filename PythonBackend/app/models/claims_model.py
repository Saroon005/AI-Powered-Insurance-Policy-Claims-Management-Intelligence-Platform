from sqlalchemy import (
    Column,
    BigInteger,
    Double,
    String,
    Date,
    ForeignKey
)

from app.core.database import Base


class Claim(Base):

    __tablename__ = "claims"

    claim_id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True
    )

    policy_id = Column(
        BigInteger,
        ForeignKey("policies.policy_id")
    )

    customer_id = Column(
        BigInteger,
        ForeignKey("customers.customer_id")
    )

    claim_type = Column(String(100))

    incident_date = Column(Date)

    claim_amount = Column(Double)

    status = Column(String(50))

    fraud_score = Column(Double)

    surveyor_id = Column(BigInteger)