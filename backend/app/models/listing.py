from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Listing(Base):
    __tablename__ = "listings"
    
    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    property_type = Column(String, nullable=False)
    room_type = Column(String, nullable=False)  # entire_home, private_room, shared_room
    location = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    price_per_night = Column(Integer, nullable=False)  # in cents
    max_guests = Column(Integer, nullable=False)
    bedrooms = Column(Integer, default=1)
    beds = Column(Integer, default=1)
    bathrooms = Column(Float, default=1.0)
    images = Column(JSON, default=list)  # Array of image URLs
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)  # Soft delete
    
    # Relationships
    host = relationship("User", back_populates="listings")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    amenities = relationship("Amenity", secondary="listing_amenities", back_populates="listings")
