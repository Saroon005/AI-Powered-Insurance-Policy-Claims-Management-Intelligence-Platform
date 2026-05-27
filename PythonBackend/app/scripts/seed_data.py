from datetime import date

from app.core.database import SessionLocal

from app.models.agents_model import Agent
from app.models.customers_model import Customer
from app.models.policies_model import Policy
from app.models.claims_model import Claim

db = SessionLocal()

print("Seeding database...")

# Create Agent
agent = Agent(
    agent_name="Rahul Sharma",
    region="Bangalore",
    commission_pct=12.5,
    status="ACTIVE"
)

db.add(agent)
db.commit()
db.refresh(agent)

# Create Customer
customer = Customer(
    full_name="Karan Verma",
    dob=date(1995, 5, 10),
    address="Whitefield Bangalore",
    kyc_status="VERIFIED",
    agent_id=agent.agent_id
)

db.add(customer)
db.commit()
db.refresh(customer)

# Create Policy
policy = Policy(
    customer_id=customer.customer_id,
    agent_id=agent.agent_id,
    product_id=101,
    start_date=date(2025, 1, 1),
    end_date=date(2026, 1, 1),
    premium_amount=25000,
    status="ACTIVE",
    fraud_risk_score=12
)

db.add(policy)
db.commit()
db.refresh(policy)

# Create Claim
claim = Claim(
    policy_id=policy.policy_id,
    customer_id=customer.customer_id,
    claim_type="Motor Accident",
    incident_date=date(2025, 5, 1),
    claim_amount=18000,
    status="PENDING",
    fraud_score=35,
    surveyor_id=1
)

db.add(claim)
db.commit()

print("Database seeded successfully.")

db.close()