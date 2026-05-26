import pandas as pd

from sqlalchemy.orm import Session

from app.models.claims_model import Claim

from app.etl.validators import validate_claims_csv

from app.etl.transformations import (
    calculate_policy_age,
    calculate_claim_ratio,
    derive_risk_flag
)

from app.utils.logger import logger


def process_claims_etl(file_path: str, db: Session):

    logger.info("Starting Claims ETL Process")

    # Read CSV
    df = pd.read_csv(file_path)

    logger.info(f"CSV Loaded: {len(df)} rows")

    # Validate CSV
    missing_columns = validate_claims_csv(df)

    if missing_columns:
        return {
            "success": False,
            "missing_columns": missing_columns
        }

    # Fill missing values
    df = df.fillna(0)

    processed_records = 0

    for _, row in df.iterrows():

        try:

            claim_amount = float(row["claim_amount"])
            premium_amount = float(row["premium_amount"])

            policy_start_date = pd.to_datetime(
                row["policy_start_date"]
            ).date()

            incident_date = pd.to_datetime(
                row["incident_date"]
            ).date()

            # Feature Engineering
            policy_age = calculate_policy_age(
                policy_start_date
            )

            claim_ratio = calculate_claim_ratio(
                claim_amount,
                premium_amount
            )

            risk_flag = derive_risk_flag(claim_ratio)

            # Create Claim Object
            claim = Claim(
                policy_id=int(row["policy_id"]),
                customer_id=int(row["customer_id"]),
                claim_type=row["claim_type"],
                incident_date=incident_date,
                claim_amount=claim_amount,
                status=row["status"],
                fraud_score=0,
                surveyor_id=1
            )

            db.add(claim)

            processed_records += 1

            logger.info(
                f"Processed Claim Row "
                f"Policy={row['policy_id']} "
                f"Risk={risk_flag}"
            )

        except Exception as e:

            logger.error(f"Error Processing Row: {e}")

    db.commit()

    logger.info(
        f"ETL Completed. "
        f"Records Processed={processed_records}"
    )

    return {
        "success": True,
        "processed_records": processed_records
    }