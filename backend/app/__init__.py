from flask import Flask, jsonify
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from mongoengine import connect
import logging
from .config import Config

api = Api()
jwt = JWTManager()
bcrypt = Bcrypt()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure CORS - allow frontend origins from environment or defaults
    allowed_origins = Config.CORS_ORIGINS
    logger.info(f"CORS configured for origins: {allowed_origins}")
    
    CORS(app, 
         origins=allowed_origins,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
         supports_credentials=True,
         expose_headers=["Content-Type", "Authorization"]
    )

    # Connect MongoDB with error handling
    try:
        connect(host=Config.MONGO_URI)
        logger.info("MongoDB connection successful")
        app.mongodb_connected = True
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        # Store error state but don't fail startup - allows graceful error responses
        app.mongodb_connected = False

    api.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    from .routes.auth_routes import auth_bp
    from .routes.property_routes import property_bp
    from .routes.likes_routes import likes_bp
    from .routes.seller_routes import seller_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(property_bp)
    app.register_blueprint(likes_bp)
    app.register_blueprint(seller_bp)

    # Error handlers for production
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": "Unauthorized"}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Forbidden"}), 403

    # Health check endpoint
    @app.route("/health", methods=["GET"])
    def health():
        db_status = "connected" if app.mongodb_connected else "disconnected"
        return jsonify({
            "status": "ok",
            "database": db_status,
            "environment": Config.ENV
        }), 200

    # Root endpoint with API info
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "status": "ok",
            "message": "Real Estate API is running",
            "version": "1.0.0",
            "environment": Config.ENV,
            "endpoints": {
                "health": "/health",
                "auth": "/auth/register, /auth/login",
                "properties": "/properties",
                "likes": "/likes",
                "sellers": "/sellers"
            }
        }), 200

    return app
