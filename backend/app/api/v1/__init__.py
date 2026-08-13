from fastapi import APIRouter
from app.api.v1.endpoints import listings, bookings, favorites, reviews, host

router = APIRouter(prefix="/api/v1")

router.include_router(listings.router, prefix="/listings", tags=["listings"])
router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
router.include_router(favorites.router, prefix="/favorites", tags=["favorites"])
router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
router.include_router(host.router, prefix="/host", tags=["host"])