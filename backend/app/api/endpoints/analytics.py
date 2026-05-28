from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.models.lead import Lead, LeadStatus
from app.models.user import User, UserRole

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_analytics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_admin)
):
    total_leads = db.query(Lead).count()
    status_counts = db.query(Lead.status, func.count(Lead.id)).group_by(Lead.status).all()
    
    # Conversion rate: (Admission Confirmed / Total Leads) * 100
    confirmed_leads = db.query(Lead).filter(Lead.status == LeadStatus.ADMISSION_CONFIRMED).count()
    conversion_rate = (confirmed_leads / total_leads * 100) if total_leads > 0 else 0

    counselor_performance = db.query(
        User.full_name, 
        func.count(Lead.id).label("total_assigned"),
        func.count(Lead.id).filter(Lead.status == LeadStatus.ADMISSION_CONFIRMED).label("confirmed")
    ).join(Lead, User.id == Lead.counselor_id).group_by(User.id).all()

    return {
        "total_leads": total_leads,
        "status_distribution": {status.value: count for status, count in status_counts},
        "conversion_rate": conversion_rate,
        "counselor_performance": [
            {
                "name": name,
                "total_assigned": total_assigned,
                "confirmed": confirmed,
                "performance_ratio": (confirmed / total_assigned * 100) if total_assigned > 0 else 0
            } for name, total_assigned, confirmed in counselor_performance
        ]
    }
