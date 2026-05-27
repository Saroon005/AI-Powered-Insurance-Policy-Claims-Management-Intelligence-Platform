REQUIRED_COLUMNS = [
    "policy_id",
    "customer_id",
    "claim_type",
    "incident_date",
    "claim_amount",
    "status",
    "premium_amount",
    "policy_start_date",
    "kyc_status"
]


def validate_claims_csv(df):

    missing_columns = []

    for column in REQUIRED_COLUMNS:
        if column not in df.columns:
            missing_columns.append(column)

    return missing_columns