from fastapi import FastAPI

from app.routes import fraud_routes
from app.routes import analytics_routes
from app.routes import etl_routes

app = FastAPI(
    title="Insurance AI Analytics Engine",
    version="1.0.0"
)

# Include Routers
app.include_router(fraud_routes.router)
app.include_router(analytics_routes.router)
app.include_router(etl_routes.router)


@app.get("/")
def home():
    return {
        "message": "Insurance AI Engine Running Successfully"
    }


@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "Insurance AI Engine"
    }