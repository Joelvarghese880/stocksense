from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "staff"  # default role is staff

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenOut(BaseModel):
    access_token: str
    token_type: str
    user: UserOut