# AI Customer Support Automation System

An AI-powered customer support system that allows businesses to upload knowledge documents and automatically answer user questions using AI.

## Features

- User authentication (register/login)
- Document upload (TXT, PDF)
- Automatic text extraction and chunking
- AI-powered question answering
- Chat session history
- REST API

## Tech Stack

- **Backend:** Python, FastAPI
- **Database:** PostgreSQL (Supabase)
- **AI:** Groq API (LLaMA 3)
- **Frontend:** React, Vite
- **Auth:** JWT tokens

## Project Structure
```
ai-customer-support/
├── backend/
│   ├── app/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── database.py    # DB connection
│   │   ├── security.py    # Auth helpers
│   │   └── main.py        # App entry point
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/         # React pages
        └── App.jsx
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login user |
| POST | /documents/upload | Upload document |
| GET | /documents/ | List documents |
| DELETE | /documents/{id} | Delete document |
| POST | /chat/ask | Ask a question |
| GET | /chat/sessions | Get chat sessions |

## Setup Instructions

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the `backend` folder:
```
DATABASE_URL=your_supabase_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=your_groq_api_key
```