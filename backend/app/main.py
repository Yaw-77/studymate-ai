"""StudyMate AI FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.utils.config import settings
from app.database.database import init_db
# Import models so SQLAlchemy knows about all tables before create_all
from app.models import user, conversation, summary, quiz, flashcard, study_session  # noqa: F401
from app.routes import auth, tutor, summarizer, quiz, flashcards, dashboard, history

app = FastAPI(
    title="StudyMate AI API",
    description="AI-powered study assistant API for university students",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://studymate-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tutor.router)
app.include_router(summarizer.router)
app.include_router(quiz.router)
app.include_router(flashcards.router)
app.include_router(dashboard.router)
app.include_router(history.router)


@app.on_event("startup")
async def on_startup():
    """Initialize database tables on startup."""
    await init_db()


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": "StudyMate AI API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global error handler to prevent stack trace leakage."""
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )