from sqlalchemy import (
    Column,
    BigInteger,
    Double,
    String,
    Date,
    ForeignKey
)

from app.core.database import Base


class Policy(Base):

    __tablename__ = "policies"

    policy_id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True
    )

    customer_id = Column(
        BigInteger,
        ForeignKey("customers.customer_id")
    )

    agent_id = Column(
        BigInteger,
        ForeignKey("agents.agent_id")
    )

    product_id = Column(BigInteger)

    start_date = Column(Date)

    end_date = Column(Date)

    premium_amount = Column(Double)

    status = Column(String(50))

    fraud_risk_score = Column(Double)