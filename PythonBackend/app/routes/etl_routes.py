import os

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.etl_service import process_claims_file

router = APIRouter(
    prefix="/etl",
    tags=["ETL Processing"]
)

UPLOAD_FOLDER = "datasets"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload-claims")

async def upload_claims_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    result = process_claims_file(file_path, db)

    return result


@router.get("/")
def etl_home():

    return {
        "message": "ETL Module Running"
    }