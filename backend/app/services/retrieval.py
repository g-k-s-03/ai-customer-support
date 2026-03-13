from sqlalchemy.orm import Session
from app.models import DocumentChunk, Document

def retrieve_relevant_chunks(question: str, user_id: int, db: Session, top_k: int = 5) -> list:
    question_words = set(question.lower().split())
    
    stop_words = {"is", "the", "a", "an", "of", "for", "in", "on", "at", "to", "and", "or", "what", "who", "how", "why", "when", "where", "this", "that", "it", "be", "are", "was", "were"}
    question_words = question_words - stop_words

    user_documents = db.query(Document).filter(Document.user_id == user_id).all()
    document_ids = [doc.id for doc in user_documents]

    if not document_ids:
        return []

    chunks = db.query(DocumentChunk).filter(
        DocumentChunk.document_id.in_(document_ids)
    ).all()

    if not chunks:
        return []

    scored_chunks = []
    for chunk in chunks:
        chunk_words = set(chunk.content.lower().split())
        
        exact_matches = len(question_words.intersection(chunk_words))
        
        partial_matches = sum(
            1 for qw in question_words
            for cw in chunk_words
            if qw in cw or cw in qw
        )
        
        score = (exact_matches * 2) + partial_matches
        scored_chunks.append((score, chunk.content))

    scored_chunks.sort(key=lambda x: x[0], reverse=True)

    top_chunks = [content for score, content in scored_chunks[:top_k]]

    return top_chunks