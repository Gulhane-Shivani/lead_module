from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base_class import Base
import enum

class LeadStatus(str, enum.Enum):
    NEW = "New"
    CONTACTED = "Contacted"
    INTERESTED = "Interested"
    FOLLOW_UP_PENDING = "Follow-Up Pending"
    ADMISSION_CONFIRMED = "Admission Confirmed"
    REJECTED = "Rejected"

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String, index=True)
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW)
    counselor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    form_id = Column(Integer, ForeignKey("lead_forms.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    counselor = relationship("User", back_populates="assigned_leads")
    form = relationship("LeadForm", back_populates="leads")
    field_values = relationship("LeadFieldValue", back_populates="lead", cascade="all, delete-orphan")
    followups = relationship("FollowUp", back_populates="lead", cascade="all, delete-orphan")

class LeadForm(Base):
    __tablename__ = "lead_forms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    fields = relationship("LeadField", back_populates="form", order_by="LeadField.order", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="form")

class FieldType(str, enum.Enum):
    TEXT = "text"
    EMAIL = "email"
    NUMBER = "number"
    DROPDOWN = "dropdown"
    CHECKBOX = "checkbox"
    RADIO = "radio"
    DATE = "date"
    TEXTAREA = "textarea"
    FILE = "file"

class LeadField(Base):
    __tablename__ = "lead_fields"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("lead_forms.id"))
    label = Column(String)
    field_type = Column(Enum(FieldType))
    required = Column(Boolean, default=False)
    options = Column(JSON, nullable=True)  # For dropdown, radio, checkbox
    order = Column(Integer, default=0)

    # Relationships
    form = relationship("LeadForm", back_populates="fields")

class LeadFieldValue(Base):
    __tablename__ = "lead_field_values"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    field_id = Column(Integer, ForeignKey("lead_fields.id"))
    value = Column(String)  # We'll store all dynamic values as strings or serialized JSON

    # Relationships
    lead = relationship("Lead", back_populates="field_values")
    field = relationship("LeadField")
