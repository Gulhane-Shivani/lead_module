from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.lead import LeadForm, LeadField, LeadFieldValue
from app.schemas.form import LeadFormCreate, LeadFormUpdate, LeadFieldCreate, LeadFieldUpdate, FormFieldsSync

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

def sync_fields(db: Session, form_id: int, sync_data: FormFieldsSync) -> List[LeadField]:
    # 1. Get existing fields in database for this form
    existing_fields = db.query(LeadField).filter(LeadField.form_id == form_id).all()
    existing_fields_map = {f.id: f for f in existing_fields}
    
    # Keep track of which fields we process so we know which ones to delete
    synced_field_ids = set()
    
    # 2. Iterate through incoming fields and update or create them
    synced_fields = []
    for item in sync_data.fields:
        # Check if item.id is an integer (or string representation of integer)
        db_id = None
        if item.id is not None:
            try:
                db_id = int(item.id)
            except ValueError:
                # It's a string like "custom_..." or "f_name"
                db_id = None
                
        # If it's an existing field in the database
        if db_id is not None and db_id in existing_fields_map:
            db_field = existing_fields_map[db_id]
            # Update values
            db_field.label = item.label
            db_field.field_type = item.field_type
            db_field.required = item.required
            db_field.placeholder = item.placeholder
            db_field.section = item.section
            db_field.validation = item.validation
            db_field.options = item.options
            db_field.order = item.order
            
            db.add(db_field)
            synced_fields.append(db_field)
            synced_field_ids.add(db_field.id)
        else:
            # Check if there is an existing field with the same label/type and is_core
            # (In case the frontend sends a core field with string ID like "f_name" which corresponds to an existing core field in the database)
            existing_core = None
            if item.is_core or (item.id and str(item.id).startswith('f_')):
                # Try to find a core field in existing_fields with similar label or type
                for f in existing_fields:
                    if f.is_core and (f.label.lower() == item.label.lower() or f.field_type == item.field_type):
                        existing_core = f
                        break
            
            if existing_core:
                existing_core.label = item.label
                existing_core.required = item.required
                existing_core.placeholder = item.placeholder
                existing_core.section = item.section
                existing_core.validation = item.validation
                existing_core.options = item.options
                existing_core.order = item.order
                
                db.add(existing_core)
                synced_fields.append(existing_core)
                synced_field_ids.add(existing_core.id)
            else:
                # Create a NEW field
                new_field = LeadField(
                    form_id=form_id,
                    label=item.label,
                    field_type=item.field_type,
                    required=item.required,
                    placeholder=item.placeholder,
                    section=item.section,
                    validation=item.validation,
                    is_core=False, # Custom fields are never core
                    options=item.options,
                    order=item.order
                )
                db.add(new_field)
                db.flush() # get new_field.id
                synced_fields.append(new_field)
                synced_field_ids.add(new_field.id)
                
    # 3. Delete fields that were not synced, but DO NOT delete core fields
    for field in existing_fields:
        if field.id not in synced_field_ids and not field.is_core:
            # First delete all LeadFieldValues associated with this field
            db.query(LeadFieldValue).filter(LeadFieldValue.field_id == field.id).delete()
            db.delete(field)
            
    db.commit()
    
    # Reload and return the full list of fields in correct order
    return db.query(LeadField).filter(LeadField.form_id == form_id).order_by(LeadField.order).all()
