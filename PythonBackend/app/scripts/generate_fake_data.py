from faker import Faker
import pandas as pd
import random
from datetime import timedelta

fake = Faker()

# ==========================================
# CONFIGURATION
# ==========================================

TOTAL_AGENTS = 100
TOTAL_CUSTOMERS = 10000
TOTAL_POLICIES = 25000
TOTAL_CLAIMS = 8000

# ==========================================
# GENERATE AGENTS
# ==========================================

agents = []

regions = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Hyderabad"
]

for agent_id in range(1, TOTAL_AGENTS + 1):

    agents.append({
        "agent_id": agent_id,
        "agent_name": fake.name(),
        "region": random.choice(regions),
        "commission_pct": round(
            random.uniform(5, 15), 2
        ),
        "status": "ACTIVE"
    })

agents_df = pd.DataFrame(agents)

# ==========================================
# GENERATE CUSTOMERS
# ==========================================

customers = []

kyc_statuses = [
    "VERIFIED",
    "PENDING"
]

for customer_id in range(
    1,
    TOTAL_CUSTOMERS + 1
):

    customers.append({
        "customer_id": customer_id,
        "full_name": fake.name(),
        "dob": fake.date_of_birth(
            minimum_age=18,
            maximum_age=75
        ),
        "address": fake.address(),
        "kyc_status": random.choice(
            kyc_statuses
        ),
        "agent_id": random.randint(
            1,
            TOTAL_AGENTS
        )
    })

customers_df = pd.DataFrame(customers)

# ==========================================
# GENERATE POLICIES
# ==========================================

policies = []

policy_statuses = [
    "ACTIVE",
    "LAPSED",
    "RENEWED"
]

for policy_id in range(
    1,
    TOTAL_POLICIES + 1
):

    start_date = fake.date_between(
        start_date="-3y",
        end_date="today"
    )

    end_date = start_date + timedelta(
        days=365
    )

    policies.append({
        "policy_id": policy_id,
        "customer_id": random.randint(
            1,
            TOTAL_CUSTOMERS
        ),
        "agent_id": random.randint(
            1,
            TOTAL_AGENTS
        ),
        "product_id": random.randint(
            100,
            500
        ),
        "start_date": start_date,
        "end_date": end_date,
        "premium_amount": round(
            random.uniform(5000, 100000),
            2
        ),
        "status": random.choice(
            policy_statuses
        ),
        "fraud_risk_score": 0
    })

policies_df = pd.DataFrame(policies)

# ==========================================
# GENERATE CLAIMS
# ==========================================

claims = []

claim_types = [
    "Motor Accident",
    "Health Claim",
    "Property Damage",
    "Life Claim"
]

claim_statuses = [
    "PENDING",
    "APPROVED",
    "REJECTED"
]

fraud_training = []

for claim_id in range(
    1,
    TOTAL_CLAIMS + 1
):

    policy_id = random.randint(
        1,
        TOTAL_POLICIES
    )

    customer_id = random.randint(
        1,
        TOTAL_CUSTOMERS
    )

    premium_amount = round(
        random.uniform(5000, 100000),
        2
    )

    # FRAUD SIMULATION
    fraud_flag = random.choice(
        [0, 0, 0, 1]
    )

    if fraud_flag == 1:

        claim_amount = round(
            premium_amount *
            random.uniform(1.0, 2.0),
            2
        )

        policy_age = random.randint(
            1,
            10
        )

        repeat_claims = random.randint(
            3,
            6
        )

    else:

        claim_amount = round(
            premium_amount *
            random.uniform(0.1, 0.7),
            2
        )

        policy_age = random.randint(
            30,
            1000
        )

        repeat_claims = random.randint(
            0,
            2
        )

    incident_date = fake.date_between(
        start_date="-1y",
        end_date="today"
    )

    claims.append({
        "claim_id": claim_id,
        "policy_id": policy_id,
        "customer_id": customer_id,
        "claim_type": random.choice(
            claim_types
        ),
        "incident_date": incident_date,
        "claim_amount": claim_amount,
        "status": random.choice(
            claim_statuses
        ),
        "fraud_score": 0,
        "surveyor_id": random.randint(
            1,
            100
        ),
        "premium_amount": premium_amount,
        "policy_start_date": fake.date_between(
            start_date="-3y",
            end_date="-1d"
        ),
        "kyc_status": random.choice(
            kyc_statuses
        )
    })

    # ML TRAINING DATA
    fraud_training.append({
        "claim_amount": claim_amount,
        "premium_amount": premium_amount,
        "policy_age": policy_age,
        "repeat_claims": repeat_claims,
        "fraud_flag": fraud_flag
    })

claims_df = pd.DataFrame(claims)

fraud_training_df = pd.DataFrame(
    fraud_training
)

# ==========================================
# EXPORT CSV FILES
# ==========================================

agents_df.to_csv(
    "datasets/agents.csv",
    index=False
)

customers_df.to_csv(
    "datasets/customers.csv",
    index=False
)

policies_df.to_csv(
    "datasets/policies.csv",
    index=False
)

claims_df.to_csv(
    "datasets/claims_history.csv",
    index=False
)

fraud_training_df.to_csv(
    "datasets/fraud_training_data.csv",
    index=False
)

print("=================================")
print("DATASETS GENERATED SUCCESSFULLY")
print("=================================")

print(f"Agents: {len(agents_df)}")
print(f"Customers: {len(customers_df)}")
print(f"Policies: {len(policies_df)}")
print(f"Claims: {len(claims_df)}")
print(f"Training Data: {len(fraud_training_df)}")