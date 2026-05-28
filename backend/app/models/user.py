from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
from app.database.base_class import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    COUNSELOR = "counselor"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    role = Column(Enum(UserRole), default=UserRole.COUNSELOR)

    # Relationships
    assigned_leads = relationship("Lead", back_populates="counselor")
    followups = relationship("FollowUp", back_populates="counselor")
