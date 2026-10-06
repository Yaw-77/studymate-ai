"""Flashcard Generator routes."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.database import get_db
from app.middleware.auth import get_current_user_id
from app.models.flashcard import FlashcardSet, Flashcard
from app.models.study_session import StudySession
from app.schemas.flashcard import (
    FlashcardGenerateRequest,
    FlashcardGenerateResponse,
    FlashcardSchema,
    FlashcardSetResponse,
    FlashcardHistoryItem,
)
from app.services import claude_service
from app.database.database import generate_uuid

router = APIRouter(prefix="/api/flashcards", tags=["Flashcards"])


@router.post("/generate", response_model=FlashcardGenerateResponse)
async def generate_flashcards(
    body: FlashcardGenerateRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Generate a new flashcard set using AI."""
    if not body.topic.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a topic for the flashcards.",
        )

    if body.num_cards < 3 or body.num_cards > 30:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of cards must be between 3 and 30.",
        )

    try:
        cards_data = await claude_service.generate_flashcards(
            body.topic, body.num_cards
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    if not cards_data:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI failed to generate flashcards. Please try again.",
        )

    # Create flashcard set
    title = f"Flashcards: {body.topic}"
    flashcard_set = FlashcardSet(
        id=generate_uuid(),
        user_id=user_id,
        title=title,
        topic=body.topic,
    )
    db.add(flashcard_set)
    await db.flush()

    # Create individual flashcards
    flashcard_objs = []
    for card_data in cards_data:
        card = Flashcard(
            id=generate_uuid(),
            set_id=flashcard_set.id,
            question=card_data.get("question", ""),
            answer=card_data.get("answer", ""),
        )
        db.add(card)
        flashcard_objs.append(card)

    await db.commit()

    # Create study session
    session = StudySession(
        id=generate_uuid(),
        user_id=user_id,
        activity_type="flashcards",
        activity_id=flashcard_set.id,
        title=title,
    )
    db.add(session)
    await db.commit()

    return FlashcardGenerateResponse(
        set_id=flashcard_set.id,
        flashcards=[
            FlashcardSchema(
                question=c.question,
                answer=c.answer,
            )
            for c in flashcard_objs
        ],
    )


@router.get("", response_model=list[FlashcardHistoryItem])
async def list_flashcard_sets(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """List all flashcard sets for the current user."""
    # Use a single query with COUNT to avoid N+1 problem
    result = await db.execute(
        select(FlashcardSet, func.count(Flashcard.id).label("card_count"))
        .outerjoin(Flashcard, Flashcard.set_id == FlashcardSet.id)
        .where(FlashcardSet.user_id == user_id)
        .group_by(FlashcardSet.id)
        .order_by(FlashcardSet.created_at.desc())
    )
    sets_with_counts = result.all()

    response = []
    for fs, count in sets_with_counts:
        response.append(
            FlashcardHistoryItem(
                id=fs.id,
                title=fs.title,
                topic=fs.topic,
                card_count=count,
                created_at=fs.created_at.isoformat() if fs.created_at else "",
            )
        )
    return response


@router.get("/{set_id}", response_model=FlashcardSetResponse)
async def get_flashcard_set(
    set_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Get a flashcard set with all its cards."""
    flashcard_set = await db.get(FlashcardSet, set_id)
    if flashcard_set is None or flashcard_set.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard set not found.",
        )

    result = await db.execute(
        select(Flashcard).where(Flashcard.set_id == set_id)
    )
    cards = result.scalars().all()

    return FlashcardSetResponse(
        id=flashcard_set.id,
        title=flashcard_set.title,
        topic=flashcard_set.topic,
        created_at=flashcard_set.created_at.isoformat() if flashcard_set.created_at else "",
        cards=[
            FlashcardSchema(question=c.question, answer=c.answer)
            for c in cards
        ],
    )