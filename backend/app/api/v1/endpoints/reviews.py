from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.models import Review, Booking, Listing, User
from app.schemas.review import ReviewCreate, ReviewResponse

router = APIRouter(
    tags=["Reviews"],
    responses={404: {"description": "Not found"}},
)

@router.post(
    "/",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a review",
    description="Create a review for a completed booking."
)
def create_review(
    review: ReviewCreate,
    reviewer_id: int = Query(..., description="ID of the reviewer"),
    db: Session = Depends(get_db)
):
    """Create a review for a completed booking"""
    
    # Check if booking exists and is completed
    booking = db.query(Booking).filter(
        Booking.id == review.booking_id,
        Booking.status == "completed"
    ).first()
    
    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found or not completed"
        )
    
    # Check if user is the guest who made the booking
    if booking.guest_id != reviewer_id:
        raise HTTPException(
            status_code=403,
            detail="You can only review your own bookings"
        )
    
    # Check if review already exists for this booking
    existing = db.query(Review).filter(
        Review.booking_id == review.booking_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Review already exists for this booking"
        )
    
    # Create review
    db_review = Review(
        booking_id=review.booking_id,
        listing_id=booking.listing_id,
        reviewer_id=reviewer_id,
        rating=review.rating,
        comment=review.comment
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update listing rating
    listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
    if listing:
        all_reviews = db.query(Review).filter(Review.listing_id == listing.id).all()
        if all_reviews:
            avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
            listing.rating = round(avg_rating, 1)
            listing.review_count = len(all_reviews)
            db.commit()
    
    return db_review

@router.get(
    "/listings/{listing_id}",
    response_model=List[ReviewResponse],
    summary="Get listing reviews"
)
def get_listing_reviews(
    listing_id: int,
    db: Session = Depends(get_db)
):
    """Get all reviews for a listing"""
    
    reviews = db.query(Review).filter(
        Review.listing_id == listing_id
    ).order_by(Review.created_at.desc()).all()
    
    results = []
    for review in reviews:
        reviewer = db.query(User).filter(User.id == review.reviewer_id).first()
        results.append(
            ReviewResponse(
                id=review.id,
                booking_id=review.booking_id,
                listing_id=review.listing_id,
                reviewer_id=review.reviewer_id,
                rating=review.rating,
                comment=review.comment,
                created_at=review.created_at,
                updated_at=review.updated_at,
                reviewer_name=reviewer.username if reviewer else None,
                reviewer_avatar=reviewer.avatar_url if reviewer else None
            )
        )
    
    return results
