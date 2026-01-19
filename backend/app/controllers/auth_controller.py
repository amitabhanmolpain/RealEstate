from app import bcrypt
from app.models.user_model import User
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta


MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15


def _serialize_user(user):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
    }


def _is_account_locked(user):
    """Check if account is locked and still within lockout period."""
    if user.locked_until is None:
        return False
    
    if datetime.utcnow() < user.locked_until:
        return True
    
    # Lockout period expired, unlock the account
    user.locked_until = None
    user.failed_login_attempts = 0
    user.save()
    return False


def _reset_login_attempts(user):
    """Reset failed login attempts on successful login."""
    user.failed_login_attempts = 0
    user.locked_until = None
    user.save()


def _increment_failed_attempts(user):
    """Increment failed login attempts and lock if necessary."""
    user.failed_login_attempts += 1
    
    if user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS:
        user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
    
    user.save()


def register_user(data):
    required = ["name", "email", "password"]
    if not all(data.get(field) for field in required):
        return {"message": "Name, email, and password are required"}, 400

    email = data["email"].lower().strip()

    if User.objects(email=email).first():
        return {"message": "User already exists"}, 409

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user = User(
        name=data["name"].strip(),
        email=email,
        password=hashed_password,
    )

    user.save()

    token = create_access_token(identity=str(user.id), additional_claims={"email": user.email, "name": user.name})

    return {
        "message": "User registered successfully",
        "token": token,
        "user": _serialize_user(user),
    }, 201


def login_user(data):
    if not data.get("email") or not data.get("password"):
        return {"message": "Email and password are required"}, 400

    email = data["email"].lower().strip()
    user = User.objects(email=email).first()

    if not user:
        return {"message": "User not found"}, 404

    # Check if account is locked
    if _is_account_locked(user):
        remaining_time = (user.locked_until - datetime.utcnow()).total_seconds() / 60
        return {
            "message": f"Account locked. Try again in {int(remaining_time)} minutes.",
            "locked": True,
            "remaining_minutes": int(remaining_time),
        }, 403

    # Verify password
    if not bcrypt.check_password_hash(user.password, data["password"]):
        _increment_failed_attempts(user)
        remaining_attempts = MAX_LOGIN_ATTEMPTS - user.failed_login_attempts
        
        if user.locked_until is not None:
            return {
                "message": f"Account locked after {MAX_LOGIN_ATTEMPTS} failed attempts. Try again in {LOCKOUT_DURATION_MINUTES} minutes.",
                "locked": True,
                "remaining_minutes": LOCKOUT_DURATION_MINUTES,
            }, 403
        
        return {
            "message": f"Invalid credentials. {remaining_attempts} attempt(s) remaining.",
            "attempts_remaining": remaining_attempts,
        }, 401

    # Successful login
    _reset_login_attempts(user)
    token = create_access_token(identity=str(user.id), additional_claims={"email": user.email, "name": user.name})

    return {
        "message": "Login successful",
        "token": token,
        "user": _serialize_user(user),
    }
