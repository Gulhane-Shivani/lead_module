from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.form import LeadForm, LeadFormCreate, LeadFormUpdate, LeadField, LeadFieldCreate, LeadFieldUpdate
from app.services import form_service

router = APIRouter()

@router.post("/", response_model=LeadForm)
def create_form(
    *,
    db: Session = Depends(deps.get_db),
    form_in: LeadFormCreate,
    current_user: User = Depends(deps.get_current_active_admin)
):
    return form_service.create_form(db, form_in=form_in)

@router.get("/", response_model=List[LeadForm])
def read_forms(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    return form_service.get_forms(db, skip=skip, limit=limit)

@router.post("/fields", response_model=LeadField)
def add_field(
    *,
    db: Session = Depends(deps.get_db),
    form_id: int,
    field_in: LeadFieldCreate,
    current_user: User = Depends(deps.get_current_active_admin)
):
    return form_service.add_field(db, form_id=form_id, field_in=field_in)

@router.put("/fields/{field_id}", response_model=LeadField)
def update_field(
    *,
    db: Session = Depends(deps.get_db),
    field_id: int,
    field_in: LeadFieldUpdate,
    current_user: User = Depends(deps.get_current_active_admin)
):
    field = form_service.update_field(db, field_id=field_id, field_in=field_in)
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

@router.delete("/fields/{field_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_field(
    *,
    db: Session = Depends(deps.get_db),
    field_id: int,
    current_user: User = Depends(deps.get_current_active_admin)
):
    if not form_service.delete_field(db, field_id=field_id):
        raise HTTPException(status_code=404, detail="Field not found")
    return None
