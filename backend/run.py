#!/usr/bin/env python
"""
Real Estate API Entry Point

For Production (AWS EC2):
    Use Gunicorn to run the app:
    gunicorn -w 4 -b 0.0.0.0:5000 app:app

For Development:
    python run.py
    
Environment Variables:
    FLASK_ENV          - Set to 'production' for production (default: development)
    FLASK_HOST         - Host to bind to (default: 0.0.0.0)
    FLASK_PORT         - Port to listen on (default: 5000)
    JWT_SECRET_KEY     - REQUIRED for production
    MONGO_URI          - MongoDB connection string
    CORS_ORIGINS       - Comma-separated list of allowed origins
"""

import os
import sys
import logging
from app import create_app
from app.config import Config

# Configure logging
logging.basicConfig(
    level=getattr(logging, Config.LOG_LEVEL, logging.INFO),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def create_app_instance():
    """Create and return Flask app instance."""
    app = create_app()
    return app


# Create app instance - Gunicorn will import and use this
app = create_app_instance()


if __name__ == "__main__":
    """Development server only - NOT for production."""
    
    # Log environment
    logger.info(f"Starting Real Estate API")
    logger.info(f"Environment: {Config.ENV}")
    logger.info(f"Debug Mode: {Config.DEBUG}")
    logger.info(f"Binding to: {Config.HOST}:{Config.PORT}")
    logger.info(f"MongoDB URI: {Config.MONGO_URI}")
    
    # Security warning for production
    if Config.ENV == "production" and Config.DEBUG:
        logger.warning("WARNING: Running in PRODUCTION with DEBUG=True. This is NOT recommended.")
    
    if Config.ENV == "development":
        logger.warning(
            "Running in DEVELOPMENT mode.\n"
            "For production deployment on EC2, use:\n"
            "  gunicorn -w 4 -b 0.0.0.0:5000 app:app"
        )
    
    # Run development server
    try:
        # Windows + Python 3.13 can raise WinError 10038 when the reloader spins threads.
        # Disable the reloader to avoid the socket select error while keeping debug logs.
        app.run(
            host=Config.HOST,
            port=Config.PORT,
            debug=Config.DEBUG,
            use_reloader=False,
            use_debugger=False
        )
    except KeyboardInterrupt:
        logger.info("Server shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        sys.exit(1)
