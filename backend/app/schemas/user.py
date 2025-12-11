from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from typing import Literal

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: Literal["assentamento", "juridico"]
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("A senha deve ter pelo menos 8 caracteres.")
        return v

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    role: str

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
