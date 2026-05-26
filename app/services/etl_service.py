from sqlalchemy.orm import Session

from app.etl.claims_etl import process_claims_etl


def process_claims_file(file_path: str, db: Session):

    result = process_claims_etl(file_path, db)

    return result