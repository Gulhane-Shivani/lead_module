from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models.lead import LeadStatus

class LeadFieldValueBase(BaseModel):
    field_id: int
    value: str

class LeadFieldValueCreate(LeadFieldValueBase):
    pass

class LeadFieldValue(LeadFieldValueBase):
    id: int
    lead_id: int

    class Config:
        from_attributes = True

class LeadBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    status: LeadStatus = LeadStatus.NEW
    counselor_id: Optional[int] = None
    form_id: int

class LeadCreate(LeadBase):
    dynamic_fields: List[LeadFieldValueCreate] = []

class LeadUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    status: Optional[LeadStatus] = None
    counselor_id: Optional[int] = None
    dynamic_fields: Optional[List[LeadFieldValueCreate]] = None

class Lead(LeadBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    field_values: List[LeadFieldValue] = []

    class Config:
        from_attributes = True
