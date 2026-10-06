"""Quiz Generator routes."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database.database import get_db
from app.middleware.auth import get_current_user_id
from app.models.quiz import Quiz, Question
from app.models.study_session import StudySession
from app.schemas.quiz import (
    QuizGenerateRequest,
    QuizGenerateResponse,
    QuestionSchema,
    QuizSubmitRequest,
    QuizResultResponse,
    QuizResultItem,
    QuizHistoryItem,
)
from app.services import claude_service
from app.database.database import generate_uuid

router = APIRouter(prefix="/api/quiz", tags=["Quiz Generator"])


@router.post("/generate", response_model=QuizGenerateResponse)
async def generate_quiz(
    body: QuizGenerateRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Generate a new quiz using AI."""
    if not body.topic.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a topic for the quiz.",
        )

    if body.num_questions not in [5, 10, 15]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of questions must be 5, 10, or 15.",
        )

    try:
        questions_data = await claude_service.generate_quiz(
            body.topic, body.difficulty, body.num_questions
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    if not questions_data:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI failed to generate questions. Please try again.",
        )

    # Create quiz record
    quiz = Quiz(
        id=generate_uuid(),
        user_id=user_id,
        topic=body.topic,
        difficulty=body.difficulty,
        total_questions=len(questions_data),
    )
    db.add(quiz)
    await db.flush()

    # Create question records
    question_objs = []
    for q_data in questions_data:
        q = Question(
            id=generate_uuid(),
            quiz_id=quiz.id,
            question=q_data.get("question", ""),
            option_a=q_data.get("option_a", ""),
            option_b=q_data.get("option_b", ""),
            option_c=q_data.get("option_c", ""),
            option_d=q_data.get("option_d", ""),
            correct_answer=q_data.get("correct_answer", "A").upper(),
            explanation=q_data.get("explanation", ""),
        )
        db.add(q)
        question_objs.append(q)

    await db.commit()

    return QuizGenerateResponse(
        quiz_id=quiz.id,
        questions=[
            QuestionSchema(
                id=q.id,
                question=q.question,
                option_a=q.option_a,
                option_b=q.option_b,
                option_c=q.option_c,
                option_d=q.option_d,
                correct_answer=q.correct_answer,
                explanation=q.explanation,
            )
            for q in question_objs
        ],
    )


@router.post("/{quiz_id}/submit", response_model=QuizResultResponse)
async def submit_quiz(
    quiz_id: str,
    body: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Submit quiz answers and get results."""
    quiz = await db.get(Quiz, quiz_id)
    if quiz is None or quiz.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found.",
        )

    result = await db.execute(
        select(Question).where(Question.quiz_id == quiz_id)
    )
    questions = result.scalars().all()

    correct = 0
    results = []
    for q in questions:
        user_answer = body.answers.get(q.id, "").upper()
        is_correct = user_answer == q.correct_answer
        if is_correct:
            correct += 1
        results.append(
            QuizResultItem(
                question=q.question,
                options={
                    "A": q.option_a,
                    "B": q.option_b,
                    "C": q.option_c,
                    "D": q.option_d,
                },
                correct_answer=q.correct_answer,
                user_answer=user_answer,
                is_correct=is_correct,
                explanation=q.explanation,
            )
        )

    # Create study session first (before updating quiz score)
    session = StudySession(
        id=generate_uuid(),
        user_id=user_id,
        activity_type="quiz",
        activity_id=quiz.id,
        title=f"Quiz: {quiz.topic}",
    )
    db.add(session)

    quiz.score = correct

    await db.commit()

    percentage = round((correct / len(questions)) * 100) if questions else 0

    return QuizResultResponse(
        quiz_id=quiz.id,
        topic=quiz.topic,
        score=correct,
        total_questions=len(questions),
        percentage=percentage,
        correct_answers=correct,
        incorrect_answers=len(questions) - correct,
        results=results,
    )


@router.get("/history", response_model=list[QuizHistoryItem])
async def get_history(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Get quiz generation history."""
    result = await db.execute(
        select(Quiz)
        .where(Quiz.user_id == user_id)
        .order_by(Quiz.created_at.desc())
    )
    quizzes = result.scalars().all()
    return [
        QuizHistoryItem(
            id=q.id,
            topic=q.topic,
            difficulty=q.difficulty,
            score=q.score,
            total_questions=q.total_questions,
            percentage=round((q.score / q.total_questions) * 100) if q.total_questions else 0,
            created_at=q.created_at.isoformat() if q.created_at else "",
        )
        for q in quizzes
    ]