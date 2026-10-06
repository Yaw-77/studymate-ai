"""FlashcardSet and Flashcard models for Flashcard Generator."""
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.database import Base, generate_uuid


class FlashcardSet(Base):
    __tablename__ = "flashcard_sets"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    topic = Column(String(255), default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="flashcard_sets")
    flashcards = relationship("Flashcard", back_populates="set", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<FlashcardSet(id={self.id}, title={self.title})>"


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(String, primary_key=True, default=generate_uuid)
    set_id = Column(String, ForeignKey("flashcard_sets.id", ondelete="CASCADE"), nullable=False, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)

    # Relationships
    set = relationship("FlashcardSet", back_populates="flashcards")

    def __repr__(self):
        return f"<Flashcard(question={self.question[:50]}...)>"