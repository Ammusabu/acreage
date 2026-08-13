import random
import sqlite3
import json
from datetime import datetime

# Connect to database
conn = sqlite3.connect('acreage.db')
cursor = conn.cursor()

# Get existing hosts
cursor.execute("SELECT id FROM users WHERE is_host = 1")
hosts = cursor.fetchall()
print(f"Found {len(hosts)} hosts")

if not hosts:
    print("No hosts found. Please create hosts first.")
    exit()

# Count current listings
cursor.execute("SELECT COUNT(*) FROM listings")
count = cursor.fetchone()[0]
print(f"Current listings: {count}")

# Sample property data with diverse types
properties = [
    # Beachfront properties
    {
        "title": "Oceanfront Villa with Private Beach",
        "location": "Miami, FL",
        "property_type": "Beach House",
        "room_type": "entire_home",
        "price": 35000,
        "max_guests": 8,
        "bedrooms": 4,
        "beds": 5,
        "bathrooms": 3.0,
        "images": [
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Beachfront Bungalow with Sunset Views",
        "location": "Goa, India",
        "property_type": "Beach House",
        "room_type": "entire_home",
        "price": 12000,
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 1.5,
        "images": [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop"
        ]
    },
    
    # Cabin properties
    {
        "title": "Cozy Log Cabin in the Woods",
        "location": "Asheville, NC",
        "property_type": "Cabin",
        "room_type": "entire_home",
        "price": 18000,
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.0,
        "images": [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Mountain View Cabin with Hot Tub",
        "location": "Manali, India",
        "property_type": "Cabin",
        "room_type": "entire_home",
        "price": 15000,
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 1.5,
        "images": [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
        ]
    },
    
    # Mountain properties
    {
        "title": "Alpine Chalet with Ski Access",
        "location": "Denver, CO",
        "property_type": "Chalet",
        "room_type": "entire_home",
        "price": 28000,
        "max_guests": 8,
        "bedrooms": 4,
        "beds": 5,
        "bathrooms": 3.0,
        "images": [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
        ]
    },
    
    # Luxury properties
    {
        "title": "Luxury Penthouse with City Views",
        "location": "New York, NY",
        "property_type": "Penthouse",
        "room_type": "entire_home",
        "price": 45000,
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.5,
        "images": [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Mediterranean Villa with Private Pool",
        "location": "Tuscany, Italy",
        "property_type": "Villa",
        "room_type": "entire_home",
        "price": 55000,
        "max_guests": 10,
        "bedrooms": 5,
        "beds": 6,
        "bathrooms": 4.0,
        "images": [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
        ]
    },
    
    # Villa properties
    {
        "title": "Bali Luxury Villa with Private Pool",
        "location": "Bali, Indonesia",
        "property_type": "Villa",
        "room_type": "entire_home",
        "price": 38000,
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.5,
        "images": [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
        ]
    },
    
    # Apartment properties
    {
        "title": "Modern Loft in Downtown",
        "location": "Chicago, IL",
        "property_type": "Apartment",
        "room_type": "entire_home",
        "price": 14000,
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 1.5,
        "images": [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Cozy Apartment in Paris",
        "location": "Paris, France",
        "property_type": "Apartment",
        "room_type": "entire_home",
        "price": 22000,
        "max_guests": 3,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1.0,
        "images": [
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop"
        ]
    },
    
    # Tiny Home
    {
        "title": "Tiny House with Ocean View",
        "location": "Portland, OR",
        "property_type": "Tiny Home",
        "room_type": "entire_home",
        "price": 9000,
        "max_guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1.0,
        "images": [
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
        ]
    }
]

# Insert properties
inserted = 0
for prop in properties:
    host = random.choice(hosts)
    images_json = json.dumps(prop["images"])
    
    try:
        cursor.execute("""
            INSERT INTO listings (
                host_id, title, description, property_type, room_type,
                location, latitude, longitude, price_per_night, max_guests,
                bedrooms, beds, bathrooms, images, rating, review_count,
                is_active, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            host[0],
            prop["title"],
            f"Beautiful {prop['property_type']} with amazing features. Perfect for your next stay!",
            prop["property_type"],
            prop["room_type"],
            prop["location"],
            random.uniform(25.0, 48.0),
            random.uniform(-125.0, -65.0),
            prop["price"],
            prop["max_guests"],
            prop["bedrooms"],
            prop["beds"],
            prop["bathrooms"],
            images_json,
            round(random.uniform(4.0, 5.0), 1),
            0,
            1,
            datetime.now().isoformat(),
            datetime.now().isoformat()
        ))
        inserted += 1
        print(f"✅ Added: {prop['title']}")
    except Exception as e:
        print(f"❌ Error adding {prop['title']}: {e}")

conn.commit()
conn.close()

# Count new listings
conn = sqlite3.connect('acreage.db')
cursor = conn.cursor()
cursor.execute("SELECT COUNT(*) FROM listings")
new_count = cursor.fetchone()[0]
conn.close()

print(f"\n🎉 Successfully added {inserted} new properties!")
print(f"📊 Total listings now available: {new_count}")
