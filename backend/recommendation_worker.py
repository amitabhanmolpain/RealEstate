"""
Recommendation service utilities.
Generates and stores recommendations directly without any message broker.
"""

import logging
import os
from datetime import datetime
from typing import Dict, List

from bson import ObjectId
from dotenv import load_dotenv
from mongoengine import DateTimeField, Document, ListField, ObjectIdField, StringField, connect

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


class Recommendation(Document):
    """Stores personalized property recommendations for a user."""

    user_id = ObjectIdField(required=True)
    liked_property_id = ObjectIdField(required=True)
    liked_property_title = StringField(required=True)
    recommended_properties = ListField(default=[])
    match_criteria = StringField(default='type_location_price')
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'recommendations',
        'indexes': ['user_id', 'liked_property_id', 'created_at'],
        'strict': False,
    }


class RecommendationService:
    """Generates and persists recommendations after a user likes a property."""

    def __init__(self, mongodb_uri: str | None = None):
        self.mongodb_uri = mongodb_uri or os.getenv(
            'MONGODB_URI',
            'mongodb://localhost:27017/real_estate',
        )
        self._init_mongodb()

    def _init_mongodb(self) -> None:
        try:
            connect(
                host=self.mongodb_uri,
                connect=False,
                serverSelectionTimeoutMS=5000,
            )
            logger.info('MongoDB connected: %s', self.mongodb_uri)
        except Exception as exc:
            logger.error('Failed to connect to MongoDB: %s', str(exc))

    def find_similar_properties(self, liked_property: Dict) -> List[str]:
        try:
            from app.models.property_model import Property

            property_type = liked_property.get('property_type', '')
            location = liked_property.get('location', '')
            price = liked_property.get('price', 0)
            liked_property_id = liked_property.get('property_id', '')

            price_tolerance = price * 0.20
            min_price = price - price_tolerance
            max_price = price + price_tolerance

            query = Property.objects(property_type=property_type)

            try:
                liked_id = ObjectId(liked_property_id)
                query = query(id__ne=liked_id)
            except Exception as exc:
                logger.warning('Invalid property ID format: %s', str(exc))

            query = query(price__gte=min_price, price__lte=max_price)

            if location:
                query = query(location=location)

            recommendations = query.order_by('-featured', '-likes_count').limit(5)
            recommended_ids = [str(prop.id) for prop in recommendations]

            logger.info(
                'Found %s similar properties for type=%s, location=%s, price=%s',
                len(recommended_ids),
                property_type,
                location,
                price,
            )
            return recommended_ids

        except Exception as exc:
            logger.error('Error finding similar properties: %s', str(exc))
            return []

    def store_recommendation(
        self,
        user_id: str,
        liked_property: Dict,
        recommended_property_ids: List[str],
    ) -> bool:
        try:
            recommendation = Recommendation(
                user_id=ObjectId(user_id),
                liked_property_id=ObjectId(liked_property.get('property_id', '')),
                liked_property_title=liked_property.get('property_title', ''),
                recommended_properties=recommended_property_ids,
                match_criteria='type_location_price',
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            recommendation.save()

            logger.info(
                'Stored %s recommendations for user %s',
                len(recommended_property_ids),
                user_id,
            )
            return True

        except Exception as exc:
            logger.error('Error storing recommendations: %s', str(exc))
            return False

    def process_like_event(self, event_data: Dict) -> bool:
        user_id = event_data.get('user_id')
        if not user_id:
            logger.warning('Skipping recommendation generation: missing user_id')
            return False

        similar_properties = self.find_similar_properties(event_data)
        if not similar_properties:
            logger.info('No similar properties found for user %s', user_id)
            return False

        return self.store_recommendation(user_id, event_data, similar_properties)


def generate_recommendations_for_like(event_data: Dict) -> bool:
    """Entry point used by controllers to generate recommendations immediately."""
    service = RecommendationService(mongodb_uri=os.getenv('MONGODB_URI'))
    return service.process_like_event(event_data)
