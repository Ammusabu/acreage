from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.models import Listing, Booking, User
from app.schemas.listing import ListingResponse, ListingCreate, ListingUpdate
from app.schemas.booking import BookingResponse

router = APIRouter()

@router.get("/listings")
def get_host_listings(
    host_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Get all listings owned by a host"""
    
    listings = db.query(Listing).filter(
        Listing.host_id == host_id
    ).order_by(Listing.created_at.desc()).all()
    
    # Convert to response with amenity names
    return [ListingResponse.from_orm_with_amenities(listing) for listing in listings]

@router.get("/bookings")
def get_host_bookings(
    host_id: int = Query(...),
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all bookings for a host's listings"""
    
    # Get all listings owned by host
    listings = db.query(Listing).filter(Listing.host_id == host_id).all()
    listing_ids = [listing.id for listing in listings]
    
    if not listing_ids:
        return []
    
    query = db.query(Booking).filter(Booking.listing_id.in_(listing_ids))
    
    if status:
        query = query.filter(Booking.status == status)
    
    bookings = query.order_by(Booking.check_in.desc()).all()
    
    # Prepare responses
    results = []
    for booking in bookings:
        listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
        guest = db.query(User).filter(User.id == booking.guest_id).first()
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

@router.get("/dashboard")
def get_host_dashboard(
    host_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Get host dashboard statistics"""
    
    # Get all listings owned by host
    listings = db.query(Listing).filter(Listing.host_id == host_id).all()
    listing_ids = [listing.id for listing in listings]
    
    total_listings = len(listings)
    active_listings = len([l for l in listings if l.is_active])
    
    # Get booking statistics
    total_bookings = 0
    pending_bookings = 0
    confirmed_bookings = 0
    completed_bookings = 0
    total_revenue = 0
    
    if listing_ids:
        bookings = db.query(Booking).filter(Booking.listing_id.in_(listing_ids)).all()
        total_bookings = len(bookings)
        pending_bookings = len([b for b in bookings if b.status == "pending"])
        confirmed_bookings = len([b for b in bookings if b.status == "confirmed"])
        completed_bookings = len([b for b in bookings if b.status == "completed"])
        total_revenue = sum(b.total_price for b in bookings if b.status in ["confirmed", "completed"])
    
    # Get recent bookings (last 10)
    recent_bookings = []
    if listing_ids:
        recent = db.query(Booking).filter(
            Booking.listing_id.in_(listing_ids)
        ).order_by(Booking.created_at.desc()).limit(10).all()
        
        for booking in recent:
            listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
            guest = db.query(User).filter(User.id == booking.guest_id).first()
            recent_bookings.append({
                "id": booking.id,
                "listing_title": listing.title if listing else "Unknown",
                "guest_name": guest.username if guest else "Unknown",
                "check_in": booking.check_in,
                "check_out": booking.check_out,
                "total_price": booking.total_price,
                "status": booking.status,
                "created_at": booking.created_at
            })
    
    return {
        "total_listings": total_listings,
        "active_listings": active_listings,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "completed_bookings": completed_bookings,
        "total_revenue": total_revenue,
        "recent_bookings": recent_bookings
    }
