"""Pydantic schemas for AI Tutor endpoints."""
from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    """Request to send a message to the AI tutor."""
    message: str
    conversation_id: Optional[str] = None
    history: list[dict] = []


class ChatResponse(BaseModel):
    """Response from the AI tutor."""
    response: str
    conversation_id: str


class ConversationResponse(BaseModel):
    """Schema for a conversation summary."""
    id: str
    title: str
    created_at: str
    updated_at: str


class MessageSchema(BaseModel):
    """Schema for a single message."""
    id: str
    role: str
    content: str
    created_at: str


class ConversationDetailResponse(ConversationResponse):
    """Schema for a conversation with its messages."""
    messages: list[MessageSchema] = []