from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class FollowUpBase(BaseModel):
    lead_id: int
    note: str
    scheduled_at: datetime
    completed: bool = False

class FollowUpCreate(FollowUpBase):
    pass

class FollowUpUpdate(BaseModel):
    note: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    completed: Optional[bool] = None

class FollowUp(FollowUpBase):
    id: int
    counselor_id: int
    created_at: datetime

    class Config:
        from_attributes = True
