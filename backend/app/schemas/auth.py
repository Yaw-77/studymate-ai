"""Pydantic schemas for authentication endpoints."""
from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    """Schema for user registration."""
    name: str
    email: EmailStr
    password: str
    university: str = ""
    program: str = ""

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters.")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters.")
        return v


class UserLogin(BaseModel):
    """Schema for user login."""
    email: str
    password: str


class UserResponse(BaseModel):
    """Schema for user profile response."""
    id: str
    name: str
    email: str
    university: str
    program: str
    created_at: str | None = None


class AuthResponse(BaseModel):
    """Schema for successful authentication response."""
    access_token: str
    token_type: str = "Bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    """Generic success message response."""
    message: str


class UpdateProfileRequest(BaseModel):
    """Request to update user profile."""
    name: str | None = None
    university: str | None = None
    program: str | None = None


class ChangePasswordRequest(BaseModel):
    """Request to change user password."""
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("New password must be at least 6 characters.")
        return v