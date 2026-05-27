import pandas as pd

from sqlalchemy.orm import Session

from app.models.agents_model import Agent
from app.models.customers_model import Customer
from app.models.policies_model import Policy
from app.models.claims_model import Claim

from app.utils.logger import logger


# ==========================================
# BULK IMPORT AGENTS
# ==========================================

def import_agents(csv_path: str, db: Session):

    logger.info("Importing Agents CSV")

    df = pd.read_csv(csv_path)

    agents = []

    for _, row in df.iterrows():

        agent = Agent(
            agent_id=int(row["agent_id"]),
            agent_name=row["agent_name"],
            region=row["region"],
            commission_pct=float(
                row["commission_pct"]
            ),
            status=row["status"]
        )

        agents.append(agent)

    db.bulk_save_objects(agents)

    db.commit()

    return {
        "success": True,
        "records_imported": len(agents)
    }


# ==========================================
# BULK IMPORT CUSTOMERS
# ==========================================

def import_customers(csv_path: str, db: Session):

    logger.info("Importing Customers CSV")

    df = pd.read_csv(csv_path)

    customers = []

    for _, row in df.iterrows():

        customer = Customer(
            customer_id=int(row["customer_id"]),
            full_name=row["full_name"],
            dob=row["dob"],
            address=row["address"],
            kyc_status=row["kyc_status"],
            agent_id=int(row["agent_id"])
        )

        customers.append(customer)

    db.bulk_save_objects(customers)

    db.commit()

    return {
        "success": True,
        "records_imported": len(customers)
    }


# ==========================================
# BULK IMPORT POLICIES
# ==========================================

def import_policies(csv_path: str, db: Session):

    logger.info("Importing Policies CSV")

    df = pd.read_csv(csv_path)

    policies = []

    for _, row in df.iterrows():

        policy = Policy(
            policy_id=int(row["policy_id"]),
            customer_id=int(row["customer_id"]),
            agent_id=int(row["agent_id"]),
            product_id=int(row["product_id"]),
            start_date=row["start_date"],
            end_date=row["end_date"],
            premium_amount=float(
                row["premium_amount"]
            ),
            status=row["status"],
            fraud_risk_score=float(
                row["fraud_risk_score"]
            )
        )

        policies.append(policy)

    db.bulk_save_objects(policies)

    db.commit()

    return {
        "success": True,
        "records_imported": len(policies)
    }


# ==========================================
# BULK IMPORT CLAIMS
# ==========================================

def import_claims(csv_path: str, db: Session):

    logger.info("Importing Claims CSV")

    df = pd.read_csv(csv_path)

    claims = []

    for _, row in df.iterrows():

        claim = Claim(
            claim_id=int(row["claim_id"]),
            policy_id=int(row["policy_id"]),
            customer_id=int(row["customer_id"]),
            claim_type=row["claim_type"],
            incident_date=row["incident_date"],
            claim_amount=float(
                row["claim_amount"]
            ),
            status=row["status"],
            fraud_score=float(
                row["fraud_score"]
            ),
            surveyor_id=int(
                row["surveyor_id"]
            )
        )

        claims.append(claim)

    db.bulk_save_objects(claims)

    db.commit()

    return {
        "success": True,
        "records_imported": len(claims)
    }