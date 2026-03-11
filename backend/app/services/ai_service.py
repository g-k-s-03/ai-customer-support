from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_answer(question: str, context_chunks: list) -> str:
    if not context_chunks:
        return "I could not find relevant information in the uploaded documents to answer your question."
    
    context = "\n\n".join(context_chunks)
    
    prompt = f"""You are a helpful customer support assistant. 
Use the following document context to answer the user's question accurately.
Only answer based on the provided context. If the answer is not in the context, say so.

Context:
{context}

Question: {question}

Answer:"""
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content