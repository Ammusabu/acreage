from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime, date

from app.core.database import get_db
from app.models import Booking, Listing, User
from app.schemas.booking import BookingCreate, BookingResponse, BookingSummary

router = APIRouter()

@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    guest_id: int = Query(..., description="Guest user ID"),
    db: Session = Depends(get_db)
):
    """Create a new booking with overlap validation"""
    
    # Check if listing exists and is active
    listing = db.query(Listing).filter(
        Listing.id == booking.listing_id,
        Listing.is_active == True
    ).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if guest exists
    guest = db.query(User).filter(User.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    # Check if guest is trying to book their own listing
    if listing.host_id == guest_id:
        raise HTTPException(status_code=400, detail="Cannot book your own listing")
    
    # Check max guests
    if booking.guest_count > listing.max_guests:
        raise HTTPException(
            status_code=400, 
            detail=f"Maximum {listing.max_guests} guests allowed"
        )
    
    # Check for overlapping bookings
    overlapping = db.query(Booking).filter(
        Booking.listing_id == booking.listing_id,
        Booking.status.in_(['pending', 'confirmed']),
        or_(
            and_(
                Booking.check_in <= booking.check_in,
                Booking.check_out > booking.check_in
            ),
            and_(
                Booking.check_in < booking.check_out,
                Booking.check_out >= booking.check_out
            ),
            and_(
                Booking.check_in >= booking.check_in,
                Booking.check_out <= booking.check_out
            )
        )
    ).first()
    
    if overlapping:
        raise HTTPException(
            status_code=400,
            detail=f"These dates are not available. Overlaps with booking #{overlapping.id}"
        )
    
    # Calculate total price
    nights = (booking.check_out - booking.check_in).days
    total_price = listing.price_per_night * nights
    
    # Create booking
    db_booking = Booking(
        listing_id=booking.listing_id,
        guest_id=guest_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        guest_count=booking.guest_count,
        total_price=total_price,
        status="pending"
    )
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    # Prepare response
    response = BookingResponse(
        id=db_booking.id,
        listing_id=db_booking.listing_id,
        guest_id=db_booking.guest_id,
        check_in=db_booking.check_in,
        check_out=db_booking.check_out,
        guest_count=db_booking.guest_count,
        total_price=db_booking.total_price,
        status=db_booking.status,
        created_at=db_booking.created_at,
        updated_at=db_booking.updated_at,
        listing_title=listing.title,
        listing_image=listing.images[0] if listing.images else None,
        host_name=listing.host.username if listing.host else None
    )
    
    return response

@router.get("/", response_model=List[BookingResponse])
def get_user_bookings(
    user_id: int = Query(..., description="User ID"),
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all bookings for a user"""
    
    query = db.query(Booking).filter(Booking.guest_id == user_id)
    
    if status:
        query = query.filter(Booking.status == status)
    
    bookings = query.order_by(Booking.check_in.desc()).all()
    
    # Prepare responses with listing details
    results = []
    for booking in bookings:
        listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
        results.append(
            BookingResponse(
                id=booking.id,
                listing_id=booking.listing_id,
                guest_id=booking.guest_id,
                check_in=booking.check_in,
                check_out=booking.check_out,
                guest_count=booking.guest_count,
                total_price=booking.total_price,
                status=booking.status,
                created_at=booking.created_at,
                updated_at=booking.updated_at,
                listing_title=listing.title if listing else None,
                listing_image=listing.images[0] if listing and listing.images else None,
                host_name=listing.host.username if listing and listing.host else None
            )
        )
    
    return results

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    user_id: int = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """Get a specific booking"""
    
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        or_(
            Booking.guest_id == user_id,
            Booking.listing.has(host_id=user_id)
        )
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
    
    return BookingResponse(
        id=booking.id,
        listing_id=booking.listing_id,
        guest_id=booking.guest_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        guest_count=booking.guest_count,
        total_price=booking.total_price,
        status=booking.status,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        listing_title=listing.title if listing else None,
        listing_image=listing.images[0] if listing and listing.images else None,
        host_name=listing.host.username if listing and listing.host else None
    )

@router.put("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    user_id: int = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """Cancel a booking"""
    
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.guest_id == user_id,
        Booking.status.in_(['pending', 'confirmed'])
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or cannot be cancelled")
    
    # Check if check-in is within 24 hours
    if (booking.check_in - datetime.now().date()).days < 1:
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel booking within 24 hours of check-in"
        )
    
    booking.status = "cancelled"
    db.commit()
    
    return {"message": "Booking cancelled successfully"}

@router.get("/listings/{listing_id}/availability")
def check_availability(
    listing_id: int,
    check_in: date,
    check_out: date,
    db: Session = Depends(get_db)
):
    """Check if dates are available for a listing"""
    
    # Check if listing exists
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.is_active == True
    ).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check for overlapping bookings
    overlapping = db.query(Booking).filter(
        Booking.listing_id == listing_id,
        Booking.status.in_(['pending', 'confirmed']),
        or_(
            and_(
                Booking.check_in <= check_in,
                Booking.check_out > check_in
            ),
            and_(
                Booking.check_in < check_out,
                Booking.check_out >= check_out
            ),
            and_(
                Booking.check_in >= check_in,
                Booking.check_out <= check_out
            )
        )
    ).first()
    
    is_available = overlapping is None
    
    # Calculate price
    nights = (check_out - check_in).days
    total_price = listing.price_per_night * nights if nights > 0 else 0
    
    return {
        "available": is_available,
        "price_per_night": listing.price_per_night,
        "nights": nights,
        "total_price": total_price,
        "service_fee": int(total_price * 0.12),  # 12% service fee
        "total_with_fees": int(total_price * 1.12)
    }
