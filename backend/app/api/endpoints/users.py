from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[UserOut])
def list_users(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Return all users — used by the frontend to populate counselor dropdowns."""
    return db.query(User).filter(User.is_active == True).all()
