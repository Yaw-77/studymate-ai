"""Authentication service: registration, login, and token management."""
from datetime import timedelta
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_uuid,
)
from app.utils.config import settings


async def register_user(
    db: AsyncSession,
    name: str,
    email: str,
    password: str,
    university: str = "",
    program: str = "",
) -> User:
    """Register a new user. Raises ValueError if email already exists."""
    # Check for existing user
    result = await db.execute(select(User).where(User.email == email))
    existing = result.scalar_one_or_none()
    if existing:
        raise ValueError("An account with this email already exists.")

    # Validate inputs
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters.")
    if len(name.strip()) < 2:
        raise ValueError("Name must be at least 2 characters.")
    if "@" not in email or "." not in email:
        raise ValueError("Please provide a valid email address.")

    user = User(
        id=generate_uuid(),
        name=name.strip(),
        email=email.lower().strip(),
        password_hash=hash_password(password),
        university=university.strip(),
        program=program.strip(),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def login_user(
    db: AsyncSession,
    email: str,
    password: str,
) -> tuple[User, str]:
    """Authenticate user and return (user, access_token)."""
    result = await db.execute(select(User).where(User.email == email.lower().strip()))
    user = result.scalar_one_or_none()
    if user is None:
        raise ValueError("Invalid email or password.")
    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password.")

    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS),
    )
    return user, access_token


def get_user_response(user: User) -> dict:
    """Convert a User model to a safe response dict."""
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "university": user.university,
        "program": user.program,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


async def update_profile(
    db: AsyncSession,
    user: User,
    name: str | None = None,
    university: str | None = None,
    program: str | None = None,
) -> User:
    """Update the current user's profile. Returns the updated user."""
    if name is not None:
        if len(name.strip()) < 2:
            raise ValueError("Name must be at least 2 characters.")
        user.name = name.strip()
    if university is not None:
        user.university = university.strip()
    if program is not None:
        user.program = program.strip()
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def change_password(
    db: AsyncSession,
    user: User,
    current_password: str,
    new_password: str,
) -> None:
    """Change the current user's password after verifying the current one."""
    if not verify_password(current_password, user.password_hash):
        raise ValueError("Current password is incorrect.")
    if len(new_password) < 6:
        raise ValueError("New password must be at least 6 characters.")
    user.password_hash = hash_password(new_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return None