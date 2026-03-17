from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base
from app.routes import auth, documents, chat
import logging
import os
import sys 

print(f"DATABASE_URL exists: {bool(os.getenv('DATABASE_URL'))}", flush=True)
print(f"GROQ_API_KEY exists: {bool(os.getenv('GROQ_API_KEY'))}", flush=True)
print(f"SECRET_KEY exists: {bool(os.getenv('SECRET_KEY'))}", flush=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables safely
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Database connection failed: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "AI Customer Support API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}