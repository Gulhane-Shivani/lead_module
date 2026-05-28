from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.lead import Lead, LeadFieldValue
from app.schemas.lead import LeadCreate, LeadUpdate

def create_lead(db: Session, lead_in: LeadCreate) -> Lead:
    lead_data = lead_in.dict(exclude={"dynamic_fields"})
    db_obj = Lead(**lead_data)
    db.add(db_obj)
    db.flush()  # To get db_obj.id

    for field_value in lead_in.dynamic_fields:
        fv_obj = LeadFieldValue(
            lead_id=db_obj.id,
            field_id=field_value.field_id,
            value=field_value.value
        )
        db.add(fv_obj)
    
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_leads(db: Session, skip: int = 0, limit: int = 100, counselor_id: Optional[int] = None) -> List[Lead]:
    query = db.query(Lead)
    if counselor_id:
        query = query.filter(Lead.counselor_id == counselor_id)
    return query.offset(skip).limit(limit).all()

def get_lead(db: Session, lead_id: int) -> Optional[Lead]:
    return db.query(Lead).filter(Lead.id == lead_id).first()

def update_lead(db: Session, lead_id: int, lead_in: LeadUpdate) -> Optional[Lead]:
    db_obj = db.query(Lead).filter(Lead.id == lead_id).first()
    if not db_obj:
        return None
    
    update_data = lead_in.dict(exclude_unset=True, exclude={"dynamic_fields"})
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    if lead_in.dynamic_fields is not None:
        # Simple implementation: delete old values and add new ones
        db.query(LeadFieldValue).filter(LeadFieldValue.lead_id == lead_id).delete()
        for field_value in lead_in.dynamic_fields:
            fv_obj = LeadFieldValue(
                lead_id=lead_id,
                field_id=field_value.field_id,
                value=field_value.value
            )
            db.add(fv_obj)

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_lead(db: Session, lead_id: int) -> bool:
    db_obj = db.query(Lead).filter(Lead.id == lead_id).first()
    if not db_obj:
        return False
    db.delete(db_obj)
    db.commit()
    return True

def assign_counselor(db: Session, lead_id: int, counselor_id: int) -> Optional[Lead]:
    db_obj = db.query(Lead).filter(Lead.id == lead_id).first()
    if not db_obj:
        return None
    db_obj.counselor_id = counselor_id
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
