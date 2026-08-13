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

# Indian properties with diverse types and locations
india_properties = [
    # Goa - Beach Properties
    {
        "title": "Luxury Beachfront Villa in Goa",
        "location": "Goa, India",
        "property_type": "Beach House",
        "room_type": "entire_home",
        "price": 25000,
        "max_guests": 8,
        "bedrooms": 4,
        "beds": 5,
        "bathrooms": 3.0,
        "images": [
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Cozy Beach Cottage with Pool",
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
    
    # Himachal Pradesh - Mountain Properties
    {
        "title": "Wooden Cottage with Himalayan Views",
        "location": "Manali, Himachal Pradesh",
        "property_type": "Cabin",
        "room_type": "entire_home",
        "price": 18000,
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.0,
        "images": [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Luxury Chalet in Shimla",
        "location": "Shimla, Himachal Pradesh",
        "property_type": "Chalet",
        "room_type": "entire_home",
        "price": 22000,
        "max_guests": 8,
        "bedrooms": 4,
        "beds": 4,
        "bathrooms": 2.5,
        "images": [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
        ]
    },
    
    # Rajasthan - Luxury Properties
    {
        "title": "Heritage Haveli in Jaipur",
        "location": "Jaipur, Rajasthan",
        "property_type": "Villa",
        "room_type": "entire_home",
        "price": 32000,
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
    {
        "title": "Luxury Villa in Udaipur with Lake View",
        "location": "Udaipur, Rajasthan",
        "property_type": "Villa",
        "room_type": "entire_home",
        "price": 28000,
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
    
    # Kerala - Backwater Properties
    {
        "title": "Luxury Houseboat in Alleppey",
        "location": "Alleppey, Kerala",
        "property_type": "Houseboat",
        "room_type": "entire_home",
        "price": 20000,
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.0,
        "images": [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Villa with Private Pool in Munnar",
        "location": "Munnar, Kerala",
        "property_type": "Villa",
        "room_type": "entire_home",
        "price": 25000,
        "max_guests": 8,
        "bedrooms": 4,
        "beds": 4,
        "bathrooms": 3.0,
        "images": [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
        ]
    },
    
    # Delhi NCR - City Properties
    {
        "title": "Modern Apartment in Gurugram",
        "location": "Gurugram, Haryana",
        "property_type": "Apartment",
        "room_type": "entire_home",
        "price": 10000,
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
        "title": "Luxury Apartment in South Delhi",
        "location": "New Delhi, India",
        "property_type": "Apartment",
        "room_type": "entire_home",
        "price": 15000,
        "max_guests": 5,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.0,
        "images": [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"
        ]
    },
    
    # Uttarakhand - Mountain Properties
    {
        "title": "Cozy Cottage in Mussoorie",
        "location": "Mussoorie, Uttarakhand",
        "property_type": "Cottage",
        "room_type": "entire_home",
        "price": 12000,
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 1.5,
        "images": [
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Luxury Villa in Rishikesh",
        "location": "Rishikesh, Uttarakhand",
        "property_type": "Villa",
        "room_type": "entire_home",
        "price": 18000,
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.0,
        "images": [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
        ]
    },
    
    # Punjab - City Properties
    {
        "title": "Farmhouse in Chandigarh",
        "location": "Chandigarh, India",
        "property_type": "Farmhouse",
        "room_type": "entire_home",
        "price": 22000,
        "max_guests": 10,
        "bedrooms": 5,
        "beds": 6,
        "bathrooms": 3.5,
        "images": [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Luxury Apartment in Amritsar",
        "location": "Amritsar, Punjab",
        "property_type": "Apartment",
        "room_type": "entire_home",
        "price": 8000,
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
    
    # Maharashtra - City & Beach Properties
    {
        "title": "Beachfront Villa in Alibaug",
        "location": "Alibaug, Maharashtra",
        "property_type": "Beach House",
        "room_type": "entire_home",
        "price": 20000,
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
        "title": "Luxury Apartment in Mumbai",
        "location": "Mumbai, Maharashtra",
        "property_type": "Apartment",
        "room_type": "entire_home",
        "price": 18000,
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2.0,
        "images": [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"
        ]
    },
    
    # Tamil Nadu - Temple City Properties
    {
        "title": "Heritage Home in Madurai",
        "location": "Madurai, Tamil Nadu",
        "property_type": "Villa",
        "room_type": "entire_home",
        "price": 10000,
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.0,
        "images": [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
        ]
    },
    {
        "title": "Apartment with Temple View",
        "location": "Chennai, Tamil Nadu",
        "property_type": "Apartment",
        "room_type": "entire_home",
        "price": 7000,
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
    
    # West Bengal - Heritage Properties
    {
        "title": "Colonial Bungalow in Darjeeling",
        "location": "Darjeeling, West Bengal",
        "property_type": "Bungalow",
        "room_type": "entire_home",
        "price": 14000,
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2.0,
        "images": [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
        ]
    }
]

# Insert properties
inserted = 0
for prop in india_properties:
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
            f"Beautiful {prop['property_type']} in {prop['location']}. Perfect for your next stay!",
            prop["property_type"],
            prop["room_type"],
            prop["location"],
            random.uniform(8.0, 34.0),  # India latitude range
            random.uniform(68.0, 88.0),  # India longitude range
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
        print(f"✅ Added: {prop['title']} ({prop['location']})")
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

print(f"\n🎉 Successfully added {inserted} new Indian properties!")
print(f"📊 Total listings now available: {new_count}")
print(f"\n📍 Added properties across India:")
print("   - Goa (Beach properties)")
print("   - Himachal Pradesh (Mountain properties)")
print("   - Rajasthan (Heritage & Luxury)")
print("   - Kerala (Backwater & Villas)")
print("   - Delhi NCR (City apartments)")
print("   - Uttarakhand (Mountain cottages)")
print("   - Punjab (Farmhouses & apartments)")
print("   - Maharashtra (Beach & City)")
print("   - Tamil Nadu (Heritage homes)")
print("   - West Bengal (Colonial bungalows)")
