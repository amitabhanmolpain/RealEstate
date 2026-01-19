from flask import Blueprint, request
from flask_restful import Api, Resource
from app.controllers.property_controller import (
    get_all_properties,
    get_featured_properties,
    get_property_by_id,
    create_property,
    update_property,
    delete_property,
)

property_bp = Blueprint("properties", __name__)
api = Api(property_bp)


class Properties(Resource):
    def get(self):
        """Get paginated properties with optional filters."""
        page = request.args.get("page", 1, type=int)
        city = request.args.get("city", type=str)
        property_type = request.args.get("type", type=str)
        min_price = request.args.get("minPrice", type=int)
        max_price = request.args.get("maxPrice", type=int)
        
        result = get_all_properties(
            page=page,
            city=city,
            property_type=property_type,
            min_price=min_price,
            max_price=max_price,
        )
        return result, 200
    
    def post(self):
        """Create a new property (Admin only)."""
        data = request.get_json()
        result, status = create_property(data)
        return result, status


class PropertyDetail(Resource):
    def get(self, property_id):
        """Get a single property by ID."""
        result, status = get_property_by_id(property_id)
        return result, status
    
    def put(self, property_id):
        """Update a property (Admin only)."""
        data = request.get_json()
        result, status = update_property(property_id, data)
        return result, status
    
    def delete(self, property_id):
        """Delete a property (Admin only)."""
        result, status = delete_property(property_id)
        return result, status


class FeaturedProperties(Resource):
    def get(self):
        """Get featured properties."""
        limit = request.args.get("limit", 6, type=int)
        properties = get_featured_properties(limit=limit)
        return {"properties": properties}, 200


# Register resources
api.add_resource(Properties, "/properties")
api.add_resource(PropertyDetail, "/properties/<property_id>")
api.add_resource(FeaturedProperties, "/properties/featured")
