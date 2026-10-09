"""Pydantic schemas for Flashcard Generator endpoints."""
from pydantic import BaseModel


class FlashcardGenerateRequest(BaseModel):
    """Request to generate flashcards."""
    topic: str
    num_cards: int = 10


class FlashcardSchema(BaseModel):
    """Schema for a single flashcard."""
    question: str
    answer: str


class FlashcardGenerateResponse(BaseModel):
    """Response from flashcard generation."""
    set_id: str
    flashcards: list[FlashcardSchema]


class FlashcardSetResponse(BaseModel):
    """Schema for a flashcard set."""
    id: str
    title: str
    topic: str
    created_at: str
    cards: list[FlashcardSchema] = []


class FlashcardHistoryItem(BaseModel):
    """Schema for a flashcard set in history."""
    id: str
    title: str
    topic: str
    card_count: int
    created_at: str