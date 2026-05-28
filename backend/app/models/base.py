# Import all the models, so that Base has them before being
# imported by Alembic
from app.database.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.lead import Lead, LeadForm, LeadField, LeadFieldValue  # noqa
from app.models.followup import FollowUp  # noqa
from app.models.notification import Notification  # noqa
