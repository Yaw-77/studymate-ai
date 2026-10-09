"""Pydantic schemas for Dashboard and History endpoints."""
from pydantic import BaseModel


class DashboardStats(BaseModel):
    """Dashboard statistics."""
    topics_studied: int
    quizzes_completed: int
    average_score: int
    study_streak: int


class DashboardActivity(BaseModel):
    """Recent activity item."""
    id: str
    type: str  # tutor, summarizer, quiz, flashcards
    title: str
    date: str
    score: int | None = None


class DashboardResponse(BaseModel):
    """Full dashboard response."""
    stats: DashboardStats
    recent_activity: list[DashboardActivity]


class HistoryItem(BaseModel):
    """Generic history item."""
    id: str
    type: str
    title: str
    date: str
    score: int | None = None
    detail: str = ""