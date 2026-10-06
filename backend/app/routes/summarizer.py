"""Note Summarizer routes."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.middleware.auth import get_current_user_id
from app.models.summary import Summary
from app.models.study_session import StudySession
from app.schemas.summarizer import (
    SummarizeRequest,
    SummaryResponse,
    SummaryHistoryItem,
)
from app.services import claude_service
from app.database.database import generate_uuid

router = APIRouter(prefix="/api/summarizer", tags=["Note Summarizer"])


@router.post("/", response_model=SummaryResponse)
async def summarize(
    body: SummarizeRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Summarize lecture notes using AI."""
    if len(body.text.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide at least 50 characters of notes to summarize.",
        )

    try:
        result = await claude_service.summarize_notes(body.text, body.style)
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    title = body.text.strip()[:80] + ("..." if len(body.text.strip()) > 80 else "")

    summary = Summary(
        id=generate_uuid(),
        user_id=user_id,
        title=title,
        source_text=body.text,
        summary=result.get("summary", ""),
        style=body.style,
    )
    db.add(summary)
    await db.flush()

    # Create study session record
    session = StudySession(
        id=generate_uuid(),
        user_id=user_id,
        activity_type="summarizer",
        activity_id=summary.id,
        title=f"Summarized: {title}",
    )
    db.add(session)

    await db.commit()
    await db.refresh(summary)

    return SummaryResponse(
        id=summary.id,
        title=summary.title,
        summary=summary.summary,
        key_points=result.get("key_points", []),
        important_concepts=result.get("important_concepts", []),
        exam_focus=result.get("exam_focus", []),
        style=summary.style,
        created_at=summary.created_at.isoformat() if summary.created_at else "",
    )


@router.get("/history", response_model=list[SummaryHistoryItem])
async def get_history(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Get summary generation history."""
    result = await db.execute(
        select(Summary)
        .where(Summary.user_id == user_id)
        .order_by(Summary.created_at.desc())
    )
    summaries = result.scalars().all()
    return [
        SummaryHistoryItem(
            id=s.id,
            title=s.title,
            style=s.style,
            created_at=s.created_at.isoformat() if s.created_at else "",
        )
        for s in summaries
    ]