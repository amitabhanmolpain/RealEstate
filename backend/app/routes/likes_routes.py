from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.likes_controller import (
    like_property,
    unlike_property,
    get_user_liked_properties,
    check_liked_properties,
)

likes_bp = Blueprint("likes", __name__)
api = Api(likes_bp)


class LikeProperty(Resource):
    @jwt_required()
    def post(self, property_id):
        """Like a property."""
        user_id = get_jwt_identity()
        result, status = like_property(user_id, property_id)
        return result, status


class UnlikeProperty(Resource):
    @jwt_required()
    def delete(self, property_id):
        """Unlike a property."""
        user_id = get_jwt_identity()
        result, status = unlike_property(user_id, property_id)
        return result, status


class UserLikedProperties(Resource):
    @jwt_required()
    def get(self):
        """Get all properties liked by user."""
        user_id = get_jwt_identity()
        page = request.args.get("page", 1, type=int)
        result, status = get_user_liked_properties(user_id, page)
        return result, status


class CheckLikedProperties(Resource):
    @jwt_required()
    def get(self):
        """Get list of liked property IDs."""
        user_id = get_jwt_identity()
        result, status = check_liked_properties(user_id)
        return result, status


# Register resources
api.add_resource(LikeProperty, "/likes/properties/<property_id>", methods=["POST"])
api.add_resource(UnlikeProperty, "/likes/properties/<property_id>", methods=["DELETE"])
api.add_resource(UserLikedProperties, "/likes/properties")
api.add_resource(CheckLikedProperties, "/likes/check")
