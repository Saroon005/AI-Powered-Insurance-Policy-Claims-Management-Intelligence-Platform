from collections import deque
import time

# Simple in-memory event stream (Kafka simulation)

EVENT_STREAM = deque(maxlen=100)


def publish_event(event_type: str, payload: dict):

    event = {
        "event_type": event_type,
        "payload": payload,
        "timestamp": time.time()
    }

    EVENT_STREAM.append(event)

    return event


def get_events():

    return list(EVENT_STREAM)