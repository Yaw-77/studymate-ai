"""Study History routes."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.middleware.auth import get_current_user_id
from app.models.conversation import Conversation
from app.models.summary import Summary
from app.models.quiz import Quiz
from app.models.flashcard import FlashcardSet
from app.schemas.dashboard import HistoryItem

router = APIRouter(prefix="/api/history", tags=["Study History"])


@router.get("", response_model=list[HistoryItem])
async def get_history(
    type: str = Query(default="all", description="Filter by activity type"),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Get study history with optional type filter."""
    items = []

    if type in ("all", "tutor"):
        result = await db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.created_at.desc())
            .limit(50)
        )
        for c in result.scalars().all():
            items.append(
                HistoryItem(
                    id=c.id,
                    type="tutor",
                    title=c.title,
                    date=c.created_at.isoformat() if c.created_at else "",
                    detail=f"{c.title}",
                )
            )

    if type in ("all", "summarizer"):
        result = await db.execute(
            select(Summary)
            .where(Summary.user_id == user_id)
            .order_by(Summary.created_at.desc())
            .limit(50)
        )
        for s in result.scalars().all():
            items.append(
                HistoryItem(
                    id=s.id,
                    type="summarizer",
                    title=s.title,
                    date=s.created_at.isoformat() if s.created_at else "",
                    detail=f"Style: {s.style}",
                )
            )

    if type in ("all", "quiz"):
        result = await db.execute(
            select(Quiz)
            .where(Quiz.user_id == user_id)
            .order_by(Quiz.created_at.desc())
            .limit(50)
        )
        for q in result.scalars().all():
            percentage = round((q.score / q.total_questions) * 100) if q.total_questions else 0
            items.append(
                HistoryItem(
                    id=q.id,
                    type="quiz",
                    title=f"Quiz: {q.topic}",
                    date=q.created_at.isoformat() if q.created_at else "",
                    score=percentage,
                    detail=f"{q.score}/{q.total_questions} correct ({percentage}%)",
                )
            )

    if type in ("all", "flashcards"):
        result = await db.execute(
            select(FlashcardSet)
            .where(FlashcardSet.user_id == user_id)
            .order_by(FlashcardSet.created_at.desc())
            .limit(50)
        )
        for fs in result.scalars().all():
            items.append(
                HistoryItem(
                    id=fs.id,
                    type="flashcards",
                    title=fs.title,
                    date=fs.created_at.isoformat() if fs.created_at else "",
                    detail=f"Topic: {fs.topic}",
                )
            )

    # Sort by date descending
    items.sort(key=lambda x: x.date, reverse=True)
    return items