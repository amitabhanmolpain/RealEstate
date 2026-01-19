import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-secret-key-change-in-production")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/real_estate")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)  # Token valid for 7 days
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
