from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import Favorite, Listing, User
from app.schemas.listing import ListingResponse

router = APIRouter()

@router.post("/toggle")
def toggle_favorite(
    listing_id: int = Query(...),
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Toggle favorite status for a listing"""
    
    # Check if listing exists
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.is_active == True
    ).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already favorited
    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.listing_id == listing_id
    ).first()
    
    if existing:
        # Remove favorite
        db.delete(existing)
        db.commit()
        return {"favorited": False, "message": "Favorite removed"}
    else:
        # Add favorite
        favorite = Favorite(user_id=user_id, listing_id=listing_id)
        db.add(favorite)
        db.commit()
        return {"favorited": True, "message": "Favorite added"}

@router.get("/", response_model=List[ListingResponse])
def get_favorites(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Get all favorites for a user"""
    
    favorites = db.query(Favorite).filter(Favorite.user_id == user_id).all()
    listing_ids = [fav.listing_id for fav in favorites]
    
    listings = db.query(Listing).filter(
        Listing.id.in_(listing_ids),
        Listing.is_active == True
    ).all()
    
    # Convert to response with amenity names
    return [ListingResponse.from_orm_with_amenities(listing) for listing in listings]

@router.get("/check")
def check_favorite(
    listing_id: int = Query(...),
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Check if a listing is favorited by a user"""
    
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.listing_id == listing_id
    ).first()
    
    return {"favorited": favorite is not None}
