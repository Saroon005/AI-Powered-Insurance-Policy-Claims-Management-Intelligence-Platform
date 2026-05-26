from fastapi import APIRouter

from app.services.realtime_fraud_service import (
    process_claim_realtime,
    simulate_live_claims
)

from app.core.event_bus import get_events

router = APIRouter(
    prefix="/realtime",
    tags=["Real-Time Fraud Engine"]
)


# ==========================================
# PROCESS SINGLE CLAIM LIVE
# ==========================================

@router.post("/process-claim")
def process_claim(claim: dict):

    return process_claim_realtime(claim)


# ==========================================
# SIMULATE LIVE STREAM
# ==========================================

@router.get("/simulate-stream")
def simulate_stream():

    return simulate_live_claims()


# ==========================================
# GET EVENT STREAM
# ==========================================

@router.get("/events")
def events():

    return get_events()