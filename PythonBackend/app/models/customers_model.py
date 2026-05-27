from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    Date,
    ForeignKey
)

from app.core.database import Base


class Customer(Base):

    __tablename__ = "customers"

    customer_id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True
    )

    full_name = Column(String(255), nullable=False)

    dob = Column(Date)

    address = Column(Text)

    kyc_status = Column(String(50))

    agent_id = Column(
        BigInteger,
        ForeignKey("agents.agent_id")
    )