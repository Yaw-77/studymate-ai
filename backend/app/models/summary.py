"""Summary model for Note Summarizer."""
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.database import Base, generate_uuid


class Summary(Base):
    __tablename__ = "summaries"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    source_text = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    style = Column(String(20), default="standard")  # short, standard, detailed
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="summaries")

    def __repr__(self):
        return f"<Summary(id={self.id}, title={self.title})>"