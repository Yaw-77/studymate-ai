"""Application configuration loaded from environment variables."""
import os
import secrets
import warnings
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable loading."""

    # Database
    DATABASE_URL: str = "postgresql://studymate:studymate123@localhost:5432/studymate"

    # Anthropic Claude API
    ANTHROPIC_API_KEY: str = ""

    # JWT Authentication
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    # Application
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"
    DEBUG: bool = False

    # Claude Model
    CLAUDE_MODEL: str = "claude-3-5-sonnet-20241022"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Generate a secure default SECRET_KEY for development only
        if not self.SECRET_KEY:
            if self.DEBUG:
                self.SECRET_KEY = secrets.token_urlsafe(32)
                warnings.warn(
                    "SECRET_KEY not set in environment. Using a randomly generated key for development. "
                    "This will invalidate all tokens on restart. Set SECRET_KEY in .env for production.",
                    UserWarning,
                    stacklevel=2,
                )
            else:
                raise ValueError(
                    "SECRET_KEY must be set in environment variables for production. "
                    "Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
                )


settings = Settings()