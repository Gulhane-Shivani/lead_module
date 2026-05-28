from fastapi import APIRouter
from app.api.endpoints import auth, forms, leads, followups, analytics, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(forms.router, prefix="/forms", tags=["forms"])
api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
api_router.include_router(followups.router, prefix="/followups", tags=["followups"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
