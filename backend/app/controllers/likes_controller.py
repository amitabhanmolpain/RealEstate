from app.models.user_model import User
from app.models.property_model import Property
from bson import ObjectId
import logging

# Import direct recommendation service (no message queue)
try:
    from recommendation_worker import generate_recommendations_for_like
    recommendation_service_available = True
except ImportError:
    recommendation_service_available = False
    logging.warning("Recommendation service not available. Recommendations will not be generated.")

logger = logging.getLogger(__name__)


def like_property(user_id, property_id):
    """Add a property to user's liked list and generate recommendations directly."""
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
            
            # Generate recommendations immediately after a successful like
            if recommendation_service_available:
                try:
                    generate_recommendations_for_like({
                        user_id=str(user_id),
                        property_id=str(prop_id),
                        property_title=prop.title,
                        property_type=prop.property_type,
                        location=prop.location,
                        price=prop.price
                    })
                    logger.info(f"Generated recommendations for property: {prop.title}")
                except Exception as e:
                    # Log error but don't fail the like operation if recommendation generation fails
                    logger.error(f"Failed to generate recommendations: {str(e)}")
        
        return {
            "message": "Property added to interests",
            "liked_count": len(user.liked_properties),
            "property_id": str(prop_id),
        }, 200
    except Exception as e:
        logger.error(f"Like error: {str(e)}")
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


def get_recommendations(user_id, page=1):
    """Get personalized property recommendations for a user."""
    try:
        from bson import ObjectId as BsonObjectId
        
        # Try to import Recommendation model
        try:
            from recommendation_worker import Recommendation
        except ImportError:
            return {
                "recommendations": [],
                "message": "Recommendation system not available",
                "pagination": {
                    "current_page": 1,
                    "total_pages": 0,
                    "total_items": 0,
                    "items_per_page": 12,
                }
            }, 200
        
        # Fetch recommendations for this user
        ITEMS_PER_PAGE = 12
        skip = (page - 1) * ITEMS_PER_PAGE
        
        user_obj_id = BsonObjectId(user_id)
        recommendations = Recommendation.objects(user_id=user_obj_id).skip(skip).limit(ITEMS_PER_PAGE)
        total_count = Recommendation.objects(user_id=user_obj_id).count()
        total_pages = (total_count + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE
        
        # Build response with recommended property details
        from app.controllers.property_controller import _serialize_property
        
        recommendations_list = []
        for rec in recommendations:
            # Get the liked property details
            liked_prop = Property.objects(id=rec.liked_property_id).first()
            
            # Get the recommended properties
            recommended_props = []
            if rec.recommended_properties:
                for prop_id in rec.recommended_properties:
                    try:
                        prop = Property.objects(id=BsonObjectId(prop_id)).first()
                        if prop:
                            recommended_props.append(_serialize_property(prop))
                    except Exception as e:
                        logger.warning(f"Could not fetch property {prop_id}: {str(e)}")
            
            rec_dict = {
                "id": str(rec.id),
                "liked_property": {
                    "id": str(rec.liked_property_id),
                    "title": rec.liked_property_title,
                    "type": rec.match_criteria,
                },
                "recommended_properties": recommended_props,
                "created_at": rec.created_at.isoformat() if rec.created_at else None,
            }
            recommendations_list.append(rec_dict)
        
        return {
            "recommendations": recommendations_list,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_items": total_count,
                "items_per_page": ITEMS_PER_PAGE,
            }
        }, 200
    
    except Exception as e:
        logger.error(f"Get recommendations error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"message": f"Error: {str(e)}"}, 500
