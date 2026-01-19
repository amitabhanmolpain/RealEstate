from app.models.property_model import Property, ScheduledVisit, PropertyInterest
from app.models.user_model import User
from bson import ObjectId
from datetime import datetime


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
        "images": prop.images if hasattr(prop, 'images') and prop.images else [],
        "amenities": prop.amenities,
        "featured": prop.featured,
        "verified": prop.verified,
        "available": prop.available,
        "status": prop.status if hasattr(prop, 'status') else 'Active',
        "likes_count": prop.likes_count if hasattr(prop, 'likes_count') else 0,
        "interests_count": prop.interests_count if hasattr(prop, 'interests_count') else 0,
        "visits_count": prop.visits_count if hasattr(prop, 'visits_count') else 0,
        "views_count": prop.views_count if hasattr(prop, 'views_count') else 0,
        "seller_id": str(prop.seller_id) if prop.seller_id else None,
        "seller_name": prop.seller_name if hasattr(prop, 'seller_name') else None,
        "posted_date": prop.posted_date.isoformat() if prop.posted_date else None,
    }


def _serialize_visit(visit):
    """Convert ScheduledVisit document to JSON-serializable dict."""
    # Extract address from notes if present
    visit_address = ""
    if visit.notes and "Pickup Address:" in visit.notes:
        visit_address = visit.notes.replace("Pickup Address:", "").strip()
    
    return {
        "id": str(visit.id),
        "property_id": str(visit.property_id),
        "user_id": str(visit.user_id),
        "visitor_name": visit.visitor_name,
        "visitor_email": visit.visitor_email,
        "visitor_phone": visit.visitor_phone,
        "visit_date": visit.visit_date.isoformat() if visit.visit_date else None,
        "visit_time": visit.visit_time,
        "visit_address": visit_address,
        "status": visit.status,
        "notes": visit.notes,
        "created_at": visit.created_at.isoformat() if visit.created_at else None,
    }


def _serialize_interest(interest):
    """Convert PropertyInterest document to JSON-serializable dict."""
    return {
        "id": str(interest.id),
        "property_id": str(interest.property_id),
        "user_id": str(interest.user_id),
        "user_name": interest.user_name,
        "user_email": interest.user_email,
        "user_phone": interest.user_phone,
        "message": interest.message,
        "interest_type": interest.interest_type,
        "status": interest.status,
        "created_at": interest.created_at.isoformat() if interest.created_at else None,
    }


# ===== SELLER PROPERTY MANAGEMENT =====

def create_seller_property(seller_id, data):
    """Create a new property listing for a seller."""
    required_fields = ["title", "description", "location", "city", "property_type", 
                      "price", "area", "bedrooms", "bathrooms", "image"]
    
    if not all(data.get(field) for field in required_fields):
        return {"message": "Missing required fields"}, 400
    
    try:
        # Get seller info
        seller = User.objects(id=seller_id).first()
        if not seller:
            return {"message": "Seller not found"}, 404
        
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
            images=data.get("images", []),  # Additional images
            amenities=data.get("amenities", []),
            seller_id=ObjectId(seller_id),
            seller_name=seller.name,
            seller_email=seller.email,
            seller_phone=data.get("seller_phone", ""),
            featured=False,  # Sellers can't set featured
            verified=False,  # Requires admin verification
            status='Active',
        )
        prop.save()
        
        return {
            "message": "Property listed successfully",
            "property": _serialize_property(prop),
        }, 201
    except Exception as e:
        return {"message": f"Error creating property: {str(e)}"}, 400


def get_seller_properties(seller_id):
    """Get all properties listed by a seller."""
    try:
        properties = Property.objects(seller_id=ObjectId(seller_id)).order_by('-posted_date')
        return {
            "properties": [_serialize_property(p) for p in properties],
            "count": properties.count()
        }, 200
    except Exception as e:
        return {"message": f"Error fetching properties: {str(e)}"}, 400


def update_seller_property(seller_id, property_id, data):
    """Update a seller's property listing."""
    try:
        prop = Property.objects(id=property_id, seller_id=ObjectId(seller_id)).first()
        if not prop:
            return {"message": "Property not found or you don't have permission"}, 404
        
        # Update allowed fields
        if "title" in data:
            prop.title = data["title"].strip()
        if "description" in data:
            prop.description = data["description"].strip()
        if "location" in data:
            prop.location = data["location"].strip()
        if "city" in data:
            prop.city = data["city"].strip()
        if "property_type" in data:
            prop.property_type = data["property_type"].strip()
        if "price" in data:
            prop.price = int(data["price"])
        if "area" in data:
            prop.area = int(data["area"])
        if "bedrooms" in data:
            prop.bedrooms = int(data["bedrooms"])
        if "bathrooms" in data:
            prop.bathrooms = int(data["bathrooms"])
        if "image" in data:
            prop.image = data["image"].strip()
        if "images" in data:
            prop.images = data["images"]
        if "amenities" in data:
            prop.amenities = data["amenities"]
        if "available" in data:
            prop.available = data["available"]
        if "status" in data:
            prop.status = data["status"]
        if "seller_phone" in data:
            prop.seller_phone = data["seller_phone"]
            
        prop.updated_date = datetime.utcnow()
        prop.save()
        
        return {
            "message": "Property updated successfully",
            "property": _serialize_property(prop),
        }, 200
    except Exception as e:
        return {"message": f"Error updating property: {str(e)}"}, 400


def delete_seller_property(seller_id, property_id):
    """Delete a seller's property listing."""
    try:
        prop = Property.objects(id=property_id, seller_id=ObjectId(seller_id)).first()
        if not prop:
            return {"message": "Property not found or you don't have permission"}, 404
        
        # Also delete related visits and interests
        ScheduledVisit.objects(property_id=ObjectId(property_id)).delete()
        PropertyInterest.objects(property_id=ObjectId(property_id)).delete()
        
        prop.delete()
        return {"message": "Property deleted successfully"}, 200
    except Exception as e:
        return {"message": f"Error deleting property: {str(e)}"}, 400


# ===== SELLER DASHBOARD & INSIGHTS =====

def get_seller_dashboard_stats(seller_id):
    """Get dashboard statistics for a seller."""
    try:
        seller_oid = ObjectId(seller_id)
        
        # Count properties
        total_properties = Property.objects(seller_id=seller_oid).count()
        active_properties = Property.objects(seller_id=seller_oid, status='Active').count()
        
        # Calculate total likes across all seller's properties
        properties = Property.objects(seller_id=seller_oid)
        total_likes = sum(p.likes_count if hasattr(p, 'likes_count') else 0 for p in properties)
        total_views = sum(p.views_count if hasattr(p, 'views_count') else 0 for p in properties)
        
        # Count interests
        total_interests = PropertyInterest.objects(seller_id=seller_oid).count()
        new_interests = PropertyInterest.objects(seller_id=seller_oid, status='New').count()
        
        # Count scheduled visits
        total_visits = ScheduledVisit.objects(seller_id=seller_oid).count()
        pending_visits = ScheduledVisit.objects(seller_id=seller_oid, status='Pending').count()
        confirmed_visits = ScheduledVisit.objects(seller_id=seller_oid, status='Confirmed').count()
        
        return {
            "stats": {
                "total_properties": total_properties,
                "active_properties": active_properties,
                "total_likes": total_likes,
                "total_views": total_views,
                "total_interests": total_interests,
                "new_interests": new_interests,
                "total_visits": total_visits,
                "pending_visits": pending_visits,
                "confirmed_visits": confirmed_visits,
            }
        }, 200
    except Exception as e:
        return {"message": f"Error fetching stats: {str(e)}"}, 400


def get_seller_recent_activity(seller_id, limit=10):
    """Get recent activity for a seller (visits, interests, etc.)."""
    try:
        seller_oid = ObjectId(seller_id)
        activities = []
        
        # Get recent interests
        interests = PropertyInterest.objects(seller_id=seller_oid).order_by('-created_at').limit(limit)
        for interest in interests:
            prop = Property.objects(id=interest.property_id).first()
            activities.append({
                "type": "interest",
                "user_name": interest.user_name,
                "property_title": prop.title if prop else "Unknown Property",
                "property_id": str(interest.property_id),
                "created_at": interest.created_at.isoformat() if interest.created_at else None,
                "message": interest.message,
            })
        
        # Get recent scheduled visits
        visits = ScheduledVisit.objects(seller_id=seller_oid).order_by('-created_at').limit(limit)
        for visit in visits:
            prop = Property.objects(id=visit.property_id).first()
            activities.append({
                "type": "visit",
                "user_name": visit.visitor_name,
                "property_title": prop.title if prop else "Unknown Property",
                "property_id": str(visit.property_id),
                "created_at": visit.created_at.isoformat() if visit.created_at else None,
                "visit_date": visit.visit_date.isoformat() if visit.visit_date else None,
                "visit_time": visit.visit_time,
                "status": visit.status,
            })
        
        # Sort by created_at descending
        activities.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return {"activities": activities[:limit]}, 200
    except Exception as e:
        return {"message": f"Error fetching activity: {str(e)}"}, 400


# ===== SCHEDULED VISITS MANAGEMENT =====

def schedule_visit(user_id, property_id, data):
    """Schedule a visit for a property."""
    try:
        # Get property and verify it exists
        prop = Property.objects(id=property_id).first()
        if not prop:
            return {"message": "Property not found"}, 404
        
        # Get user info
        user = User.objects(id=user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        # Check if user already has a pending visit for this property
        existing = ScheduledVisit.objects(
            property_id=ObjectId(property_id),
            user_id=ObjectId(user_id),
            status__in=['Pending', 'Confirmed']
        ).first()
        if existing:
            return {"message": "You already have a scheduled visit for this property"}, 400
        
        visit = ScheduledVisit(
            property_id=ObjectId(property_id),
            user_id=ObjectId(user_id),
            seller_id=prop.seller_id,
            visitor_name=data.get("visitor_name", user.name),
            visitor_email=data.get("visitor_email", user.email),
            visitor_phone=data.get("visitor_phone", ""),
            visit_date=datetime.fromisoformat(data["visit_date"]),
            visit_time=data["visit_time"],
            notes=data.get("notes", ""),
            status='Pending',
        )
        visit.save()
        
        # Update property visits count
        prop.visits_count = (prop.visits_count or 0) + 1
        prop.save()
        
        return {
            "message": "Visit scheduled successfully",
            "visit": _serialize_visit(visit),
        }, 201
    except Exception as e:
        return {"message": f"Error scheduling visit: {str(e)}"}, 400


def get_seller_visits(seller_id, status=None):
    """Get all scheduled visits for a seller's properties."""
    try:
        query = ScheduledVisit.objects(seller_id=ObjectId(seller_id))
        if status:
            query = query(status=status)
        
        visits = query.order_by('-visit_date')
        
        # Enrich with property info
        result = []
        for visit in visits:
            visit_data = _serialize_visit(visit)
            prop = Property.objects(id=visit.property_id).first()
            if prop:
                visit_data["property_title"] = prop.title
                visit_data["property_image"] = prop.image
                visit_data["property_location"] = prop.location
            result.append(visit_data)
        
        return {"visits": result, "count": len(result)}, 200
    except Exception as e:
        return {"message": f"Error fetching visits: {str(e)}"}, 400


def update_visit_status(seller_id, visit_id, status):
    """Update visit status (Confirm, Complete, Cancel)."""
    try:
        visit = ScheduledVisit.objects(id=visit_id, seller_id=ObjectId(seller_id)).first()
        if not visit:
            return {"message": "Visit not found or you don't have permission"}, 404
        
        valid_statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
        if status not in valid_statuses:
            return {"message": f"Invalid status. Must be one of: {valid_statuses}"}, 400
        
        visit.status = status
        visit.updated_at = datetime.utcnow()
        visit.save()
        
        return {
            "message": f"Visit {status.lower()}",
            "visit": _serialize_visit(visit),
        }, 200
    except Exception as e:
        return {"message": f"Error updating visit: {str(e)}"}, 400


def get_user_visits(user_id):
    """Get all visits scheduled by a user."""
    try:
        visits = ScheduledVisit.objects(user_id=ObjectId(user_id)).order_by('-visit_date')
        
        result = []
        for visit in visits:
            visit_data = _serialize_visit(visit)
            prop = Property.objects(id=visit.property_id).first()
            if prop:
                visit_data["property_title"] = prop.title
                visit_data["property_image"] = prop.image
                visit_data["property_location"] = prop.location
            result.append(visit_data)
        
        return {"visits": result, "count": len(result)}, 200
    except Exception as e:
        return {"message": f"Error fetching visits: {str(e)}"}, 400


# ===== PROPERTY INTEREST MANAGEMENT =====

def express_interest(user_id, property_id, data):
    """Express interest in a property."""
    try:
        # Get property and verify it exists
        prop = Property.objects(id=property_id).first()
        if not prop:
            return {"message": "Property not found"}, 404
        
        # Get user info
        user = User.objects(id=user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        # Check if user already expressed interest
        existing = PropertyInterest.objects(
            property_id=ObjectId(property_id),
            user_id=ObjectId(user_id)
        ).first()
        if existing:
            return {"message": "You have already expressed interest in this property"}, 400
        
        interest = PropertyInterest(
            property_id=ObjectId(property_id),
            user_id=ObjectId(user_id),
            seller_id=prop.seller_id,
            user_name=user.name,
            user_email=user.email,
            user_phone=data.get("phone", ""),
            message=data.get("message", ""),
            interest_type=data.get("interest_type", "General"),
            status='New',
        )
        interest.save()
        
        # Update property interests count
        prop.interests_count = (prop.interests_count or 0) + 1
        prop.save()
        
        return {
            "message": "Interest registered successfully",
            "interest": _serialize_interest(interest),
        }, 201
    except Exception as e:
        return {"message": f"Error expressing interest: {str(e)}"}, 400


def get_seller_interests(seller_id, status=None):
    """Get all interests for a seller's properties."""
    try:
        query = PropertyInterest.objects(seller_id=ObjectId(seller_id))
        if status:
            query = query(status=status)
        
        interests = query.order_by('-created_at')
        
        # Enrich with property info
        result = []
        for interest in interests:
            interest_data = _serialize_interest(interest)
            prop = Property.objects(id=interest.property_id).first()
            if prop:
                interest_data["property_title"] = prop.title
                interest_data["property_image"] = prop.image
                interest_data["property_location"] = prop.location
            result.append(interest_data)
        
        return {"interests": result, "count": len(result)}, 200
    except Exception as e:
        return {"message": f"Error fetching interests: {str(e)}"}, 400


def update_interest_status(seller_id, interest_id, status):
    """Update interest status."""
    try:
        interest = PropertyInterest.objects(id=interest_id, seller_id=ObjectId(seller_id)).first()
        if not interest:
            return {"message": "Interest not found or you don't have permission"}, 404
        
        valid_statuses = ['New', 'Contacted', 'Closed']
        if status not in valid_statuses:
            return {"message": f"Invalid status. Must be one of: {valid_statuses}"}, 400
        
        interest.status = status
        interest.save()
        
        return {
            "message": f"Interest marked as {status.lower()}",
            "interest": _serialize_interest(interest),
        }, 200
    except Exception as e:
        return {"message": f"Error updating interest: {str(e)}"}, 400


# ===== PROPERTY VIEW TRACKING =====

def increment_property_view(property_id):
    """Increment view count for a property."""
    try:
        prop = Property.objects(id=property_id).first()
        if prop:
            prop.views_count = (prop.views_count or 0) + 1
            prop.save()
        return {"success": True}, 200
    except Exception as e:
        return {"message": str(e)}, 400


# ===== LIKE COUNT SYNC =====

def update_property_likes_count(property_id, increment=True):
    """Update the likes count on a property."""
    try:
        prop = Property.objects(id=property_id).first()
        if prop:
            if increment:
                prop.likes_count = (prop.likes_count or 0) + 1
            else:
                prop.likes_count = max(0, (prop.likes_count or 0) - 1)
            prop.save()
        return True
    except:
        return False
