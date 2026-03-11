from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Document, User
from app.security import verify_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import shutil
import os

router = APIRouter()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/upload")
def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    allowed_types = ["text/plain", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only TXT and PDF files are allowed")
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    document = Document(filename=file.filename, content="", user_id=current_user.id)
    db.add(document)
    db.commit()
    db.refresh(document)
    return {"message": "File uploaded successfully", "document_id": document.id}

@router.get("/")
def get_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    return documents

@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(document)
    db.commit()
    return {"message": "Document deleted successfully"}