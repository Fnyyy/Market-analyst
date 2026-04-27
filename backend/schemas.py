from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Notes ---
class NoteBase(BaseModel):
    ticker: str
    content: str

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    user_id: int
    updated_at: datetime
    class Config:
        from_attributes = True

# --- Alerts ---
class AlertBase(BaseModel):
    ticker: str
    target_price: float
    status: Optional[str] = "Active"

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# --- Trades ---
class TradeBase(BaseModel):
    ticker: str
    buy_price: float
    quantity: int

class TradeCreate(TradeBase):
    pass

class Trade(TradeBase):
    id: int
    user_id: int
    date: datetime
    class Config:
        from_attributes = True

# --- Watchlists ---
class WatchlistBase(BaseModel):
    ticker: str

class WatchlistCreate(WatchlistBase):
    pass

class Watchlist(WatchlistBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# --- Users ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class UserProfileUpdate(BaseModel):
    risk_profile: str

class User(UserBase):
    id: int
    risk_profile: str
    is_admin: Optional[bool] = False
    is_active: Optional[bool] = True
    watchlists: List[Watchlist] = []
    trades: List[Trade] = []
    alerts: List[Alert] = []
    notes: List[Note] = []
    class Config:
        from_attributes = True

# --- Auth Schemas ---
class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    security_question: str
    security_answer: str

class LoginResponse(BaseModel):
    message: str
    user_id: int
    username: str
    is_admin: bool
    is_active: bool
    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    username: str

class ForgotPasswordVerify(BaseModel):
    username: str
    security_answer: str

class ResetPasswordRequest(BaseModel):
    username: str
    security_answer: str
    new_password: str

# --- Admin Schemas ---
class AdminUserView(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    risk_profile: str
    is_admin: bool
    is_active: bool
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    class Config:
        from_attributes = True

class AdminResetPassword(BaseModel):
    new_password: str
