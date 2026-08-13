from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    guest_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    guest_count = Column(Integer, nullable=False)
    total_price = Column(Integer, nullable=False)  # in cents
    status = Column(String, default="pending")  # pending, confirmed, cancelled, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    cancellation_reason = Column(Text, nullable=True)
    
    # Relationships
    listing = relationship("Listing", back_populates="bookings")
    guest = relationship("User", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False, cascade="all, delete-orphan")
