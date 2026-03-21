import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    """Base configuration - suitable for development and production."""

    # Environment
    ENV = os.getenv("FLASK_ENV", "production")
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    # Server Configuration
    HOST = os.getenv("FLASK_HOST", "0.0.0.0")  # Bind to all interfaces for EC2
    PORT = int(os.getenv("FLASK_PORT", 5000))

    # Security - CRITICAL: These must be set in production via environment variables
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY and ENV == "production":
        raise ValueError(
            "CRITICAL: JWT_SECRET_KEY environment variable must be set in production. "
            "Generate with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
        )
    if not JWT_SECRET_KEY:
        # Only for development
        JWT_SECRET_KEY = "dev-key-change-in-production"

    # Database Configuration
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/real_estate")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "real_estate")

    # JWT Configuration
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # CORS Configuration - Production: load from environment
    _cors_origins_raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://localhost:5000"
    )
    CORS_ORIGINS = [origin.strip() for origin in _cors_origins_raw.split(",")]

    # API Configuration
    API_VERSION = "1.0.0"
    JSON_SORT_KEYS = False  # Don't sort JSON keys for performance
    JSONIFY_PRETTYPRINT_REGULAR = False  # Minimize JSON output in production

    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    @classmethod
    def from_env(cls):
        """Load configuration from environment - useful for validation."""
        return cls()
