from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Amenity(Base):
    __tablename__ = "amenities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    icon = Column(String, nullable=True)  # Icon identifier or emoji
    
    # Relationships
    listings = relationship("Listing", secondary="listing_amenities", back_populates="amenities")
