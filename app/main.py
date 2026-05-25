from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI Powered Insurance Analytics & Fraud Detection Service"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root API
@app.get("/")
def root():
    return {
        "message": "Insurance AI Service Running Successfully"
    }


# Health Check API
@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }