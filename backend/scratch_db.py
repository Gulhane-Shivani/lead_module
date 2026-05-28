from app.database.session import SessionLocal
import app.models.base
from app.models.lead import LeadForm, LeadField

db = SessionLocal()
try:
    forms = db.query(LeadForm).all()
    for f in forms:
        print(f"Form ID: {f.id}, Name: {f.name}")
        for field in f.fields:
            print(f"  Field ID: {field.id}, Label: {field.label}, Type: {field.field_type}, Is Core: {field.is_core}")
finally:
    db.close()
