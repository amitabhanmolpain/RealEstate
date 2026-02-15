from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.likes_controller import (
    like_property,
    unlike_property,
    get_user_liked_properties,
    check_liked_properties,
)

likes_bp = Blueprint("likes", __name__)


@likes_bp.route("/likes/properties/<property_id>", methods=["POST", "OPTIONS"])
@jwt_required()
def like_property_route(property_id):
    """Like a property."""
    user_id = get_jwt_identity()
    result, status = like_property(user_id, property_id)
    return jsonify(result), status


@likes_bp.route("/likes/properties/<property_id>", methods=["DELETE", "OPTIONS"])
@jwt_required()
def unlike_property_route(property_id):
    """Unlike a property."""
    user_id = get_jwt_identity()
    result, status = unlike_property(user_id, property_id)
    return jsonify(result), status


@likes_bp.route("/likes/properties", methods=["GET", "OPTIONS"])
@jwt_required()
def user_liked_properties_route():
    """Get all properties liked by user."""
    user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    result, status = get_user_liked_properties(user_id, page)
    return jsonify(result), status


@likes_bp.route("/likes/check", methods=["GET", "OPTIONS"])
@jwt_required()
def check_liked_properties_route():
    """Get list of liked property IDs."""
    user_id = get_jwt_identity()
    result, status = check_liked_properties(user_id)
    return jsonify(result), status
