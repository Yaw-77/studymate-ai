"""Pydantic schemas for Note Summarizer endpoints."""
from pydantic import BaseModel


class SummarizeRequest(BaseModel):
    """Request to summarize notes."""
    text: str
    style: str = "standard"  # short, standard, detailed


class SummaryResponse(BaseModel):
    """Response from the summarizer."""
    id: str
    title: str
    summary: str
    key_points: list[str]
    important_concepts: list[str]
    exam_focus: list[str]
    style: str
    created_at: str


class SummaryHistoryItem(BaseModel):
    """Item in the summary history list."""
    id: str
    title: str
    style: str
    created_at: str