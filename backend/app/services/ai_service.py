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
Use the following document context to answer the user's question.
Try your best to answer based on the context. If you can make a reasonable inference, do so.
Only say you don't know if there is truly no relevant information.

Context:
{context}

Question: {question}

Answer:"""
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content