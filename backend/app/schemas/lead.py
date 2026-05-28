from typing import List, Optional, Dict
from pydantic import BaseModel, field_validator
from datetime import datetime
from app.models.lead import LeadStatus
from app.schemas.form import LeadField

class LeadFieldValueBase(BaseModel):
    field_id: int
    value: str

class LeadFieldValueCreate(LeadFieldValueBase):
    pass

class LeadFieldValue(LeadFieldValueBase):
    id: int
    lead_id: int
    field: Optional[LeadField] = None

    class Config:
        from_attributes = True

class LeadBase(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    status: LeadStatus = LeadStatus.NEW
    counselor_id: Optional[int] = None
    form_id: int

    @field_validator('status', mode='before')
    @classmethod
    def coerce_status(cls, v):
        if not v:
            return LeadStatus.NEW
        if isinstance(v, LeadStatus):
            return v
        try:
            return LeadStatus(v)
        except ValueError:
            for status in LeadStatus:
                if status.value.lower() == str(v).lower():
                    return status
            return LeadStatus.NEW

class LeadCreate(LeadBase):
    dynamic_fields: List[LeadFieldValueCreate] = []

class LeadUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[LeadStatus] = None
    counselor_id: Optional[int] = None
    dynamic_fields: Optional[List[LeadFieldValueCreate]] = None

    @field_validator('status', mode='before')
    @classmethod
    def coerce_status(cls, v):
        if not v:
            return None
        if isinstance(v, LeadStatus):
            return v
        try:
            return LeadStatus(v)
        except ValueError:
            for status in LeadStatus:
                if status.value.lower() == str(v).lower():
                    return status
            return None

from app.schemas.user import User

class Lead(LeadBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    field_values: List[LeadFieldValue] = []
    counselor: Optional[User] = None

    class Config:
        from_attributes = True
