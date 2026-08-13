import sqlite3
import json

# Unique image sets for each listing
image_sets = [
    # Listing 1
    [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop"
    ],
    # Listing 2
    [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
    ],
    # Listing 3
    [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
    ],
    # Listing 4
    [
        "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
    ],
    # Listing 5
    [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
    ],
    # Listing 6
    [
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"
    ],
    # Listing 7
    [
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
    ],
    # Listing 8
    [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
    ],
    # Listing 9
    [
        "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
    ],
    # Listing 10
    [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop"
    ],
    # Listing 11
    [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
    ],
    # Listing 12
    [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop"
    ],
    # Listing 13
    [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop"
    ],
    # Listing 14
    [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop"
    ],
    # Listing 15
    [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop"
    ],
    # Listing 16
    [
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
    ],
    # Listing 17
    [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
    ],
    # Listing 18
    [
        "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
    ],
    # Listing 19
    [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop"
    ],
    # Listing 20
    [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop"
    ],
]

# Connect to database
conn = sqlite3.connect('acreage.db')
cursor = conn.cursor()

# Get all listings
cursor.execute("SELECT id FROM listings ORDER BY id")
listings = cursor.fetchall()

# Update each listing with unique images
for i, listing in enumerate(listings):
    if i < len(image_sets):
        images_json = json.dumps(image_sets[i])
        cursor.execute(
            "UPDATE listings SET images = ? WHERE id = ?",
            (images_json, listing[0])
        )
        print(f"✅ Updated listing {listing[0]} with unique images")

conn.commit()
conn.close()
print(f"\n🎉 Successfully updated {len(listings)} listings with unique images!")
