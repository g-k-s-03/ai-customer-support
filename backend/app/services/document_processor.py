import PyPDF2
import os

def extract_text_from_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

def extract_text(file_path: str, content_type: str) -> str:
    if content_type == "text/plain":
        return extract_text_from_txt(file_path)
    elif content_type == "application/pdf":
        return extract_text_from_pdf(file_path)
    return ""