from sqlalchemy.orm import Session
from sqlalchemy.sql import func
import hashlib
import models, schemas

# --- Password Hashing ---
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain: str, hashed: str) -> bool:
    return hash_password(plain) == hashed

# --- User CRUD ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_with_password(db: Session, reg: schemas.UserRegister):
    db_user = models.User(
        username=reg.username,
        password_hash=hash_password(reg.password),
        email=reg.email if reg.email else None,
        full_name=reg.full_name if reg.full_name else None,
        security_question=reg.security_question,
        security_answer=hash_password(reg.security_answer.lower().strip()),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not user.password_hash or not verify_password(password, user.password_hash):
        return None
    if not user.is_active:
        return None
    # Update last_login
    user.last_login = func.now()
    db.commit()
    db.refresh(user)
    return user

# --- Admin CRUD ---
def get_all_users(db: Session):
    return db.query(models.User).order_by(models.User.id).all()

def toggle_user_active(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.is_active = not user.is_active
        db.commit()
        db.refresh(user)
    return user

def admin_reset_password(db: Session, user_id: int, new_password: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.password_hash = hash_password(new_password)
        db.commit()
        db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user

# --- Forgot Password ---
def get_security_question(db: Session, username: str):
    user = get_user_by_username(db, username)
    if user and user.security_question:
        return user.security_question
    return None

def verify_security_answer(db: Session, username: str, answer: str):
    user = get_user_by_username(db, username)
    if not user or not user.security_answer:
        return False
    return verify_password(answer.lower().strip(), user.security_answer)

def reset_password(db: Session, username: str, new_password: str):
    user = get_user_by_username(db, username)
    if user:
        user.password_hash = hash_password(new_password)
        db.commit()
        db.refresh(user)
    return user

# --- Existing CRUD (unchanged) ---
def update_user_profile(db: Session, user_id: int, profile: schemas.UserProfileUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.risk_profile = profile.risk_profile
        db.commit()
        db.refresh(db_user)
    return db_user

def get_watchlists(db: Session, user_id: int):
    return db.query(models.Watchlist).filter(models.Watchlist.user_id == user_id).all()

def create_watchlist(db: Session, watchlist: schemas.WatchlistCreate, user_id: int):
    db_watchlist = models.Watchlist(**watchlist.model_dump(), user_id=user_id)
    db.add(db_watchlist)
    db.commit()
    db.refresh(db_watchlist)
    return db_watchlist

def delete_watchlist(db: Session, watchlist_id: int, user_id: int):
    db_item = db.query(models.Watchlist).filter(models.Watchlist.id == watchlist_id, models.Watchlist.user_id == user_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

def get_trades(db: Session, user_id: int):
    return db.query(models.Trade).filter(models.Trade.user_id == user_id).all()

def create_trade(db: Session, trade: schemas.TradeCreate, user_id: int):
    db_trade = models.Trade(**trade.model_dump(), user_id=user_id)
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

def delete_trade(db: Session, trade_id: int, user_id: int):
    db_item = db.query(models.Trade).filter(models.Trade.id == trade_id, models.Trade.user_id == user_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

def get_alerts(db: Session, user_id: int):
    return db.query(models.Alert).filter(models.Alert.user_id == user_id).all()

def create_alert(db: Session, alert: schemas.AlertCreate, user_id: int):
    db_alert = models.Alert(**alert.model_dump(), user_id=user_id)
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def update_alert(db: Session, alert_id: int, status: str, user_id: int):
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id, models.Alert.user_id == user_id).first()
    if db_alert:
        db_alert.status = status
        db.commit()
        db.refresh(db_alert)
    return db_alert

def delete_alert(db: Session, alert_id: int, user_id: int):
    db_item = db.query(models.Alert).filter(models.Alert.id == alert_id, models.Alert.user_id == user_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

def get_notes(db: Session, user_id: int):
    return db.query(models.Note).filter(models.Note.user_id == user_id).all()

def create_note(db: Session, note: schemas.NoteCreate, user_id: int):
    db_note = models.Note(**note.model_dump(), user_id=user_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def update_note(db: Session, note_id: int, content: str, user_id: int):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if db_note:
        db_note.content = content
        db.commit()
        db.refresh(db_note)
    return db_note

def delete_note(db: Session, note_id: int, user_id: int):
    db_item = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item
