from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.models import Listing, User, Amenity, listing_amenities, Booking
from app.schemas.listing import ListingResponse, ListingCreate, ListingUpdate

router = APIRouter(
    tags=["Listings"],
    responses={404: {"description": "Not found"}},
)

@router.get(
    "/",
    response_model=List[ListingResponse],
    summary="Get all listings",
    description="Retrieve a list of all active listings with optional filters."
)
def get_listings(
    location: Optional[str] = Query(None, description="Filter by location"),
    min_price: Optional[int] = Query(None, description="Minimum price in cents", ge=0),
    max_price: Optional[int] = Query(None, description="Maximum price in cents", ge=0),
    property_type: Optional[str] = Query(None, description="Filter by property type"),
    min_rating: Optional[float] = Query(None, description="Minimum rating", ge=0, le=5),
    limit: int = Query(20, description="Number of results", ge=1, le=100),
    offset: int = Query(0, description="Number to skip", ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Listing).filter(Listing.is_active == True)
    
    if location:
        query = query.filter(Listing.location.ilike(f"%{location}%"))
    if min_price is not None:
        query = query.filter(Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price_per_night <= max_price)
    if property_type:
        query = query.filter(Listing.property_type == property_type)
    if min_rating is not None:
        query = query.filter(Listing.rating >= min_rating)
    
    listings = query.order_by(Listing.created_at.desc()).offset(offset).limit(limit).all()
    return [ListingResponse.from_orm_with_amenities(listing) for listing in listings]

@router.get(
    "/{listing_id}",
    response_model=ListingResponse,
    summary="Get a specific listing"
)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.is_active == True
    ).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    return ListingResponse.from_orm_with_amenities(listing)

@router.post(
    "/",
    response_model=ListingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new listing"
)
def create_listing(
    listing: ListingCreate,
    host_id: int = Query(..., description="ID of the host user"),
    db: Session = Depends(get_db)
):
    host = db.query(User).filter(User.id == host_id, User.is_host == True).first()
    if not host:
        raise HTTPException(status_code=404, detail="Host not found")
    
    db_listing = Listing(
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
        host_id=host_id,
        review_count=0,
        rating=0.0,
        is_active=True
    )
    db.add(db_listing)
    db.flush()
    
    if listing.amenities:
        for amenity_name in listing.amenities:
            amenity = db.query(Amenity).filter(Amenity.name == amenity_name).first()
            if amenity:
                db.execute(
                    listing_amenities.insert().values(
                        listing_id=db_listing.id,
                        amenity_id=amenity.id
                    )
                )
    
    db.commit()
    db.refresh(db_listing)
    return ListingResponse.from_orm_with_amenities(db_listing)

@router.put(
    "/{listing_id}",
    response_model=ListingResponse,
    summary="Update a listing"
)
def update_listing(
    listing_id: int,
    listing_update: ListingUpdate,
    host_id: int = Query(..., description="ID of the host user"),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.host_id == host_id,
        Listing.is_active == True
    ).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found or not owned by host")
    
    update_data = listing_update.dict(exclude_unset=True, exclude={'amenities'})
    for field, value in update_data.items():
        setattr(listing, field, value)
    
    if listing_update.amenities is not None:
        db.execute(listing_amenities.delete().where(
            listing_amenities.c.listing_id == listing_id
        ))
        
        for amenity_name in listing_update.amenities:
            amenity = db.query(Amenity).filter(Amenity.name == amenity_name).first()
            if amenity:
                db.execute(
                    listing_amenities.insert().values(
                        listing_id=listing_id,
                        amenity_id=amenity.id
                    )
                )
    
    db.commit()
    db.refresh(listing)
    return ListingResponse.from_orm_with_amenities(listing)

@router.delete(
    "/{listing_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a listing"
)
def delete_listing(
    listing_id: int,
    host_id: int = Query(..., description="ID of the host user"),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.host_id == host_id
    ).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found or not owned by host")
    
    future_bookings = db.query(Booking).filter(
        Booking.listing_id == listing_id,
        Booking.check_in > datetime.now().date(),
        Booking.status.in_(['pending', 'confirmed'])
    ).count()
    
    if future_bookings > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete listing with future bookings"
        )
    
    listing.is_active = False
    listing.deleted_at = datetime.now()
    db.commit()
    
    return {"message": "Listing deleted successfully", "listing_id": listing_id}
