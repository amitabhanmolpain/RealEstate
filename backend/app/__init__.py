from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from mongoengine import connect
from .config import Config

api = Api()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure CORS with comprehensive settings for all routes
    CORS(app, 
         origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
         supports_credentials=True,
         expose_headers=["Content-Type", "Authorization"]
    )

    # Connect MongoDB
    connect(host=Config.MONGO_URI)

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

    @app.route("/")
    def index():
        return {
            "status": "ok",
            "message": "API is running",
            "auth_endpoints": ["/auth/register", "/auth/login"],
        }

    @app.route("/health")
    def health():
        return {"status": "healthy"}

    return app
