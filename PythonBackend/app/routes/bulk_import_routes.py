from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.bulk_import_service import (
    import_agents,
    import_customers,
    import_policies,
    import_claims
)

router = APIRouter(
    prefix="/bulk-import",
    tags=["Bulk Import"]
)


# ==========================================
# IMPORT AGENTS
# ==========================================

@router.post("/agents")

def bulk_import_agents(
    db: Session = Depends(get_db)
):

    result = import_agents(
        "datasets/agents.csv",
        db
    )

    return result


# ==========================================
# IMPORT CUSTOMERS
# ==========================================

@router.post("/customers")

def bulk_import_customers(
    db: Session = Depends(get_db)
):

    result = import_customers(
        "datasets/customers.csv",
        db
    )

    return result


# ==========================================
# IMPORT POLICIES
# ==========================================

@router.post("/policies")

def bulk_import_policies(
    db: Session = Depends(get_db)
):

    result = import_policies(
        "datasets/policies.csv",
        db
    )

    return result


# ==========================================
# IMPORT CLAIMS
# ==========================================

@router.post("/claims")

def bulk_import_claims(
    db: Session = Depends(get_db)
):

    result = import_claims(
        "datasets/claims_history.csv",
        db
    )

    return result