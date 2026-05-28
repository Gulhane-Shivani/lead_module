from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from app.models.lead import FieldType

class LeadFieldBase(BaseModel):
    label: str
    field_type: FieldType
    required: bool = False
    placeholder: Optional[str] = None
    section: Optional[str] = "General Details"
    validation: Optional[Dict[str, Any]] = None
    is_core: Optional[bool] = False
    options: Optional[List[str]] = None
    order: int = 0

class LeadFieldCreate(LeadFieldBase):
    pass

class LeadFieldUpdate(BaseModel):
    label: Optional[str] = None
    field_type: Optional[FieldType] = None
    required: Optional[bool] = None
    placeholder: Optional[str] = None
    section: Optional[str] = None
    validation: Optional[Dict[str, Any]] = None
    is_core: Optional[bool] = None
    options: Optional[List[str]] = None
    order: Optional[int] = None

class LeadField(LeadFieldBase):
    id: int
    form_id: int

    class Config:
        from_attributes = True

class LeadFormBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True

class LeadFormCreate(LeadFormBase):
    pass

class LeadFormUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class LeadForm(LeadFormBase):
    id: int
    fields: List[LeadField] = []

    class Config:
        from_attributes = True
