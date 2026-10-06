"""Authentication routes: register, login, me, profile update, password change."""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_db
from app.middleware.auth import get_current_user
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    AuthResponse,
    UserResponse,
    MessageResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
)
from app.services.auth_service import (
    register_user,
    login_user,
    get_user_response,
    update_profile,
    change_password,
)
from app.models.user import User
from app.utils.security import create_access_token
from app.utils.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    body: UserRegister,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user account."""
    try:
        user = await register_user(
            db=db,
            name=body.name,
            email=body.email,
            password=body.password,
            university=body.university,
            program=body.program,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS),
    )

    return AuthResponse(
        access_token=access_token,
        user=UserResponse(**get_user_response(user)),
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    body: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate user and return access token."""
    try:
        user, access_token = await login_user(
            db=db,
            email=body.email,
            password=body.password,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

    return AuthResponse(
        access_token=access_token,
        user=UserResponse(**get_user_response(user)),
    )


@router.get("/me", response_model=UserResponse)
async def me(
    current_user: User = Depends(get_current_user),
):
    """Get the currently authenticated user's profile."""
    return UserResponse(**get_user_response(current_user))


@router.put("/me", response_model=UserResponse)
async def update_me(
    body: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the current user's profile (name, university, program)."""
    try:
        updated = await update_profile(
            db=db,
            user=current_user,
            name=body.name,
            university=body.university,
            program=body.program,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    return UserResponse(**get_user_response(updated))


@router.put("/password", response_model=MessageResponse)
async def update_password(
    body: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change the current user's password."""
    try:
        await change_password(
            db=db,
            user=current_user,
            current_password=body.current_password,
            new_password=body.new_password,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    return MessageResponse(message="Password changed successfully.")


@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Logout endpoint (client-side token removal)."""
    return MessageResponse(message="Successfully logged out.")