from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ListingBase(BaseModel):
    title: str
    description: str
    property_type: str
    room_type: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: int = Field(..., ge=0, description="Price in cents")
    max_guests: int = Field(..., ge=1)
    bedrooms: int = Field(1, ge=0)
    beds: int = Field(1, ge=0)
    bathrooms: float = Field(1.0, ge=0)
    images: List[str] = []

class ListingCreate(ListingBase):
    amenities: Optional[List[str]] = []

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    room_type: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: Optional[int] = Field(None, ge=0)
    max_guests: Optional[int] = Field(None, ge=1)
    bedrooms: Optional[int] = Field(None, ge=0)
    beds: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[float] = Field(None, ge=0)
    images: Optional[List[str]] = None
    amenities: Optional[List[str]] = None
    is_active: Optional[bool] = None

class ListingResponse(ListingBase):
    id: int
    host_id: int
    rating: float
    review_count: int
    is_active: bool
    amenities: List[str] = []  # Now expecting list of strings
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        
    @classmethod
    def from_orm_with_amenities(cls, listing):
        """Helper to create response with amenity names"""
        return cls(
            id=listing.id,
            host_id=listing.host_id,
            title=listing.title,
            description=listing.description,
            property_type=listing.property_type,
            room_type=listing.room_type,
            location=listing.location,
            latitude=listing.latitude,
            longitude=listing.longitude,
            price_per_night=listing.price_per_night,
            max_guests=listing.max_guests,
            bedrooms=listing.bedrooms,
            beds=listing.beds,
            bathrooms=listing.bathrooms,
            images=listing.images,
            rating=listing.rating,
            review_count=listing.review_count,
            is_active=listing.is_active,
            amenities=[amenity.name for amenity in listing.amenities] if listing.amenities else [],
            created_at=listing.created_at,
            updated_at=listing.updated_at
        )

class ListingSearchParams(BaseModel):
    location: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    guests: Optional[int] = Field(None, ge=1)
    min_price: Optional[int] = Field(None, ge=0)
    max_price: Optional[int] = Field(None, ge=0)
    property_type: Optional[str] = None
    room_type: Optional[str] = None
    amenities: Optional[List[str]] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    limit: int = Field(20, ge=1, le=100)
    offset: int = Field(0, ge=0)
