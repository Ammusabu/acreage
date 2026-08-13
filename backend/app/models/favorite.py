from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    listing = relationship("Listing", back_populates="favorites")
    
    # Ensure a user can only favorite a listing once
    __table_args__ = (
        UniqueConstraint('user_id', 'listing_id', name='unique_user_listing_favorite'),
    )
