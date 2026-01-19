from mongoengine import Document, StringField, IntField, FloatField, ListField, BooleanField, DateTimeField, ObjectIdField, ReferenceField
from datetime import datetime


class Property(Document):
    # Basic Info
    title = StringField(required=True)
    description = StringField(required=True)
    location = StringField(required=True)
    city = StringField(required=True)
    
    # Property Details
    property_type = StringField(required=True)  # Apartment, Villa, Row House, etc.
    price = IntField(required=True)
    area = IntField(required=True)  # in sq ft
    bedrooms = IntField(required=True)
    bathrooms = IntField(required=True)
    
    # Media
    image = StringField(required=True)  # Main/primary image
    images = ListField(StringField(), default=[])  # Additional images
    
    # Amenities
    amenities = ListField(StringField(), default=[])
    
    # Seller Info
    seller_id = ObjectIdField(required=False)  # Reference to User who listed this property
    seller_name = StringField(required=False)
    seller_email = StringField(required=False)
    seller_phone = StringField(required=False)
    
    # Status
    featured = BooleanField(default=False)
    verified = BooleanField(default=False)
    available = BooleanField(default=True)
    status = StringField(default='Active')  # Active, Pending, Sold, Inactive
    
    # Stats - cached counts for performance
    likes_count = IntField(default=0)
    interests_count = IntField(default=0)
    visits_count = IntField(default=0)
    views_count = IntField(default=0)
    
    # Dates
    posted_date = DateTimeField(default=datetime.utcnow)
    updated_date = DateTimeField(default=datetime.utcnow)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'properties',
        'indexes': ['city', 'property_type', 'posted_date', 'featured', 'seller_id']
    }


class ScheduledVisit(Document):
    """Track scheduled property visits"""
    property_id = ObjectIdField(required=True)
    user_id = ObjectIdField(required=True)  # User who scheduled the visit
    seller_id = ObjectIdField(required=True)  # Property owner
    
    # Visit details
    visitor_name = StringField(required=True)
    visitor_email = StringField(required=True)
    visitor_phone = StringField(required=False)
    
    # Schedule
    visit_date = DateTimeField(required=True)
    visit_time = StringField(required=True)  # e.g., "10:00 AM"
    
    # Status
    status = StringField(default='Pending')  # Pending, Confirmed, Completed, Cancelled
    notes = StringField(required=False)
    
    # Dates
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'scheduled_visits',
        'indexes': ['property_id', 'user_id', 'seller_id', 'visit_date', 'status']
    }


class PropertyInterest(Document):
    """Track users who expressed interest in a property"""
    property_id = ObjectIdField(required=True)
    user_id = ObjectIdField(required=True)  # User who is interested
    seller_id = ObjectIdField(required=True)  # Property owner
    
    # User info
    user_name = StringField(required=True)
    user_email = StringField(required=True)
    user_phone = StringField(required=False)
    
    # Interest details
    message = StringField(required=False)  # Optional message from interested user
    interest_type = StringField(default='General')  # General, Serious, Inquiry
    
    # Status
    status = StringField(default='New')  # New, Contacted, Closed
    
    # Dates
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'property_interests',
        'indexes': ['property_id', 'user_id', 'seller_id', 'status'],
        'ordering': ['-created_at']
    }
