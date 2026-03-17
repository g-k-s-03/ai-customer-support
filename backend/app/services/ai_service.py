from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set!")
    return Groq(api_key=api_key)

def generate_answer(question: str, context_chunks: list) -> str:
    if not context_chunks:
        return "I could not find relevant information in the uploaded documents to answer your question."
    
    context = "\n\n".join(context_chunks)
    
    prompt = f"""You are a helpful customer support assistant.
Use the following document context to answer the user's question.
Try your best to answer based on the context. If you can make a reasonable inference, do so.
Only say you don't know if there is truly no relevant information.

Context:
{context}

Question: {question}

Answer:"""
    
    client = get_groq_client()  # creates client only when needed
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content