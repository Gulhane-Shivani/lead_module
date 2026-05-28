from sqlalchemy.orm import Session
from app.database.session import SessionLocal
import app.models.base
from app.models.user import User, UserRole
from app.models.lead import Lead, LeadForm, LeadField, FieldType, LeadStatus, LeadFieldValue
from app.core.security import get_password_hash
from datetime import datetime

def seed_data():
    db = SessionLocal()
    try:
        # Create Admin
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            admin = User(
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                full_name="System Admin",
                role=UserRole.ADMIN
            )
            db.add(admin)

        # Create Counselors
        counselors_data = [
            {"email": "elena@example.com", "full_name": "Elena Rostova"},
            {"email": "sarah@example.com", "full_name": "Sarah Connor"},
            {"email": "david@example.com", "full_name": "David Miller"},
            {"email": "michael@example.com", "full_name": "Michael Chang"},
        ]

        counselor_map = {}
        for c_data in counselors_data:
            counselor = db.query(User).filter(User.email == c_data["email"]).first()
            if not counselor:
                counselor = User(
                    email=c_data["email"],
                    hashed_password=get_password_hash("password123"),
                    full_name=c_data["full_name"],
                    role=UserRole.COUNSELOR
                )
                db.add(counselor)
                db.flush()
            counselor_map[c_data["full_name"]] = counselor

        db.commit()

        # Create a default Form
        form = db.query(LeadForm).filter(LeadForm.name == "Student Admission Form").first()
        if not form:
            form = LeadForm(
                name="Student Admission Form",
                description="General admission form for new students"
            )
            db.add(form)
            db.flush()

            fields = [
                {"label": "Course of Interest", "field_type": FieldType.TEXT, "required": True, "order": 1},
                {"label": "Source", "field_type": FieldType.TEXT, "required": False, "order": 2},
            ]

            field_map = {}
            for f_data in fields:
                field = LeadField(form_id=form.id, **f_data)
                db.add(field)
                db.flush()
                field_map[f_data["label"]] = field
        else:
            # Map existing fields
            field_map = {field.label: field for field in form.fields}

        db.commit()

        # Seed Leads
        leads_to_seed = [
            {
                "full_name": "Aarav Mehta",
                "email": "aarav.mehta@gmail.com",
                "course": "B.Tech Computer Science",
                "counselor": "Elena Rostova",
                "source": "Google Search",
                "created_at": datetime(2026, 5, 1),
                "status": LeadStatus.ADMISSION_CONFIRMED
            },
            {
                "full_name": "Sophia Patel",
                "email": "sophia.patel@yahoo.com",
                "course": "Master of Business Administration (MBA)",
                "counselor": "Sarah Connor",
                "source": "LinkedIn",
                "created_at": datetime(2026, 5, 8),
                "status": LeadStatus.FOLLOW_UP_PENDING
            },
            {
                "full_name": "Kabir Malhotra",
                "email": "kabir.malhotra@outlook.com",
                "course": "M.Tech Data Science & AI",
                "counselor": "David Miller",
                "source": "Facebook Ads",
                "created_at": datetime(2026, 5, 15),
                "status": LeadStatus.FOLLOW_UP_PENDING
            },
            {
                "full_name": "Ananya Iyer",
                "email": "ananya.iyer@gmail.com",
                "course": "B.Sc Clinical Psychology",
                "counselor": "Elena Rostova",
                "source": "Friend Referral",
                "created_at": datetime(2026, 5, 25),
                "status": LeadStatus.NEW
            },
            {
                "full_name": "Rohan Joshi",
                "email": "rohan.joshi@rediffmail.com",
                "course": "Digital Marketing Specialist",
                "counselor": "Michael Chang",
                "source": "Instagram",
                "created_at": datetime(2026, 5, 20),
                "status": LeadStatus.CONTACTED
            },
            {
                "full_name": "Emily Watson",
                "email": "emily.watson@gmail.com",
                "course": "Bachelor of Design (B.Des)",
                "counselor": "Sarah Connor",
                "source": "Educational Fair",
                "created_at": datetime(2026, 5, 3),
                "status": LeadStatus.REJECTED
            }
        ]

        for l_data in leads_to_seed:
            existing_lead = db.query(Lead).filter(Lead.email == l_data["email"]).first()
            if not existing_lead:
                counselor = counselor_map.get(l_data["counselor"])
                lead = Lead(
                    full_name=l_data["full_name"],
                    email=l_data["email"],
                    status=l_data["status"],
                    counselor_id=counselor.id if counselor else None,
                    form_id=form.id,
                    created_at=l_data["created_at"]
                )
                db.add(lead)
                db.flush()

                # Add dynamic field values
                if "Course of Interest" in field_map:
                    db.add(LeadFieldValue(lead_id=lead.id, field_id=field_map["Course of Interest"].id, value=l_data["course"]))
                if "Source" in field_map:
                    db.add(LeadFieldValue(lead_id=lead.id, field_id=field_map["Source"].id, value=l_data["source"]))

        db.commit()
        print("Detailed seed data created successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
