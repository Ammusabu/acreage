from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import Optional

class BookingBase(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guest_count: int = Field(..., ge=1)
    
    @validator('check_out')
    def validate_dates(cls, check_out, values):
        if 'check_in' in values and check_out <= values['check_in']:
            raise ValueError('check_out must be after check_in')
        return check_out

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    guest_id: int
    total_price: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    listing_title: Optional[str] = None
    listing_image: Optional[str] = None
    host_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class BookingSummary(BaseModel):
    nights: int
    price_per_night: int
    total_price: int
    service_fee: int
    total_with_fees: int
