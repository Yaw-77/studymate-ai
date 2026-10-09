"""StudySession model for tracking study activity."""
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.database import Base, generate_uuid


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_type = Column(String(50), nullable=False)  # tutor, summarizer, quiz, flashcards
    activity_id = Column(String(36), nullable=False)  # ID of the related activity
    title = Column(String(255), default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="study_sessions")

    def __repr__(self):
        return f"<StudySession(activity_type={self.activity_type}, title={self.title})>"