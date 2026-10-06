"""AI Tutor routes: chat, conversations, history."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.database.database import get_db
from app.middleware.auth import get_current_user_id
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.schemas.tutor import (
    ChatRequest,
    ChatResponse,
    ConversationResponse,
    ConversationDetailResponse,
    MessageSchema,
)
from app.services import claude_service
from app.database.database import generate_uuid

router = APIRouter(prefix="/api/tutor", tags=["AI Tutor"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Send a message to the AI tutor and get a response."""
    conversation_id = body.conversation_id

    # Load or create conversation
    conversation = None
    if conversation_id:
        conversation = await db.get(Conversation, conversation_id)
        if conversation is None or conversation.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found.",
            )

    if conversation is None:
        conversation = Conversation(
            id=generate_uuid(),
            user_id=user_id,
            title=body.message[:50] + ("..." if len(body.message) > 50 else ""),
        )
        db.add(conversation)
        await db.flush()

    # Build message history for Claude BEFORE adding the new user message
    history = []
    if body.history:
        for h in body.history:
            history.append({"role": h.get("role", "user"), "content": h.get("content", "")})
    else:
        # Load from DB if no history provided
        result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.created_at)
        )
        db_messages = result.scalars().all()
        for m in db_messages:
            history.append({"role": m.role, "content": m.content})

    # Save user message
    user_msg = Message(
        id=generate_uuid(),
        conversation_id=conversation.id,
        role="user",
        content=body.message,
    )
    db.add(user_msg)
    await db.flush()

    # Add current user message to history for AI
    history.append({"role": "user", "content": body.message})

    # Get AI response
    try:
        ai_response = await claude_service.tutor_chat(body.message, history)
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(e),
        )

    # Save AI message
    ai_msg = Message(
        id=generate_uuid(),
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response,
    )
    db.add(ai_msg)

    # Update conversation timestamp
    conversation.updated_at = datetime.now(timezone.utc)

    await db.commit()

    return ChatResponse(
        response=ai_response,
        conversation_id=conversation.id,
    )


@router.get("/conversations", response_model=list[ConversationResponse])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """List all conversations for the current user."""
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    )
    conversations = result.scalars().all()
    return [
        ConversationResponse(
            id=c.id,
            title=c.title,
            created_at=c.created_at.isoformat() if c.created_at else "",
            updated_at=c.updated_at.isoformat() if c.updated_at else "",
        )
        for c in conversations
    ]


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Get a conversation with all its messages."""
    conversation = await db.get(Conversation, conversation_id)
    if conversation is None or conversation.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    )
    messages = result.scalars().all()

    return ConversationDetailResponse(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at.isoformat() if conversation.created_at else "",
        updated_at=conversation.updated_at.isoformat() if conversation.updated_at else "",
        messages=[
            MessageSchema(
                id=m.id,
                role=m.role,
                content=m.content,
                created_at=m.created_at.isoformat() if m.created_at else "",
            )
            for m in messages
        ],
    )


@router.delete("/conversations/{conversation_id}", response_model=dict)
async def delete_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    """Delete a conversation and all its messages."""
    conversation = await db.get(Conversation, conversation_id)
    if conversation is None or conversation.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    await db.delete(conversation)
    await db.commit()
    return {"message": "Conversation deleted successfully."}