from app.models.user_model import User
from app.models.property_model import Property
from bson import ObjectId


def like_property(user_id, property_id):
    """Add a property to user's liked list."""
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        # Convert to ObjectId - property_id comes as string from URL
        try:
            prop_id = ObjectId(property_id)
        except Exception:
            return {"message": "Invalid property ID format"}, 400
        
        # Check if property exists
        prop = Property.objects(id=prop_id).first()
        if not prop:
            return {"message": "Property not found"}, 404
        
        # Add to liked properties if not already there
        if prop_id not in user.liked_properties:
            user.liked_properties.append(prop_id)
            user.save()
            
            # Update property likes count
            prop.likes_count = (getattr(prop, 'likes_count', 0) or 0) + 1
            prop.save()
        
        return {
            "message": "Property added to interests",
            "liked_count": len(user.liked_properties),
            "property_id": str(prop_id),
        }, 200
    except Exception as e:
        print(f"Like error: {str(e)}")
        return {"message": f"Error: {str(e)}"}, 500


def unlike_property(user_id, property_id):
    """Remove a property from user's liked list."""
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        # Convert to ObjectId - property_id comes as string from URL
        try:
            prop_id = ObjectId(property_id)
        except Exception:
            return {"message": "Invalid property ID format"}, 400
        
        if prop_id in user.liked_properties:
            user.liked_properties.remove(prop_id)
            user.save()
            
            # Update property likes count
            prop = Property.objects(id=prop_id).first()
            if prop:
                prop.likes_count = max(0, (getattr(prop, 'likes_count', 0) or 0) - 1)
                prop.save()
        
        return {
            "message": "Property removed from interests",
            "liked_count": len(user.liked_properties),
            "property_id": str(prop_id),
        }, 200
    except Exception as e:
        print(f"Unlike error: {str(e)}")
        return {"message": f"Error: {str(e)}"}, 500


def get_user_liked_properties(user_id, page=1):
    """Get all properties liked by a user with pagination."""
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        liked_ids = user.liked_properties
        
        if not liked_ids:
            return {
                "properties": [],
                "pagination": {
                    "current_page": 1,
                    "total_pages": 0,
                    "total_items": 0,
                    "items_per_page": 12,
                }
            }, 200
        
        # Get properties
        ITEMS_PER_PAGE = 12
        skip = (page - 1) * ITEMS_PER_PAGE
        
        properties = Property.objects(id__in=liked_ids).skip(skip).limit(ITEMS_PER_PAGE)
        total_count = len(liked_ids)
        total_pages = (total_count + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE
        
        from app.controllers.property_controller import _serialize_property
        
        return {
            "properties": [_serialize_property(p) for p in properties],
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_items": total_count,
                "items_per_page": ITEMS_PER_PAGE,
            }
        }, 200
    except Exception as e:
        return {"message": f"Error: {str(e)}"}, 400


def check_liked_properties(user_id):
    """Get list of property IDs that user has liked."""
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        liked_ids = [str(pid) for pid in user.liked_properties]
        return {
            "liked_properties": liked_ids,
            "count": len(liked_ids),
        }, 200
    except Exception as e:
        print(f"Check liked error: {str(e)}")
        return {"message": f"Error: {str(e)}"}, 500
