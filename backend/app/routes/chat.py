from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import ChatSession, Message, User
from app.security import verify_token
from app.services.retrieval import retrieve_relevant_chunks
from app.services.ai_service import generate_answer
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

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

class QuestionRequest(BaseModel):
    question: str
    session_id: int = None

@router.post("/ask")
def ask_question(request: QuestionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if request.session_id:
        session = db.query(ChatSession).filter(ChatSession.id == request.session_id, ChatSession.user_id == current_user.id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = ChatSession(user_id=current_user.id)
        db.add(session)
        db.commit()
        db.refresh(session)

    relevant_chunks = retrieve_relevant_chunks(request.question, current_user.id, db)
    answer = generate_answer(request.question, relevant_chunks)

    message = Message(question=request.question, answer=answer, session_id=session.id)
    db.add(message)
    db.commit()

    return {"session_id": session.id, "question": request.question, "answer": answer}

@router.get("/sessions")
def get_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sessions = db.query(ChatSession).filter(ChatSession.user_id == current_user.id).all()
    return sessions

@router.get("/session/{session_id}")
def get_session_messages(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = db.query(Message).filter(Message.session_id == session_id).all()
    return messages