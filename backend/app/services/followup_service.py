from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.followup import FollowUp
from app.schemas.followup import FollowUpCreate, FollowUpUpdate

def create_followup(db: Session, followup_in: FollowUpCreate, counselor_id: int) -> FollowUp:
    db_obj = FollowUp(**followup_in.dict(), counselor_id=counselor_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_followups(db: Session, lead_id: Optional[int] = None, counselor_id: Optional[int] = None) -> List[FollowUp]:
    query = db.query(FollowUp)
    if lead_id:
        query = query.filter(FollowUp.lead_id == lead_id)
    if counselor_id:
        query = query.filter(FollowUp.counselor_id == counselor_id)
    return query.all()

def update_followup(db: Session, followup_id: int, followup_in: FollowUpUpdate) -> Optional[FollowUp]:
    db_obj = db.query(FollowUp).filter(FollowUp.id == followup_id).first()
    if not db_obj:
        return None
    update_data = followup_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
