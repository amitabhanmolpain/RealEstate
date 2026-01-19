from mongoengine import Document, StringField, IntField, DateTimeField, ListField, ObjectIdField
from datetime import datetime

class User(Document):
    name = StringField(required=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    failed_login_attempts = IntField(default=0)
    locked_until = DateTimeField(default=None)
    created_at = DateTimeField(default=datetime.utcnow)
    
    # User interests/liked properties
    liked_properties = ListField(ObjectIdField(), default=[])
