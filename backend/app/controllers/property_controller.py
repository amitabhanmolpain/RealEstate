from app.models.property_model import Property
from datetime import datetime


ITEMS_PER_PAGE = 12


def _serialize_property(prop):
    """Convert Property document to JSON-serializable dict."""
    return {
        "id": str(prop.id),
        "title": prop.title,
        "description": prop.description,
        "location": prop.location,
        "city": prop.city,
        "property_type": prop.property_type,
        "price": prop.price,
        "area": prop.area,
        "bedrooms": prop.bedrooms,
        "bathrooms": prop.bathrooms,
        "image": prop.image,
        "images": getattr(prop, 'images', []) or [],
        "amenities": prop.amenities,
        "featured": prop.featured,
        "verified": prop.verified,
        "available": prop.available,
        "status": getattr(prop, 'status', 'Active'),
        "likes_count": getattr(prop, 'likes_count', 0),
        "interests_count": getattr(prop, 'interests_count', 0),
        "visits_count": getattr(prop, 'visits_count', 0),
        "views_count": getattr(prop, 'views_count', 0),
        "seller_id": str(prop.seller_id) if getattr(prop, 'seller_id', None) else None,
        "seller_name": getattr(prop, 'seller_name', None),
        "seller_email": getattr(prop, 'seller_email', None),
        "seller_phone": getattr(prop, 'seller_phone', None),
        "posted_date": prop.posted_date.isoformat() if prop.posted_date else None,
    }


def get_all_properties(page=1, city=None, property_type=None, min_price=None, max_price=None):
    """Get paginated properties with optional filters."""
    page = max(1, int(page))
    skip = (page - 1) * ITEMS_PER_PAGE
    
    # Build filter query
    query = Property.objects(available=True)
    
    if city:
        query = query(city=city)
    
    if property_type:
        query = query(property_type=property_type)
    
    if min_price is not None:
        query = query(price__gte=int(min_price))
    
    if max_price is not None:
        query = query(price__lte=int(max_price))
    
    # Get total count
    total_count = query.count()
    total_pages = (total_count + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE
    
    # Get paginated results, sorted by featured first, then by posted date
    properties = query.order_by('-featured', '-posted_date').skip(skip).limit(ITEMS_PER_PAGE)
    
    return {
        "properties": [_serialize_property(p) for p in properties],
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items_per_page": ITEMS_PER_PAGE,
        }
    }


def get_featured_properties(limit=6):
    """Get featured properties."""
    properties = Property.objects(featured=True, available=True).order_by('-posted_date').limit(limit)
    return [_serialize_property(p) for p in properties]


def get_property_by_id(property_id):
    """Get a single property by ID."""
    try:
        prop = Property.objects(id=property_id).first()
        if not prop:
            return {"message": "Property not found"}, 404
        return {"property": _serialize_property(prop)}, 200
    except Exception as e:
        return {"message": str(e)}, 400


def create_property(data):
    """Create a new property (Admin only)."""
    required_fields = ["title", "description", "location", "city", "property_type", 
                      "price", "area", "bedrooms", "bathrooms", "image"]
    
    if not all(data.get(field) for field in required_fields):
        return {"message": "Missing required fields"}, 400
    
    try:
        prop = Property(
            title=data["title"].strip(),
            description=data["description"].strip(),
            location=data["location"].strip(),
            city=data["city"].strip(),
            property_type=data["property_type"].strip(),
            price=int(data["price"]),
            area=int(data["area"]),
            bedrooms=int(data["bedrooms"]),
            bathrooms=int(data["bathrooms"]),
            image=data["image"].strip(),
            amenities=data.get("amenities", []),
            featured=data.get("featured", False),
            verified=data.get("verified", False),
        )
        prop.save()
        
        return {
            "message": "Property created successfully",
            "property": _serialize_property(prop),
        }, 201
    except Exception as e:
        return {"message": f"Error creating property: {str(e)}"}, 400


def update_property(property_id, data):
    """Update a property (Admin only)."""
    try:
        prop = Property.objects(id=property_id).first()
        if not prop:
            return {"message": "Property not found"}, 404
        
        # Update fields
        prop.title = data.get("title", prop.title).strip()
        prop.description = data.get("description", prop.description).strip()
        prop.location = data.get("location", prop.location).strip()
        prop.city = data.get("city", prop.city).strip()
        prop.property_type = data.get("property_type", prop.property_type).strip()
        prop.price = int(data.get("price", prop.price))
        prop.area = int(data.get("area", prop.area))
        prop.bedrooms = int(data.get("bedrooms", prop.bedrooms))
        prop.bathrooms = int(data.get("bathrooms", prop.bathrooms))
        prop.image = data.get("image", prop.image).strip()
        prop.amenities = data.get("amenities", prop.amenities)
        prop.featured = data.get("featured", prop.featured)
        prop.verified = data.get("verified", prop.verified)
        prop.available = data.get("available", prop.available)
        prop.updated_date = datetime.utcnow()
        
        prop.save()
        
        return {
            "message": "Property updated successfully",
            "property": _serialize_property(prop),
        }, 200
    except Exception as e:
        return {"message": f"Error updating property: {str(e)}"}, 400


def delete_property(property_id):
    """Delete a property (Admin only)."""
    try:
        prop = Property.objects(id=property_id).first()
        if not prop:
            return {"message": "Property not found"}, 404
        
        prop.delete()
        return {"message": "Property deleted successfully"}, 200
    except Exception as e:
        return {"message": f"Error deleting property: {str(e)}"}, 400
