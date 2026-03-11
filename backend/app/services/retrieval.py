from sqlalchemy.orm import Session
from app.models import DocumentChunk, Document

def retrieve_relevant_chunks(question: str, user_id: int, db: Session, top_k: int = 3) -> list:
    question_words = set(question.lower().split())
    
    user_documents = db.query(Document).filter(Document.user_id == user_id).all()
    document_ids = [doc.id for doc in user_documents]
    
    if not document_ids:
        return []
    
    chunks = db.query(DocumentChunk).filter(
        DocumentChunk.document_id.in_(document_ids)
    ).all()
    
    scored_chunks = []
    for chunk in chunks:
        chunk_words = set(chunk.content.lower().split())
        score = len(question_words.intersection(chunk_words))
        scored_chunks.append((score, chunk.content))
    
    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    
    top_chunks = [content for score, content in scored_chunks[:top_k] if score > 0]
    
    return top_chunks