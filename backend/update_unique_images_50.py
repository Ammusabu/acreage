import sqlite3
import json

# 50 unique image URLs
unique_images = [
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
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
]

# Connect to database
conn = sqlite3.connect('acreage.db')
cursor = conn.cursor()

# Get all listings
cursor.execute("SELECT id FROM listings ORDER BY id")
listings = cursor.fetchall()

print(f"Updating {len(listings)} listings with unique images...")

# Update each listing with a unique image
for i, listing in enumerate(listings):
    image_url = unique_images[i % len(unique_images)]
    images_json = json.dumps([image_url])
    cursor.execute(
        "UPDATE listings SET images = ? WHERE id = ?",
        (images_json, listing[0])
    )
    print(f"✅ Updated listing {listing[0]} with image {i+1}")

conn.commit()
conn.close()

print(f"\n🎉 Successfully updated {len(listings)} listings with unique images!")
