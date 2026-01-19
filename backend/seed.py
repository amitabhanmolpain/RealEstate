"""
Seed script to populate database with initial properties.
Run this once to load all properties into MongoDB.
"""
from app import create_app
from app.models.property_model import Property
from datetime import datetime

# Sample properties data from the frontend
PROPERTIES_DATA = [
    {
        "title": "3 BHK Luxury Apartment in Bandra West",
        "location": "Bandra West, Mumbai, Maharashtra",
        "city": "Mumbai",
        "price": 45000000,
        "bedrooms": 3,
        "bathrooms": 3,
        "area": 1450,
        "property_type": "Apartment",
        "image": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
        "description": "Premium apartment with sea view, modern amenities, and prime location",
        "amenities": ["Gym", "Swimming Pool", "Security", "Parking"],
        "featured": True,
        "verified": True,
    },
    {
        "title": "4 BHK Villa in Whitefield",
        "location": "Whitefield, Bangalore, Karnataka",
        "city": "Bangalore",
        "price": 32000000,
        "bedrooms": 4,
        "bathrooms": 4,
        "area": 2800,
        "property_type": "Villa",
        "image": "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800",
        "description": "Spacious villa with garden, in tech hub area with excellent connectivity",
        "amenities": ["Garden", "Parking", "Security", "Club House"],
        "featured": True,
        "verified": True,
    },
    {
        "title": "2 BHK Flat in Connaught Place",
        "location": "Connaught Place, New Delhi",
        "city": "Delhi",
        "price": 28000000,
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 1200,
        "property_type": "Apartment",
        "image": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
        "description": "Central location, walking distance to metro, premium construction",
        "amenities": ["Lift", "Power Backup", "Security"],
        "featured": False,
        "verified": True,
    },
    {
        "title": "2 BHK Apartment in Mira Road",
        "location": "Mira Road, Mumbai, Maharashtra",
        "city": "Mumbai",
        "price": 4500000,
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 850,
        "property_type": "Apartment",
        "image": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
        "description": "Affordable housing with metro connectivity, ready to move",
        "amenities": ["Lift", "Parking", "Security"],
        "featured": False,
        "verified": True,
    },
    {
        "title": "1 BHK Flat in Electronic City",
        "location": "Electronic City, Bangalore, Karnataka",
        "city": "Bangalore",
        "price": 3200000,
        "bedrooms": 1,
        "bathrooms": 1,
        "area": 600,
        "property_type": "Apartment",
        "image": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
        "description": "Compact flat near IT parks, ideal for working professionals",
        "amenities": ["Lift", "Security", "Power Backup"],
        "featured": False,
        "verified": False,
    },
    {
        "title": "2 BHK Row House in Naigaon",
        "location": "Naigaon, Mumbai, Maharashtra",
        "city": "Mumbai",
        "price": 3800000,
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 950,
        "property_type": "Row House",
        "image": "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800",
        "description": "Independent row house with small terrace, peaceful locality",
        "amenities": ["Parking", "Security", "Terrace"],
        "featured": False,
        "verified": True,
    },
    {
        "title": "3 BHK Apartment in JP Nagar",
        "location": "JP Nagar, Bangalore, Karnataka",
        "city": "Bangalore",
        "price": 5800000,
        "bedrooms": 3,
        "bathrooms": 3,
        "area": 1400,
        "property_type": "Apartment",
        "image": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
        "description": "Modern 3BHK in residential area with good schools nearby",
        "amenities": ["Gym", "Parking", "Security", "Club House"],
        "featured": False,
        "verified": True,
    },
    {
        "title": "Luxury Penthouse in South Delhi",
        "location": "Greater Kailash, New Delhi",
        "city": "Delhi",
        "price": 52000000,
        "bedrooms": 4,
        "bathrooms": 4,
        "area": 3200,
        "property_type": "Penthouse",
        "image": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
        "description": "Ultra-luxurious penthouse with private terrace and rooftop",
        "amenities": ["Gym", "Swimming Pool", "Security", "Parking", "Terrace"],
        "featured": True,
        "verified": True,
    },
]


def seed_database():
    """Populate database with initial properties."""
    app = create_app()
    
    with app.app_context():
        # Clear existing properties
        Property.objects.delete()
        print("✓ Cleared existing properties")
        
        # Add new properties
        for prop_data in PROPERTIES_DATA:
            prop = Property(**prop_data)
            prop.save()
        
        total = Property.objects.count()
        print(f"✓ Seeded database with {total} properties")
        
        # Print summary
        print("\nProperty Summary:")
        print(f"  Total: {total}")
        print(f"  Featured: {Property.objects(featured=True).count()}")
        print(f"  Verified: {Property.objects(verified=True).count()}")


if __name__ == "__main__":
    seed_database()
