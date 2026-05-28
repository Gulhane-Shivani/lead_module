from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.followup import FollowUp, FollowUpCreate, FollowUpUpdate
from app.services import followup_service

router = APIRouter()

@router.post("/", response_model=FollowUp)
def create_followup(
    *,
    db: Session = Depends(deps.get_db),
    followup_in: FollowUpCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    return followup_service.create_followup(db, followup_in=followup_in, counselor_id=current_user.id)

@router.get("/", response_model=List[FollowUp])
def read_followups(
    db: Session = Depends(deps.get_db),
    lead_id: int = None,
    current_user: User = Depends(deps.get_current_active_user)
):
    if current_user.role == "admin":
        return followup_service.get_followups(db, lead_id=lead_id)
    return followup_service.get_followups(db, lead_id=lead_id, counselor_id=current_user.id)

@router.put("/{followup_id}", response_model=FollowUp)
def update_followup(
    *,
    db: Session = Depends(deps.get_db),
    followup_id: int,
    followup_in: FollowUpUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    return followup_service.update_followup(db, followup_id=followup_id, followup_in=followup_in)
