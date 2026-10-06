"""Dashboard routes."""
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.database import get_db
from app.middleware.auth import get_current_user_id
from app.models.conversation import Conversation
from app.models.summary import Summary
from app.models.quiz import Quiz
from app.models.flashcard import FlashcardSet
from app.models.study_session import StudySession
from app.schemas.dashboard import DashboardResponse, DashboardStats, DashboardActivity

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Get dashboard statistics and recent activity."""
    # Count distinct topics studied (from quizzes + flashcard sets + summaries)
    quiz_topics = await db.execute(
        select(func.count(func.distinct(Quiz.topic))).where(Quiz.user_id == user_id)
    )
    quiz_topic_count = quiz_topics.scalar() or 0

    flashcard_topics = await db.execute(
        select(func.count(func.distinct(FlashcardSet.topic))).where(FlashcardSet.user_id == user_id)
    )
    flashcard_topic_count = flashcard_topics.scalar() or 0

    summary_topics = await db.execute(
        select(func.count(func.distinct(Summary.title))).where(Summary.user_id == user_id)
    )
    summary_topic_count = summary_topics.scalar() or 0

    topics_studied = quiz_topic_count + flashcard_topic_count + summary_topic_count

    # Quizzes completed
    quizzes_result = await db.execute(
        select(Quiz).where(Quiz.user_id == user_id)
    )
    quizzes = quizzes_result.scalars().all()
    quizzes_completed = len(quizzes)

    # Average score
    if quizzes_completed > 0:
        total_score = sum(q.score for q in quizzes)
        average_score = round(total_score / quizzes_completed)
    else:
        average_score = 0

    # Study streak (consecutive days with activity)
    sessions_result = await db.execute(
        select(StudySession.created_at)
        .where(StudySession.user_id == user_id)
        .order_by(StudySession.created_at.desc())
    )
    session_dates = sessions_result.scalars().all()

    streak = 0
    if session_dates:
        today = datetime.now(timezone.utc).date()
        unique_dates = sorted(set(d.date() for d in session_dates), reverse=True)
        current_date = today
        for d in unique_dates:
            if d == current_date:
                streak += 1
                current_date -= timedelta(days=1)
            elif d == current_date - timedelta(days=1):
                streak += 1
                current_date = d
            else:
                break

    # Recent activity
    activities = []

    # Recent conversations
    conv_result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
        .limit(5)
    )
    for c in conv_result.scalars().all():
        activities.append(
            DashboardActivity(
                id=c.id,
                type="tutor",
                title=c.title,
                date=c.updated_at.isoformat() if c.updated_at else "",
            )
        )

    # Recent summaries
    sum_result = await db.execute(
        select(Summary)
        .where(Summary.user_id == user_id)
        .order_by(Summary.created_at.desc())
        .limit(5)
    )
    for s in sum_result.scalars().all():
        activities.append(
            DashboardActivity(
                id=s.id,
                type="summarizer",
                title=s.title,
                date=s.created_at.isoformat() if s.created_at else "",
            )
        )

    # Recent quizzes
    for q in quizzes[:5]:
        activities.append(
            DashboardActivity(
                id=q.id,
                type="quiz",
                title=f"Quiz: {q.topic}",
                date=q.created_at.isoformat() if q.created_at else "",
                score=q.score,
            )
        )

    # Recent flashcard sets
    fs_result = await db.execute(
        select(FlashcardSet)
        .where(FlashcardSet.user_id == user_id)
        .order_by(FlashcardSet.created_at.desc())
        .limit(5)
    )
    for fs in fs_result.scalars().all():
        activities.append(
            DashboardActivity(
                id=fs.id,
                type="flashcards",
                title=fs.title,
                date=fs.created_at.isoformat() if fs.created_at else "",
            )
        )

    # Sort by date descending
    activities.sort(key=lambda a: a.date, reverse=True)
    activities = activities[:10]

    stats = DashboardStats(
        topics_studied=topics_studied,
        quizzes_completed=quizzes_completed,
        average_score=average_score,
        study_streak=streak,
    )

    return DashboardResponse(stats=stats, recent_activity=activities)