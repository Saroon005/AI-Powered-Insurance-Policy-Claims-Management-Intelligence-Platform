import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import fraud_routes
from app.routes import analytics_routes
from app.routes import etl_routes
from app.routes import bulk_import_routes
from app.routes import intelligence_routes
from app.routes import realtime_routes




app = FastAPI(
    title="Insurance AI Analytics Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://13.53.44.247:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(fraud_routes.router)
app.include_router(analytics_routes.router)
app.include_router(etl_routes.router)
app.include_router(bulk_import_routes.router)
app.include_router(intelligence_routes.router)
app.include_router(realtime_routes.router)


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