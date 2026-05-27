from sqlalchemy import Column, BigInteger, String, Double

from app.core.database import Base


class Agent(Base):

    __tablename__ = "agents"

    agent_id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True
    )

    agent_name = Column(String(255), nullable=False)

    region = Column(String(100))

    commission_pct = Column(Double)

    status = Column(String(50))