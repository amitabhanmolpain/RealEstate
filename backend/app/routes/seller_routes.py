from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.seller_controller import (
    # Property management
    create_seller_property,
    get_seller_properties,
    update_seller_property,
    delete_seller_property,
    # Dashboard & insights
    get_seller_dashboard_stats,
    get_seller_recent_activity,
    # Visits
    schedule_visit,
    get_seller_visits,
    update_visit_status,
    get_user_visits,
    # Interests
    express_interest,
    get_seller_interests,
    update_interest_status,
    # Views
    increment_property_view,
)

seller_bp = Blueprint("seller", __name__)
api = Api(seller_bp)


# ===== SELLER PROPERTY MANAGEMENT =====

class SellerProperties(Resource):
    @jwt_required()
    def get(self):
        """Get all properties listed by the current seller."""
        seller_id = get_jwt_identity()
        result, status = get_seller_properties(seller_id)
        return result, status
    
    @jwt_required()
    def post(self):
        """Create a new property listing."""
        seller_id = get_jwt_identity()
        data = request.get_json()
        result, status = create_seller_property(seller_id, data)
        return result, status


class SellerPropertyDetail(Resource):
    @jwt_required()
    def put(self, property_id):
        """Update a seller's property."""
        seller_id = get_jwt_identity()
        data = request.get_json()
        result, status = update_seller_property(seller_id, property_id, data)
        return result, status
    
    @jwt_required()
    def delete(self, property_id):
        """Delete a seller's property."""
        seller_id = get_jwt_identity()
        result, status = delete_seller_property(seller_id, property_id)
        return result, status


# ===== SELLER DASHBOARD =====

class SellerDashboard(Resource):
    @jwt_required()
    def get(self):
        """Get seller dashboard statistics."""
        seller_id = get_jwt_identity()
        result, status = get_seller_dashboard_stats(seller_id)
        return result, status


class SellerActivity(Resource):
    @jwt_required()
    def get(self):
        """Get seller's recent activity."""
        seller_id = get_jwt_identity()
        limit = request.args.get("limit", 10, type=int)
        result, status = get_seller_recent_activity(seller_id, limit)
        return result, status


# ===== SCHEDULED VISITS =====

class ScheduleVisit(Resource):
    @jwt_required()
    def post(self, property_id):
        """Schedule a visit for a property."""
        user_id = get_jwt_identity()
        data = request.get_json()
        result, status = schedule_visit(user_id, property_id, data)
        return result, status


class SellerVisits(Resource):
    @jwt_required()
    def get(self):
        """Get all visits scheduled for seller's properties."""
        seller_id = get_jwt_identity()
        status_filter = request.args.get("status", type=str)
        result, status = get_seller_visits(seller_id, status_filter)
        return result, status


class SellerVisitStatus(Resource):
    @jwt_required()
    def put(self, visit_id):
        """Update visit status (confirm, complete, cancel)."""
        seller_id = get_jwt_identity()
        data = request.get_json()
        new_status = data.get("status")
        result, status = update_visit_status(seller_id, visit_id, new_status)
        return result, status


class UserVisits(Resource):
    @jwt_required()
    def get(self):
        """Get all visits scheduled by the current user."""
        user_id = get_jwt_identity()
        result, status = get_user_visits(user_id)
        return result, status


# ===== PROPERTY INTERESTS =====

class ExpressInterest(Resource):
    @jwt_required()
    def post(self, property_id):
        """Express interest in a property."""
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        result, status = express_interest(user_id, property_id, data)
        return result, status


class SellerInterests(Resource):
    @jwt_required()
    def get(self):
        """Get all interests for seller's properties."""
        seller_id = get_jwt_identity()
        status_filter = request.args.get("status", type=str)
        result, status = get_seller_interests(seller_id, status_filter)
        return result, status


class SellerInterestStatus(Resource):
    @jwt_required()
    def put(self, interest_id):
        """Update interest status."""
        seller_id = get_jwt_identity()
        data = request.get_json()
        new_status = data.get("status")
        result, status = update_interest_status(seller_id, interest_id, new_status)
        return result, status


# ===== PROPERTY VIEWS =====

class PropertyView(Resource):
    def post(self, property_id):
        """Track a property view."""
        result, status = increment_property_view(property_id)
        return result, status


# ===== REGISTER ROUTES =====

# Seller property management
api.add_resource(SellerProperties, "/seller/properties")
api.add_resource(SellerPropertyDetail, "/seller/properties/<property_id>")

# Seller dashboard
api.add_resource(SellerDashboard, "/seller/dashboard")
api.add_resource(SellerActivity, "/seller/activity")

# Scheduled visits (seller view)
api.add_resource(SellerVisits, "/seller/visits")
api.add_resource(SellerVisitStatus, "/seller/visits/<visit_id>")

# Schedule visit (user action)
api.add_resource(ScheduleVisit, "/properties/<property_id>/schedule-visit")
api.add_resource(UserVisits, "/user/visits")

# Property interests (seller view)
api.add_resource(SellerInterests, "/seller/interests")
api.add_resource(SellerInterestStatus, "/seller/interests/<interest_id>")

# Express interest (user action)
api.add_resource(ExpressInterest, "/properties/<property_id>/interest")

# Property views tracking
api.add_resource(PropertyView, "/properties/<property_id>/view")
