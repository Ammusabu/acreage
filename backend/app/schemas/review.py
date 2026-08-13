from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ReviewBase(BaseModel):
    booking_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    listing_id: int
    reviewer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    reviewer_name: Optional[str] = None
    reviewer_avatar: Optional[str] = None
    
    class Config:
        from_attributes = True
