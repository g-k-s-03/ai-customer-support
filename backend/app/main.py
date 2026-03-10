from fastapi import FastAPI
from app.database import engine
from app.models import Base
from app.routes import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
def root():
    return {"message": "AI Customer Support API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}