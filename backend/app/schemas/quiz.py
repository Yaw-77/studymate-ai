"""Pydantic schemas for Quiz Generator endpoints."""
from pydantic import BaseModel
from typing import Optional


class QuizGenerateRequest(BaseModel):
    """Request to generate a quiz."""
    topic: str
    difficulty: str = "medium"  # easy, medium, hard
    num_questions: int = 5


class QuestionSchema(BaseModel):
    """Schema for a single quiz question."""
    id: str
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    explanation: str = ""


class QuizGenerateResponse(BaseModel):
    """Response from quiz generation."""
    quiz_id: str
    questions: list[QuestionSchema]


class QuizSubmitRequest(BaseModel):
    """Request to submit quiz answers."""
    answers: dict[str, str]  # question_id -> selected option (A/B/C/D)


class QuizResultItem(BaseModel):
    """Schema for a single question result."""
    question: str
    options: dict[str, str]
    correct_answer: str
    user_answer: str
    is_correct: bool
    explanation: str


class QuizResultResponse(BaseModel):
    """Schema for quiz results."""
    quiz_id: str
    topic: str
    score: int
    total_questions: int
    percentage: int
    correct_answers: int
    incorrect_answers: int
    results: list[QuizResultItem]


class QuizHistoryItem(BaseModel):
    """Schema for a quiz in history."""
    id: str
    topic: str
    difficulty: str
    score: int
    total_questions: int
    percentage: int
    created_at: str