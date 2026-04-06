"""
Authentication Routes for SafeGuard Flask Backend
Add these routes to your existing app.py file or import this module
"""

import os
import hashlib
import secrets
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, request, jsonify, session

# Create Blueprint for auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# ==========================================
# UPDATED DATABASE MODEL FOR AUTHENTICATION
# ==========================================
# Add these fields to your existing User model in app.py:
#
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     phone = db.Column(db.String(20))
#     password_hash = db.Column(db.String(256), nullable=False)
#     is_verified = db.Column(db.Boolean, default=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     last_login = db.Column(db.DateTime)
#     last_otp_sent = db.Column(db.DateTime)
#     contacts = db.relationship('EmergencyContact', backref='owner', lazy=True)


def hash_password(password: str, salt: str = None) -> tuple:
    """Hash password using SHA-256 with salt"""
    if salt is None:
        salt = secrets.token_hex(16)
    
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    
    return f"{salt}${password_hash}", salt


def verify_password(password: str, stored_hash: str) -> bool:
    """Verify password against stored hash"""
    try:
        salt, hash_value = stored_hash.split('$')
        new_hash, _ = hash_password(password, salt)
        return new_hash == stored_hash
    except ValueError:
        return False


def login_required(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function


# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Request body:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91 9876543210",  (optional)
        "password": "securepassword"
    }
    """
    # Import db and User model from main app
    from app import db, User
    
    try:
        data = request.get_json()
        
        # Validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')
        
        if not name:
            return jsonify({'error': 'Name is required'}), 400
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        if not password or len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Hash password
        password_hash, _ = hash_password(password)
        
        # Create new user
        new_user = User(
            name=name,
            email=email,
            phone=phone,
            password_hash=password_hash,
            is_verified=True,  # Set to False if you want email verification
            created_at=datetime.utcnow()
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Registration successful',
            'user': {
                'id': new_user.id,
                'name': new_user.name,
                'email': new_user.email
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ REGISTER ERROR: {e}")
        return jsonify({'error': 'Registration failed. Please try again.'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user
    
    Request body:
    {
        "email": "john@example.com",
        "password": "securepassword"
    }
    """
    # Import db and User model from main app
    from app import db, User
    
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not verify_password(password, user.password_hash):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Set session
        session['user_id'] = user.id
        session['user_email'] = user.email
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone
            }
        }), 200
        
    except Exception as e:
        print(f"❌ LOGIN ERROR: {e}")
        return jsonify({'error': 'Login failed. Please try again.'}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged-in user info"""
    from app import User
    
    try:
        user = User.query.get(session['user_id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone
            }
        }), 200
        
    except Exception as e:
        print(f"❌ GET USER ERROR: {e}")
        return jsonify({'error': 'Failed to get user info'}), 500


@auth_bp.route('/update-profile', methods=['PUT'])
@login_required
def update_profile():
    """Update user profile"""
    from app import db, User
    
    try:
        data = request.get_json()
        user = User.query.get(session['user_id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update fields
        if 'name' in data and data['name'].strip():
            user.name = data['name'].strip()
        
        if 'phone' in data:
            user.phone = data['phone'].strip()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ UPDATE PROFILE ERROR: {e}")
        return jsonify({'error': 'Failed to update profile'}), 500


@auth_bp.route('/change-password', methods=['POST'])
@login_required
def change_password():
    """Change user password"""
    from app import db, User
    
    try:
        data = request.get_json()
        
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current and new passwords are required'}), 400
        
        if len(new_password) < 6:
            return jsonify({'error': 'New password must be at least 6 characters'}), 400
        
        user = User.query.get(session['user_id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify current password
        if not verify_password(current_password, user.password_hash):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Hash new password
        new_hash, _ = hash_password(new_password)
        user.password_hash = new_hash
        
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ CHANGE PASSWORD ERROR: {e}")
        return jsonify({'error': 'Failed to change password'}), 500