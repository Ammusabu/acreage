import random
import hashlib
from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.models import User, Listing, Amenity, listing_amenities, Booking, Review, Favorite

# Simple password hashing for seeding
def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def seed_database():
    db = SessionLocal()
    
    try:
        print("🌱 Seeding database...")
        
        # Clear existing data
        db.query(Favorite).delete()
        db.query(Review).delete()
        db.query(Booking).delete()
        db.query(listing_amenities).delete()
        db.query(Listing).delete()
        db.query(Amenity).delete()
        db.query(User).delete()
        db.commit()
        print("✅ Cleared existing data")
        
        # 1. Create Users (Hosts)
        print("👤 Creating users...")
        users = []
        
        host_data = [
            {
                "email": "sarah@example.com",
                "username": "sarah_host",
                "name": "Sarah Johnson",
                "is_host": True,
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                "bio": "Love hosting and meeting travelers from around the world!"
            },
            {
                "email": "michael@example.com",
                "username": "michael_host",
                "name": "Michael Chen",
                "is_host": True,
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                "bio": "Professional host with properties in the best locations."
            },
            {
                "email": "emma@example.com",
                "username": "emma_host",
                "name": "Emma Williams",
                "is_host": True,
                "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                "bio": "Interior designer turned host. Every space is carefully curated."
            },
            {
                "email": "david@example.com",
                "username": "david_host",
                "name": "David Park",
                "is_host": True,
                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
                "bio": "Adventure lover sharing unique stays with guests."
            },
            {
                "email": "lisa@example.com",
                "username": "lisa_host",
                "name": "Lisa Martinez",
                "is_host": True,
                "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
                "bio": "Passionate about hospitality and creating memorable experiences."
            },
        ]
        
        for data in host_data:
            user = User(
                email=data["email"],
                username=data["username"],
                hashed_password=hash_password("password123"),
                is_host=data["is_host"],
                host_since=datetime.now() - timedelta(days=random.randint(30, 365)),
                avatar_url=data["avatar"],
                bio=data["bio"],
            )
            db.add(user)
            users.append(user)
        
        # Create regular users (guests)
        guest_data = [
            {"email": "alice@example.com", "username": "alice_guest", "name": "Alice Johnson"},
            {"email": "bob@example.com", "username": "bob_guest", "name": "Bob Smith"},
            {"email": "carol@example.com", "username": "carol_guest", "name": "Carol Davis"},
            {"email": "dave@example.com", "username": "dave_guest", "name": "Dave Wilson"},
        ]
        
        for data in guest_data:
            user = User(
                email=data["email"],
                username=data["username"],
                hashed_password=hash_password("password123"),
                is_host=False,
                avatar_url=f"https://i.pravatar.cc/100?u={data['username']}",
                bio=f"Travel enthusiast from {data['name'].split()[-1]}.",
            )
            db.add(user)
            users.append(user)
        
        db.commit()
        print(f"✅ Created {len(users)} users")
        
        # 2. Create Amenities
        print("🏷️ Creating amenities...")
        amenities_list = [
            "WiFi", "Kitchen", "Washer", "Dryer", "Air conditioning", "Heating",
            "Dedicated workspace", "TV", "Hair dryer", "Iron", "Pool", "Hot tub",
            "Free parking", "Gym", "BBQ grill", "Breakfast", "Indoor fireplace",
            "Smoke alarm", "Carbon monoxide alarm", "First aid kit", "Fire extinguisher"
        ]
        
        amenities = []
        icons = ["🔌", "🍳", "🧺", "🌡️", "❄️", "🔥", "💻", "📺", "💨", "👕", "🏊", "🛁", "🅿️", "🏋️", "🍖", "🍳", "🔥", "🚨", "💨", "🩹", "🧯"]
        for i, name in enumerate(amenities_list):
            amenity = Amenity(name=name, icon=icons[i % len(icons)])
            db.add(amenity)
            amenities.append(amenity)
        db.commit()
        print(f"✅ Created {len(amenities)} amenities")
        
        # 3. Create Listings
        print("🏠 Creating listings...")
        
        property_types = ["Apartment", "House", "Villa", "Cabin", "Beach House", "Loft", "Penthouse", "Tiny Home", "Castle", "Treehouse"]
        room_types = ["entire_home", "private_room", "shared_room"]
        
        listing_titles = [
            ("Cozy Downtown Loft", "Beautiful loft in the heart of the city with stunning views"),
            ("Beachfront Paradise", "Wake up to the sound of waves in this stunning beachfront property"),
            ("Mountain Cabin Retreat", "Escape to the mountains in this cozy cabin with a fireplace"),
            ("Modern City Apartment", "Sleek modern apartment in the best part of town"),
            ("Luxury Villa with Pool", "Experience luxury in this villa with a private pool and garden"),
            ("Historic Townhouse", "Stay in a piece of history in this beautifully restored townhouse"),
            ("Secluded Forest Cabin", "Perfect getaway surrounded by nature and wildlife"),
            ("Penthouse with Rooftop", "Enjoy panoramic views from your private rooftop terrace"),
            ("Charming Country Cottage", "Peaceful cottage in the countryside with a garden"),
            ("Urban Oasis", "Tranquil escape in the middle of the bustling city"),
            ("Ski-in Ski-out Chalet", "Perfect winter retreat with direct slope access"),
            ("Mediterranean Villa", "Bright and airy villa with Mediterranean charm"),
            ("Jungle Treehouse", "Unique treehouse experience in the middle of the jungle"),
            ("Desert Retreat", "Stunning desert property with star-gazing opportunities"),
            ("Lakeside Cabin", "Cozy cabin with direct lake access and stunning views"),
            ("Colonial Mansion", "Grand colonial mansion with period features and modern comforts"),
            ("Tropical Bungalow", "Relax in this tropical bungalow surrounded by palm trees"),
            ("Mountain View Apartment", "Apartment with breathtaking mountain views"),
            ("Historic Castle Stay", "Live like royalty in this historic castle"),
            ("Modern Glass House", "Contemporary glass house with floor-to-ceiling windows"),
        ]
        
        images_pool = [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=400&h=300&fit=crop",
        ]
        
        locations = [
            "New York, NY", "Los Angeles, CA", "Miami, FL", "Austin, TX", "Denver, CO",
            "Seattle, WA", "Chicago, IL", "Boston, MA", "San Francisco, CA", "Portland, OR",
            "Nashville, TN", "New Orleans, LA", "Santa Fe, NM", "Asheville, NC", "Bozeman, MT",
            "Tulum, Mexico", "Bali, Indonesia", "Tuscany, Italy", "Santorini, Greece", "Kyoto, Japan"
        ]
        
        listings = []
        for i, (title, description) in enumerate(listing_titles[:20]):
            host = random.choice([u for u in users if u.is_host])
            property_type = random.choice(property_types)
            room_type = random.choice(room_types)
            
            num_images = random.randint(3, 6)
            listing_images = random.sample(images_pool, min(num_images, len(images_pool)))
            
            listing = Listing(
                host_id=host.id,
                title=title,
                description=description,
                property_type=property_type,
                room_type=room_type,
                location=locations[i % len(locations)],
                latitude=random.uniform(25.0, 48.0),
                longitude=random.uniform(-125.0, -65.0),
                price_per_night=random.randint(5000, 30000),
                max_guests=random.randint(2, 8),
                bedrooms=random.randint(1, 4),
                beds=random.randint(1, 5),
                bathrooms=random.choice([1.0, 1.5, 2.0, 2.5, 3.0]),
                images=listing_images,
                rating=round(random.uniform(4.0, 5.0), 1),
                review_count=0,
                is_active=True,
            )
            db.add(listing)
            # Flush to get the ID
            db.flush()
            listings.append(listing)
            
            # Add amenities using the listing ID
            num_amenities = random.randint(4, 7)
            selected_amenities = random.sample(amenities, min(num_amenities, len(amenities)))
            for amenity in selected_amenities:
                db.execute(
                    listing_amenities.insert().values(
                        listing_id=listing.id,
                        amenity_id=amenity.id
                    )
                )
        
        db.commit()
        print(f"✅ Created {len(listings)} listings")
        
        # 4. Create Bookings
        print("📅 Creating bookings...")
        bookings = []
        today = datetime.now().date()
        
        for _ in range(30):
            listing = random.choice(listings)
            guest = random.choice([u for u in users if not u.is_host])
            check_in = today + timedelta(days=random.randint(1, 90))
            check_out = check_in + timedelta(days=random.randint(1, 7))
            guest_count = random.randint(1, min(listing.max_guests, 4))
            
            nights = (check_out - check_in).days
            total_price = listing.price_per_night * nights
            
            status = random.choices(
                ["pending", "confirmed", "cancelled", "completed"],
                weights=[10, 50, 10, 30],
                k=1
            )[0]
            
            booking = Booking(
                listing_id=listing.id,
                guest_id=guest.id,
                check_in=check_in,
                check_out=check_out,
                guest_count=guest_count,
                total_price=total_price,
                status=status,
            )
            db.add(booking)
            bookings.append(booking)
        
        db.commit()
        print(f"✅ Created {len(bookings)} bookings")
        
        # 5. Create Reviews
        print("⭐ Creating reviews...")
        reviews_created = 0
        
        for booking in bookings:
            if booking.status == "completed" and random.random() < 0.7:
                rating = random.randint(4, 5)
                review = Review(
                    booking_id=booking.id,
                    listing_id=booking.listing_id,
                    reviewer_id=booking.guest_id,
                    rating=rating,
                    comment=random.choice([
                        "Amazing stay! The place was exactly as described.",
                        "Great location and very comfortable. Highly recommend!",
                        "The host was wonderful and the property was beautiful.",
                        "Perfect getaway. We'll definitely be coming back.",
                        "Lovely space with everything we needed.",
                        "Excellent experience from start to finish.",
                        "The photos don't do it justice - even better in person!",
                        "Great value for the price. Very clean and well-maintained.",
                        "Wonderful hosts who went above and beyond.",
                        "Beautiful property in a fantastic location."
                    ])
                )
                db.add(review)
                reviews_created += 1
                
                # Update listing rating
                listing = db.query(Listing).filter(Listing.id == booking.listing_id).first()
                if listing:
                    listing.review_count += 1
                    all_reviews = db.query(Review).filter(Review.listing_id == listing.id).all()
                    if all_reviews:
                        avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
                        listing.rating = round(avg_rating, 1)
        
        db.commit()
        print(f"✅ Created {reviews_created} reviews")
        
        # 6. Create Favorites
        print("❤️ Creating favorites...")
        favorites_created = 0
        
        for user in users:
            if not user.is_host:
                num_favorites = random.randint(0, 5)
                if len(listings) > 0:
                    selected_listings = random.sample(listings, min(num_favorites, len(listings)))
                    for listing in selected_listings:
                        existing = db.query(Favorite).filter(
                            Favorite.user_id == user.id,
                            Favorite.listing_id == listing.id
                        ).first()
                        if not existing:
                            favorite = Favorite(
                                user_id=user.id,
                                listing_id=listing.id
                            )
                            db.add(favorite)
                            favorites_created += 1
        
        db.commit()
        print(f"✅ Created {favorites_created} favorites")
        
        print("\n🎉 Database seeded successfully!")
        print(f"📊 Summary:")
        print(f"   - Users: {len(users)}")
        print(f"   - Listings: {len(listings)}")
        print(f"   - Amenities: {len(amenities)}")
        print(f"   - Bookings: {len(bookings)}")
        print(f"   - Reviews: {reviews_created}")
        print(f"   - Favorites: {favorites_created}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
