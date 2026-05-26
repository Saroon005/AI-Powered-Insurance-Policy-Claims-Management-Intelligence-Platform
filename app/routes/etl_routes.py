from fastapi import APIRouter

router = APIRouter(
    prefix="/etl",
    tags=["ETL Processing"]
)


@router.get("/")
def etl_home():
    return {
        "message": "ETL Module"
    }