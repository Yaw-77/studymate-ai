# StudyMate AI

An AI-powered study assistant for university students. Built with React, FastAPI, PostgreSQL, and Anthropic Claude.

## Overview

StudyMate AI helps students:
- Ask an AI tutor questions
- Understand difficult academic concepts
- Summarize study notes
- Generate quizzes
- Generate flashcards
- Track study activity and quiz performance

## Features

### Frontend
- Landing page with hero, features, how-it-works, about, CTA, and footer sections
- User registration and login with JWT authentication
- Persistent sidebar navigation with a mobile slide-over drawer
- Dashboard with statistics and recent activity
- AI Tutor with ChatGPT-style interface
- Note Summarizer with short/standard/detailed modes
- Quiz Generator with multiple-choice questions
- Flashcard Generator with flip animation
- Study History with filtering
- Profile settings and security

### Backend
- REST API with FastAPI
- JWT authentication with bcrypt password hashing
- PostgreSQL database with SQLAlchemy ORM
- Anthropic Claude API integration
- Pydantic request/response validation
- CORS configuration
- Environment-based configuration

## Tech Stack

### Frontend
- React 18 + Vite + Tailwind CSS
- React Router for routing
- Axios for API calls
- Recharts for charts
- Lucide React for icons
- React Markdown for AI responses

### Backend
- Python 3.12 + FastAPI
- SQLAlchemy + asyncpg for PostgreSQL
- Pydantic for validation
- Anthropic SDK for Claude API
- Passlib for password hashing
- Python-Jose for JWT tokens

### Database
- PostgreSQL 16
- SQLAlchemy ORM with async sessions

### Deployment
- Docker + docker-compose
- Nginx for frontend
- Uvicorn for backend

## Architecture

```
studymate-ai/
├── frontend/           # React + Vite application
├── backend/            # FastAPI application
├── docker-compose.yml  # Multi-container setup
├── README.md
├── .gitignore
└── .env.example
```

## Database Design

### Tables

**users** - User accounts
- id (PK), name, email, password_hash, university, program, created_at

**conversations** - AI Tutor conversations
- id (PK), user_id (FK), title, created_at, updated_at

**messages** - Chat messages
- id (PK), conversation_id (FK), role, content, created_at

**summaries** - Note summaries
- id (PK), user_id (FK), title, source_text, summary, style, created_at

**quizzes** - Quiz records
- id (PK), user_id (FK), topic, difficulty, score, total_questions, created_at

**questions** - Quiz questions
- id (PK), quiz_id (FK), question, option_a-d, correct_answer, explanation

**flashcard_sets** - Flashcard collections
- id (PK), user_id (FK), title, topic, created_at

**flashcards** - Individual flashcards
- id (PK), set_id (FK), question, answer

**study_sessions** - Activity tracking
- id (PK), user_id (FK), activity_type, activity_id, created_at

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile
- POST /api/auth/logout - Logout

### AI Tutor
- POST /api/tutor/chat - Send message to AI
- GET /api/tutor/conversations - List conversations
- GET /api/tutor/conversations/{id} - Get conversation with messages
- DELETE /api/tutor/conversations/{id} - Delete conversation

### Note Summarizer
- POST /api/summarizer - Summarize notes
- GET /api/summarizer/history - Get summary history

### Quiz
- POST /api/quiz/generate - Generate quiz
- POST /api/quiz/{id}/submit - Submit quiz answers
- GET /api/quiz/history - Get quiz history

### Flashcards
- POST /api/flashcards/generate - Generate flashcards
- GET /api/flashcards - List flashcard sets
- GET /api/flashcards/{id} - Get flashcard set

### Dashboard
- GET /api/dashboard - Get dashboard statistics

### History
- GET /api/history - Get study history (with type filter)

## Installation

### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL 16+
- Docker (optional)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Using Docker
```bash
cd ..
cp .env.example .env
# Edit .env with your Anthropic API key
docker-compose up --build
```

The app is then served at http://localhost:80. Nginx proxies `/api` to the
backend container, so the browser only ever talks to one origin.

## Environment Variables

### Backend (.env)
- DATABASE_URL - PostgreSQL connection string
- ANTHROPIC_API_KEY - Anthropic Claude API key
- SECRET_KEY - JWT secret key
- ALGORITHM - JWT algorithm (HS256)
- ACCESS_TOKEN_EXPIRE_DAYS - Token expiry in days
- FRONTEND_URL - Frontend URL for CORS
- BACKEND_URL - Backend URL

### Frontend (.env)
- VITE_API_BASE_URL - Backend API URL. Optional. Leave unset to use same-origin
  requests, which is what the Vite dev proxy and the nginx `/api` proxy expect.

## Running Locally

1. Start PostgreSQL:
```bash
docker run -d -p 5432:5432 -e POSTGRES_USER=studymate -e POSTGRES_PASSWORD=studymate123 -e POSTGRES_DB=studymate postgres:16-alpine
```

2. Start backend:
```bash
cd backend && uvicorn app.main:app --reload
```

3. Start frontend:
```bash
cd frontend && npm run dev
```

Visit http://localhost:5173

## Testing

The application has been tested with:
- Manual testing of all features
- Form validation testing
- Error handling verification
- Responsive design testing at 320px, 375px, 768px, 1024px, 1440px

## Deployment

Use the provided Docker Compose configuration for production deployment:
```bash
docker-compose -f docker-compose.yml up -d
```

| Service    | URL                     | Notes                          |
| ---------- | ----------------------- | ------------------------------ |
| Frontend   | http://localhost:80     | Nginx serves the built SPA     |
| Backend API| http://localhost:8000   | FastAPI + Swagger at `/docs`   |
| Database   | localhost:5432          | PostgreSQL 16                  |

Nginx handles the SPA fallback (`try_files`), so refreshing a deep link such
as `/dashboard` correctly serves `index.html`.

## Security

- Passwords hashed with bcrypt
- JWT authentication with secure tokens
- Protected routes with middleware
- Input validation with Pydantic
- CORS configuration
- Environment variables for secrets
- No API keys in frontend code

Note: This application uses basic security measures suitable for a portfolio project. For production use, additional security hardening is recommended.

## Future Improvements

- PDF and Word document uploads
- RAG with vector database
- Spaced repetition system
- Voice input and text-to-speech
- AI exam simulator
- Personalized study plans
- Email study reminders
- PWA/mobile application

## Author

StudyMate AI - Portfolio Project

## License

MIT