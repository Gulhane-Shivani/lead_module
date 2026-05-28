from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.lead import LeadForm, LeadField
from app.schemas.form import LeadFormCreate, LeadFormUpdate, LeadFieldCreate, LeadFieldUpdate

def create_form(db: Session, form_in: LeadFormCreate) -> LeadForm:
    db_obj = LeadForm(**form_in.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_forms(db: Session, skip: int = 0, limit: int = 100) -> List[LeadForm]:
    return db.query(LeadForm).offset(skip).limit(limit).all()

def get_form(db: Session, form_id: int) -> Optional[LeadForm]:
    return db.query(LeadForm).filter(LeadForm.id == form_id).first()

def add_field(db: Session, form_id: int, field_in: LeadFieldCreate) -> LeadField:
    db_obj = LeadField(**field_in.dict(), form_id=form_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_field(db: Session, field_id: int, field_in: LeadFieldUpdate) -> Optional[LeadField]:
    db_obj = db.query(LeadField).filter(LeadField.id == field_id).first()
    if not db_obj:
        return None
    update_data = field_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_field(db: Session, field_id: int) -> bool:
    db_obj = db.query(LeadField).filter(LeadField.id == field_id).first()
    if not db_obj:
        return False
    db.delete(db_obj)
    db.commit()
    return True
