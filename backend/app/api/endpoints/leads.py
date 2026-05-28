from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User, UserRole
from app.schemas.lead import Lead, LeadCreate, LeadUpdate
from app.services import lead_service

router = APIRouter()

@router.post("/", response_model=Lead)
def create_lead(
    *,
    db: Session = Depends(deps.get_db),
    lead_in: LeadCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    # If counselor is creating, automatically assign to them
    if current_user.role == UserRole.COUNSELOR:
        lead_in.counselor_id = current_user.id
    return lead_service.create_lead(db, lead_in=lead_in)

@router.get("/", response_model=List[Lead])
def read_leads(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    if current_user.role == UserRole.ADMIN:
        return lead_service.get_leads(db, skip=skip, limit=limit)
    return lead_service.get_leads(db, skip=skip, limit=limit, counselor_id=current_user.id)

@router.get("/{lead_id}", response_model=Lead)
def read_lead(
    *,
    db: Session = Depends(deps.get_db),
    lead_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    lead = lead_service.get_lead(db, lead_id=lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    if current_user.role == UserRole.COUNSELOR and lead.counselor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return lead

@router.put("/{lead_id}", response_model=Lead)
def update_lead(
    *,
    db: Session = Depends(deps.get_db),
    lead_id: int,
    lead_in: LeadUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    lead = lead_service.get_lead(db, lead_id=lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    if current_user.role == UserRole.COUNSELOR and lead.counselor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return lead_service.update_lead(db, lead_id=lead_id, lead_in=lead_in)

@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(
    *,
    db: Session = Depends(deps.get_db),
    lead_id: int,
    current_user: User = Depends(deps.get_current_active_admin)
):
    if not lead_service.delete_lead(db, lead_id=lead_id):
        raise HTTPException(status_code=404, detail="Lead not found")
    return None

@router.post("/{lead_id}/assign/{counselor_id}", response_model=Lead)
def assign_counselor(
    *,
    db: Session = Depends(deps.get_db),
    lead_id: int,
    counselor_id: int,
    current_user: User = Depends(deps.get_current_active_admin)
):
    lead = lead_service.assign_counselor(db, lead_id=lead_id, counselor_id=counselor_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead
