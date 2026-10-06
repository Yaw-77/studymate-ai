"""Claude API service for AI-powered study features."""
import json
import re
from typing import Optional

import anthropic
from anthropic import APIError, APIStatusError, RateLimitError

from app.utils.config import settings

# Initialize Anthropic client
_client: Optional[anthropic.AsyncAnthropic] = None


def get_client() -> anthropic.AsyncAnthropic:
    """Lazy-initialize the Async Anthropic client."""
    global _client
    if _client is None:
        if not settings.ANTHROPIC_API_KEY:
            raise RuntimeError("ANTHROPIC_API_KEY is not configured.")
        _client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _client


def get_model() -> str:
    """Get the configured Claude model."""
    return settings.CLAUDE_MODEL


# System prompt for the AI tutor
TUTOR_SYSTEM_PROMPT = """You are StudyMate AI, an academic tutor designed to help university students understand difficult concepts.

Explain concepts using simple and clear language.
Break complicated concepts into smaller parts.
Use examples where useful.
Use step-by-step explanations when appropriate.
For programming questions, provide understandable code examples and explain the code.
Encourage learning and understanding rather than simply giving answers.
Adapt explanations to the student's level."""


def _extract_json(text: str) -> dict:
    """Extract JSON from Claude's response, handling markdown code blocks."""
    # Try to find JSON in code blocks first
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()
    else:
        # Try to find raw JSON object
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            text = match.group(0).strip()
    return json.loads(text)


async def tutor_chat(message: str, history: list[dict]) -> str:
    """Send a message to Claude and get a tutor response."""
    client = get_client()
    messages = []
    for turn in history:
        messages.append({"role": turn["role"], "content": turn["content"]})
    messages.append({"role": "user", "content": message})

    try:
        response = await client.messages.create(
            model=get_model(),
            max_tokens=2048,
            system=TUTOR_SYSTEM_PROMPT,
            messages=messages,
        )
        return response.content[0].text
    except RateLimitError:
        raise RuntimeError("Claude API rate limit reached. Please try again in a moment.")
    except APIStatusError as e:
        raise RuntimeError(f"Claude API error: {e.status_code}")
    except APIError as e:
        raise RuntimeError(f"Claude API error: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Failed to get AI response: {str(e)}")


async def summarize_notes(text: str, style: str = "standard") -> dict:
    """Summarize lecture notes using Claude."""
    style_prompts = {
        "short": "Provide a concise 2-3 paragraph summary.",
        "standard": "Provide a thorough summary with key points and important concepts.",
        "detailed": "Provide a comprehensive, detailed summary with thorough explanations.",
    }

    style_instruction = style_prompts.get(style, style_prompts["standard"])

    prompt = f"""Summarize the following lecture notes. {style_instruction}

Return your response in this exact JSON format:
{{
  "summary": "the main summary text",
  "key_points": ["point 1", "point 2", ...],
  "important_concepts": ["concept 1", "concept 2", ...],
  "exam_focus": ["topic 1", "topic 2", ...]
}}

Lecture Notes:
---
{text}
---

Return ONLY valid JSON, no markdown formatting."""

    client = get_client()
    try:
        response = await client.messages.create(
            model=get_model(),
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text
        return _extract_json(raw)
    except (RateLimitError, APIStatusError, APIError) as e:
        raise RuntimeError(f"Claude API error: {str(e)}")
    except json.JSONDecodeError:
        raise RuntimeError("AI returned an invalid response. Please try again.")


async def generate_quiz(topic: str, difficulty: str, num_questions: int) -> list[dict]:
    """Generate multiple-choice quiz questions using Claude."""
    prompt = f"""Generate {num_questions} multiple-choice questions about "{topic}" at {difficulty} difficulty level.

Each question must have exactly 4 options (A, B, C, D) and one correct answer.

Return your response in this exact JSON format:
{{
  "questions": [
    {{
      "question": "the question text",
      "option_a": "option A",
      "option_b": "option B",
      "option_c": "option C",
      "option_d": "option D",
      "correct_answer": "A",
      "explanation": "why this is correct"
    }}
  ]
}}

Return ONLY valid JSON, no markdown formatting."""

    client = get_client()
    try:
        response = await client.messages.create(
            model=get_model(),
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text
        data = _extract_json(raw)
        return data.get("questions", [])
    except (RateLimitError, APIStatusError, APIError) as e:
        raise RuntimeError(f"Claude API error: {str(e)}")
    except json.JSONDecodeError:
        raise RuntimeError("AI returned an invalid response. Please try again.")


async def generate_flashcards(topic: str, num_cards: int) -> list[dict]:
    """Generate flashcards using Claude."""
    prompt = f"""Generate {num_cards} flashcards about "{topic}".

Each flashcard should have a clear question on the front and a concise answer on the back.

Return your response in this exact JSON format:
{{
  "flashcards": [
    {{
      "question": "the question",
      "answer": "the answer"
    }}
  ]
}}

Return ONLY valid JSON, no markdown formatting."""

    client = get_client()
    try:
        response = await client.messages.create(
            model=get_model(),
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text
        data = _extract_json(raw)
        return data.get("flashcards", [])
    except (RateLimitError, APIStatusError, APIError) as e:
        raise RuntimeError(f"Claude API error: {str(e)}")
    except json.JSONDecodeError:
        raise RuntimeError("AI returned an invalid response. Please try again.")