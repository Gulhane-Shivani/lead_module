import app.models.base  # Must be first to register all SQLAlchemy models
from app.database.session import SessionLocal
from app.services import form_service
from app.schemas.form import FormFieldsSync, FieldSyncItem

db = SessionLocal()
try:
    sync_data = FormFieldsSync(
        fields=[
            FieldSyncItem(
                id=5,
                label="Student Full Name",
                field_type="text",
                required=True,
                placeholder="Enter student's full name",
                section="Basic Info",
                validation={"minLength": 2},
                is_core=True,
                order=1
            ),
            FieldSyncItem(
                id=6,
                label="Email Address",
                field_type="email",
                required=True,
                placeholder="studentname@example.com",
                section="Basic Info",
                validation={},
                is_core=True,
                order=2
            ),
            FieldSyncItem(
                id=7,
                label="Phone Number",
                field_type="number",
                required=True,
                placeholder="e.g., 9876543210",
                section="Basic Info",
                validation={},
                is_core=True,
                order=3
            ),
            FieldSyncItem(
                id=8,
                label="Course of Interest",
                field_type="dropdown",
                required=True,
                placeholder="Select a course",
                section="Academic Info",
                options=["B.Tech Computer Science", "MBA", "M.Tech Data Science"],
                validation={},
                is_core=True,
                order=4
            ),
            FieldSyncItem(
                id=9,
                label="Source",
                field_type="dropdown",
                required=False,
                placeholder="How did you hear about us?",
                section="Marketing Info",
                options=["Google Search", "LinkedIn", "Facebook Ads"],
                validation={},
                is_core=True,
                order=5
            ),
            FieldSyncItem(
                id=10,
                label="Assigned Counselor",
                field_type="text",
                required=False,
                placeholder="",
                section="Administration",
                validation={},
                is_core=True,
                order=6
            ),
            FieldSyncItem(
                id=11,
                label="Status",
                field_type="text",
                required=False,
                placeholder="",
                section="Administration",
                validation={},
                is_core=True,
                order=7
            ),
            FieldSyncItem(
                id=12,
                label="Internal Notes",
                field_type="textarea",
                required=False,
                placeholder="",
                section="Administration",
                validation={},
                is_core=True,
                order=8
            ),
            # NEW custom field being added
            FieldSyncItem(
                id="custom_123456",
                label="Custom Test Field",
                field_type="text",
                required=False,
                placeholder="Enter custom value",
                section="Custom Section",
                validation={},
                is_core=False,
                order=9
            )
        ]
    )

    result = form_service.sync_fields(db, form_id=3, sync_data=sync_data)
    print("[OK] sync_fields completed successfully!")
    for f in result:
        print(f"  Field ID: {f.id}, Label: {f.label}, Type: {f.field_type}, Is Core: {f.is_core}")

except Exception as e:
    import traceback
    print("[ERROR]:", e)
    traceback.print_exc()
finally:
    db.close()
