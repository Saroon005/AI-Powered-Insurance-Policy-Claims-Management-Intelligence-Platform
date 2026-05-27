from app.core.database import engine, Base

from app.models import *

print("Creating all database tables...")

Base.metadata.create_all(bind=engine)

print("All tables created successfully.")