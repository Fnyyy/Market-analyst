from fastapi import FastAPI, HTTPException, Depends, Header
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from ml_pipeline import process_pipeline, get_recommendations_by_level
import models, schemas, crud
from database import SessionLocal, engine, get_db
import uvicorn

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="IDX Stock ML API - Premium")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# STARTUP: Seed default admin account
# ─────────────────────────────────────────────

@app.on_event("startup")
def seed_admin():
    db = SessionLocal()
    try:
        existing = crud.get_user_by_username(db, "admin")
        if not existing:
            admin = models.User(
                username="admin",
                password_hash=crud.hash_password("admin123"),
                full_name="System Administrator",
                security_question="What is the admin secret word?",
                security_answer=crud.hash_password("sisvest"),
                is_admin=True,
                is_active=True,
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()

# ─────────────────────────────────────────────
# DEPENDENCY HELPERS
# ─────────────────────────────────────────────

def get_current_user(db: Session = Depends(get_db), x_user_username: str = Header(None)):
    if not x_user_username:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = crud.get_user_by_username(db, x_user_username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found. Please log in again.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive. Contact admin.")
    return user

def get_admin_user(db: Session = Depends(get_db), x_user_username: str = Header(None)):
    if not x_user_username:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = crud.get_user_by_username(db, x_user_username)
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ─────────────────────────────────────────────
# ML ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "IDX Stock ML API is running. Use /api/analyze/{ticker} to get insights."}

@app.get("/api/analyze/{ticker}")
def analyze_stock(ticker: str):
    try:
        results = process_pipeline(ticker)
        if "error" in results:
            raise HTTPException(status_code=404, detail=results["error"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recommendations")
def get_recommendations():
    try:
        return get_recommendations_by_level()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─────────────────────────────────────────────
# AUTH ENDPOINTS
# ─────────────────────────────────────────────

@app.post("/api/auth/register", response_model=schemas.LoginResponse)
def register(reg: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = crud.get_user_by_username(db, reg.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    # Check duplicate email
    if reg.email:
        existing_email = db.query(models.User).filter(models.User.email == reg.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")
    try:
        user = crud.create_user_with_password(db, reg)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return schemas.LoginResponse(
        message="Account created successfully",
        user_id=user.id,
        username=user.username,
        is_admin=user.is_admin,
        is_active=user.is_active,
    )

@app.post("/api/auth/login", response_model=schemas.LoginResponse)
def login(creds: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, creds.username, creds.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials or account inactive")
    return schemas.LoginResponse(
        message="Login successful",
        user_id=user.id,
        username=user.username,
        is_admin=user.is_admin,
        is_active=user.is_active,
    )

@app.post("/api/auth/forgot-password/question")
def get_security_question(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    question = crud.get_security_question(db, req.username)
    if not question:
        raise HTTPException(status_code=404, detail="User not found or no security question set")
    return {"security_question": question}

@app.post("/api/auth/forgot-password/verify")
def verify_security_answer(req: schemas.ForgotPasswordVerify, db: Session = Depends(get_db)):
    ok = crud.verify_security_answer(db, req.username, req.security_answer)
    if not ok:
        raise HTTPException(status_code=400, detail="Security answer is incorrect")
    return {"message": "Verified", "can_reset": True}

@app.post("/api/auth/forgot-password/reset")
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    ok = crud.verify_security_answer(db, req.username, req.security_answer)
    if not ok:
        raise HTTPException(status_code=400, detail="Security answer is incorrect")
    user = crud.reset_password(db, req.username, req.new_password)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password reset successfully"}

# ─────────────────────────────────────────────
# ADMIN ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/api/admin/users", response_model=List[schemas.AdminUserView])
def admin_get_users(db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    return crud.get_all_users(db)

@app.put("/api/admin/users/{user_id}/toggle", response_model=schemas.AdminUserView)
def admin_toggle_user(user_id: int, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    user = crud.toggle_user_active(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/admin/users/{user_id}/reset-password")
def admin_reset_pw(user_id: int, body: schemas.AdminResetPassword, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    user = crud.admin_reset_password(db, user_id, body.new_password)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"Password for {user.username} has been reset"}

@app.delete("/api/admin/users/{user_id}")
def admin_delete_user(user_id: int, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {user.username} deleted"}

# ─────────────────────────────────────────────
# USER CRUD ENDPOINTS (/api/v1/)
# ─────────────────────────────────────────────

@app.get("/api/v1/user/profile", response_model=schemas.User)
def get_user_profile(user: models.User = Depends(get_current_user)):
    return user

@app.put("/api/v1/user/profile", response_model=schemas.User)
def update_user_profile(profile: schemas.UserProfileUpdate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.update_user_profile(db, user.id, profile)

# Watchlist
@app.get("/api/v1/watchlists", response_model=List[schemas.Watchlist])
def read_watchlists(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.get_watchlists(db, user.id)

@app.post("/api/v1/watchlists", response_model=schemas.Watchlist)
def create_watchlist(watchlist: schemas.WatchlistCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.create_watchlist(db, watchlist, user.id)

@app.delete("/api/v1/watchlists/{watchlist_id}")
def delete_watchlist(watchlist_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    item = crud.delete_watchlist(db, watchlist_id, user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist item not found")
    return {"message": "Deleted successfully"}

# Trades
@app.get("/api/v1/trades", response_model=List[schemas.Trade])
def read_trades(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.get_trades(db, user.id)

@app.post("/api/v1/trades", response_model=schemas.Trade)
def create_trade(trade: schemas.TradeCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.create_trade(db, trade, user.id)

@app.delete("/api/v1/trades/{trade_id}")
def delete_trade(trade_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    item = crud.delete_trade(db, trade_id, user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Trade not found")
    return {"message": "Deleted successfully"}

# Alerts
@app.get("/api/v1/alerts", response_model=List[schemas.Alert])
def read_alerts(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.get_alerts(db, user.id)

@app.post("/api/v1/alerts", response_model=schemas.Alert)
def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.create_alert(db, alert, user.id)

@app.put("/api/v1/alerts/{alert_id}")
def update_alert(alert_id: int, status: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    item = crud.update_alert(db, alert_id, status, user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Alert not found")
    return item

@app.delete("/api/v1/alerts/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    item = crud.delete_alert(db, alert_id, user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Deleted successfully"}

# Notes
@app.get("/api/v1/notes", response_model=List[schemas.Note])
def read_notes(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.get_notes(db, user.id)

@app.post("/api/v1/notes", response_model=schemas.Note)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return crud.create_note(db, note, user.id)

@app.put("/api/v1/notes/{note_id}")
def update_note(note_id: int, note: schemas.NoteBase, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    item = crud.update_note(db, note_id, note.content, user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Note not found")
    return item

@app.delete("/api/v1/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    item = crud.delete_note(db, note_id, user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Deleted successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
