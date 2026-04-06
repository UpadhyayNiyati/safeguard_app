"""
SafeGuard Flask Backend with Authentication
Complete backend with login/register functionality
"""

import os
import random
import smtplib
import requests
import hashlib
import secrets
from datetime import datetime, timedelta
from email.message import EmailMessage
from functools import wraps
from flask import Flask, jsonify, redirect, render_template, request, session, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity , JWTManager
from flask_jwt_extended import create_access_token
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from geopy.distance import geodesic
from flask_migrate import Migrate
from dotenv import load_dotenv



# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")





CORS(
    app,
    supports_credentials=True,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    }
)


# Database Configuration
DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///safeguard_new.db')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY" , "dev-secret-key-123")

app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_PERMANENT'] = True

app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 280}
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

db = SQLAlchemy(app)

migrate = Migrate(app, db)

jwt = JWTManager(app)

search_history = []


# ==========================================
# DATABASE MODELS
# ==========================================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), default='user')
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(256), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    otp = db.Column(db.String(6), nullable=True)
    otp_expiry = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    last_otp_sent = db.Column(db.DateTime)
    contacts = db.relationship('EmergencyContact', backref='owner', lazy=True)


class EmergencyContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    relationship = db.Column(db.String(50))
    email = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class SafetyLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Alert Triggered")

class SearchHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    service_type = db.Column(db.String(50))
    search_address = db.Column(db.String(200))
    found_service_name = db.Column(db.String(200))
    found_service_address = db.Column(db.String(200))
    distance_km = db.Column(db.Float)
    found_service_phone = db.Column(db.String(20))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    device_info = db.Column(db.String(255))
    user_lat = db.Column(db.Float)
    user_lon = db.Column(db.Float)


class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist' # Explicit table name
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    token_type = db.Column(db.String(10), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    revoked = db.Column(db.Boolean, default=False, nullable=False)
    expires = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)



# Initialize database tables
with app.app_context():
    db.create_all()




# ==========================================
# HELPER FUNCTIONS
# ==========================================

# def hash_password(password: str, salt: str = None) -> tuple:
#     """Hash password using SHA-256 with salt"""
#     if salt is None:
#         salt = secrets.token_hex(16)
    
#     password_hash = hashlib.pbkdf2_hmac(
#         'sha256',
#         password.encode('utf-8'),
#         salt.encode('utf-8'),
#         100000
#     ).hex()
    
#     return f"{salt}${password_hash}", salt


# def verify_password(password: str, stored_hash: str) -> bool:
#     """Verify password against stored hash"""
#     try:
#         salt, hash_value = stored_hash.split('$')
#         new_hash, _ = hash_password(password, salt)
#         return new_hash == stored_hash
#     except ValueError:
#         return False

import hashlib
import secrets

def hash_pw(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)

    hpw = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode(),
        salt.encode(),
        100000
    ).hex()

    return f"{salt}${hpw}"


def verify_pw(password, stored_hash):
    salt, stored_hpw = stored_hash.split('$')

    # Recreate hash using same salt
    new_hash = hash_pw(password, salt)

    return new_hash == stored_hash


# Check if a token is in the blocklist or revoked
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    # If token not found or marked as revoked, return True (blocks access)
    return token is not None and token.revoked is True

# def login_required(f):
#     """Decorator to require authentication"""
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         print(f"Current Session: {session}")
#         if 'user_id' not in session:
#             return jsonify({'error': 'Authentication required'}), 401
#         return f(*args, **kwargs)
#     return decorated_function

from flask_jwt_extended import verify_jwt_in_request

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()  # ✅ validates token

        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin privileges required'}), 403

        return f(*args, **kwargs)
    return decorated_function


def send_email(receiver_email, subject, body):
    """Sends an email using SMTP settings from .env file."""
    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['From'] = os.getenv('MAIL_USERNAME')
    msg['To'] = receiver_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.getenv('MAIL_USERNAME'), os.getenv('MAIL_PASSWORD'))
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"❌ EMAIL ERROR: {e}")
        return False


def get_nearest_amenity(lat, lon, amenity_type="police"):
    """Queries Overpass API for the nearest amenity within 50km."""
    url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="{amenity_type}"](around:50000,{lat},{lon});
      way["amenity"="{amenity_type}"](around:50000,{lat},{lon});
      relation["amenity"="{amenity_type}"](around:50000,{lat},{lon});
    );
    out center;
    """
    try:
        headers = {"User-Agent": "SafetyApp/1.0"}
        res = requests.post(url, data=query, headers=headers, timeout=30)
        
        if res.status_code != 200:
            return None

        data = res.json()
        places = []

        for e in data.get("elements", []):
            p_lat = e.get("lat") or e.get("center", {}).get("lat")
            p_lon = e.get("lon") or e.get("center", {}).get("lon")
            if not p_lat or not p_lon:
                continue

            tags = e.get("tags", {})
            name = tags.get("name", f"Nearest {amenity_type.capitalize()}")
            phone = tags.get("phone") or tags.get("contact:phone", "Not available")
            dist = geodesic((lat, lon), (p_lat, p_lon)).km

            places.append({
                "name": name,
                "lat": p_lat,
                "lon": p_lon,
                "dist": dist,
                "phone": phone
            })

        return min(places, key=lambda x: x["dist"]) if places else None

    except Exception as e:
        print(f"❌ OVERPASS API ERROR: {e}")
        return None
    
# ================================
# SEARCH HISTORY ROUTES (NEW)
# ================================

from sqlalchemy import func

@app.route('/api/admin/search-stats', methods=['GET'])
@admin_required
def get_search_stats():
    """
    Returns a breakdown of how many times each service 
    has been searched across the entire platform.
    """
    try:
        # Group by service_type and count them
        stats = db.session.query(
            SearchHistory.service_type, 
            func.count(SearchHistory.id)
        ).group_by(SearchHistory.service_type).all()

        # Format: {"police": 15, "hospital": 8, ...}
        results = {service: count for service, count in stats}
        
        return jsonify({
            "status": "success",
            "search_counts": results,
            "total_searches": sum(results.values())
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==========================================
# AI & SEARCH LOGIC
# ==========================================

@app.route("/api/ai/analyze-severity", methods=["POST"])
# @jwt_required()
def analyze_severity():
    data = request.json
    desc = data.get('description', '').lower()
    
    critical_keywords = ['unconscious', 'bleeding', 'heart', 'breathing', 'fire']
    severity = "High" if any(k in desc for k in critical_keywords) else "Medium"
    
    return jsonify({
        "severity": severity,
        "action": "Dispatching nearest unit" if severity == "High" else "Monitor situation"
    })
    
@app.route('/api/admin/detailed-history', methods=['GET'])
@admin_required
def get_detailed_history():
    # Use a Join to get the user's name alongside the search
    query = db.session.query(SearchHistory, User).outerjoin(User, SearchHistory.user_id == User.id)
    
    results = query.order_by(SearchHistory.timestamp.desc()).all()

    return jsonify([
        {
            "search_id": s.id,
            "user_name": u.name if u else "Guest/Anonymous",
            "service": s.service_type,
            "found_name": s.found_service_name,
            "distance": s.distance_km,
            "time": s.timestamp.strftime('%Y-%m-%d %H:%M')
        } for s, u in results
    ]), 200

@app.route('/api/search-history', methods=['GET'])
@jwt_required()
def get_search_history():
    user_id = get_jwt_identity()

    records = SearchHistory.query.filter_by(user_id=user_id).all()

    return jsonify({
        "records": [{
            "id": r.id,
            "service_type": r.service_type,
            "distance": r.distance_km,
            "timestamp": r.timestamp.isoformat()
        } for r in records]
    })

@app.route('/api/search-history', methods=['POST'])
@jwt_required()
def add_search_history():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # ✅ Get logged-in user
        # user_id = session.get('user_id')
        user_id = get_jwt_identity()

        # ✅ Create DB record linked to user
        new_record = SearchHistory(
            user_id=user_id,  # 🔥 IMPORTANT LINK
            service_type=data.get('service_type'),
            search_address=data.get('search_address'),
            found_service_name=data.get('found_service_name'),
            found_service_address=data.get('found_service_address'),
            distance_km=data.get('distance_km', 0),
            found_service_phone=data.get('found_service_phone'),
            timestamp=datetime.utcnow()
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            "message": "Record saved successfully",
            "record_id": new_record.id,
            "user_id": user_id
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ POST HISTORY ERROR: {e}")
        return jsonify({"error": "Failed to save history"}), 500
    

# ==========================================
# ADMIN ROUTES
# ==========================================


# @app.route("/api/admin/update-role", methods=["PUT"])
# @admin_required  # This uses the decorator we discussed earlier
# def update_user_role():
#     try:
#         data = request.get_json()
#         target_user_id = data.get('user_id')
#         new_role = data.get('role') # e.g., 'admin' or 'user'

#         if new_role not in ['admin', 'user']:
#             return jsonify({'error': 'Invalid role type'}), 400

#         # Find the person you want to promote
#         target_user = User.query.get(target_user_id)
        
#         if not target_user:
#             return jsonify({'error': 'User not found'}), 404

#         # Update and save
#         target_user.role = new_role
#         db.session.commit()

#         return jsonify({
#             'message': f'User {target_user.name} is now a {new_role}',
#             'user_id': target_user.id,
#             'new_role': target_user.role
#         }), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

@app.route("/api/admin/update-role", methods=["PUT"])
@admin_required
def update_user_role():
    try:
        data = request.get_json()
        target_user_id = data.get('user_id')
        new_role = data.get('role') 

        if new_role not in ['admin', 'user']:
            return jsonify({'error': 'Invalid role type'}), 400

        target_user = User.query.get(target_user_id)
        if not target_user:
            return jsonify({'error': 'User not found'}), 404

        target_user.role = new_role
        db.session.commit()

        return jsonify({
            'message': f'User {target_user.name} is now a {new_role}',
            'user_id': target_user.id,
            'new_role': target_user.role
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

# @app.route("/api/admin/users", methods=["GET"])
# # @admin_required
# def get_all_users():
#     users = User.query.all()
#     return jsonify({
#         "users": [{
#             "id": u.id,
#             "name": u.name,
#             "email": u.email,
#             "role": u.role,
#             "created_at": u.created_at.strftime('%Y-%m-%d')
#         } for u in users]
#     }), 200

@app.route("/api/admin/users", methods=["GET"])
@admin_required
def get_all_users():
    users = User.query.all()
    return jsonify({
        "users": [{
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at.strftime('%Y-%m-%d')
        } for u in users]
    }), 200


# ==========================================
# AUTHENTICATION ROUTES
# ==========================================


        

# @app.route("/api/auth/verify-registration", methods=["POST"])
# def verify_registration():
#     try:
#         data = request.get_json()
#         email = data.get('email', '').strip().lower()
#         provided_otp = str(data.get('otp', '')).strip()

#         user = User.query.filter_by(email=email).first()

#         if not user or user.is_verified:
#             return jsonify({'message': 'User not found or already verified'}), 404

#         if user.otp == provided_otp and datetime.utcnow() < user.otp_expiry:
#             # ✅ Success: Mark as verified
#             user.is_verified = True
#             user.otp = None
#             user.otp_expiry = None
#             db.session.commit()
            
#             # Auto-login after registration (optional)
#             session['user_id'] = user.id
#             session['role'] = user.role
            
#             return jsonify({
#                 'message': 'Account verified successfully!',
#                 'user': {'id': user.id, 'name': user.name, 'email': user.email}
#             }), 200
        
#         return jsonify({'message': 'Invalid or expired OTP'}), 401

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': 'Verification failed'}), 500

@app.route("/api/auth/verify-registration", methods=["POST"])
def verify_registration():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        provided_otp = str(data.get('otp', '')).strip()

        user = User.query.filter_by(email=email).first()

        if not user or user.is_verified:
            return jsonify({'message': 'User not found or already verified'}), 404

        if user.otp == provided_otp and datetime.utcnow() < user.otp_expiry:
            user.is_verified = True
            user.otp = None
            user.otp_expiry = None
            db.session.commit()
            return jsonify({'message': 'Account verified successfully!'}), 200
        return jsonify({'message': 'Invalid or expired OTP'}), 401
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Verification failed'}), 500



from flask import request, jsonify
from datetime import datetime, timedelta
import random

# @app.route("/api/auth/login", methods=["POST"])
# def login():
#     try:
#         data = request.get_json()

#         if not data:
#             return jsonify({'error': 'No data provided'}), 400

#         email = data.get('email', '').strip().lower()
#         password = data.get('password', '')

#         if not email or not password:
#             return jsonify({'error': 'Email and password are required'}), 400

#         # 🔍 Find user
#         user = User.query.filter_by(email=email).first()

#         # ❌ User not found
#         if not user:
#             return jsonify({'error': 'User not found'}), 404

#         # ❌ Email not verified
#         if not user.is_verified:
#             return jsonify({
#                 'error': 'Please verify your email before logging in.'
#             }), 403

#         # ❌ Wrong password
#         if not verify_password(password, user.password_hash):
#             return jsonify({'error': 'Invalid email or password'}), 401

#         # 🔐 Generate OTP
#         otp_code = str(random.randint(100000, 999999))

#         # ⏳ Save OTP + expiry
#         user.otp = otp_code
#         user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)
#         db.session.commit()

#         print(f"✅ OTP for {email}: {otp_code}")  # DEBUG

#         # 📧 Send email
#         subject = "SafeGuard Login OTP"
#         body = f"""
# Hello,

# Your OTP for login is: {otp_code}

# This OTP will expire in 5 minutes.

# - SafeGuard Team
# """
#         email_sent = send_email(email, subject, body)

#         if not email_sent:
#             return jsonify({'error': 'Failed to send OTP email'}), 500

#         return jsonify({
#             'message': 'OTP sent successfully',
#             'email': email
#         }), 200

#     except Exception as e:
#         print(f"❌ LOGIN ERROR: {e}")
#         return jsonify({'error': 'Internal server error'}), 500


# ================= OTP VERIFY ================= #

# @app.route('/api/auth/verify-otp', methods=['POST'])
# def verify_otp():
#     try:
#         data = request.get_json()

#         email = data.get('email', '').strip().lower()
#         otp = str(data.get('otp', '')).strip()

#         if not email or not otp:
#             return jsonify({'error': 'Email and OTP are required'}), 400

#         user = User.query.filter_by(email=email).first()

#         if not user:
#             return jsonify({'error': 'User not found'}), 404

#         # 🔴 IMPORTANT FIXES
#         if not user.otp or not user.otp_expiry:
#             return jsonify({'error': 'OTP not generated'}), 400

#         if str(user.otp) != otp:
#             return jsonify({'error': 'Invalid OTP'}), 401

#         if datetime.utcnow() > user.otp_expiry:
#             return jsonify({'error': 'OTP expired'}), 401

#         # ✅ Clear OTP
#         user.otp = None
#         user.otp_expiry = None
#         db.session.commit()

#         # ✅ CREATE JWT TOKEN
#         # access_token = create_access_token(identity=user.id)

#         return jsonify({
#             "message": "Login successful",
#             # "access_token": access_token,
#             "user": {
#                 "id": user.id,
#                 "email": user.email
#             }
#         }), 200

#     except Exception as e:
#         print("❌ VERIFY OTP ERROR:", e)
#         return jsonify({'error': 'Internal server error'}), 500


from flask_jwt_extended import jwt_required

@app.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    
    # Store new access token in DB
    access_jti = get_jti(access_token)
    db.session.add(TokenBlocklist(
        jti=access_jti, 
        token_type='access', 
        user_id=int(identity),
        expires=datetime.utcnow() + timedelta(minutes=15)
    ))
    db.session.commit()
    
    return jsonify(access_token=access_token), 200

from flask_jwt_extended import create_access_token
from datetime import datetime

# @app.route("/api/auth/verify-otp", methods=["POST"])
# def verify_otp():
#     try:
#         data = request.get_json()

#         email = data.get("email", "").strip().lower()
#         otp = data.get("otp", "").strip()

#         if not email or not otp:
#             return jsonify({"error": "Email and OTP required"}), 400

#         user = User.query.filter_by(email=email).first()

#         if not user:
#             return jsonify({"error": "User not found"}), 404

#         # ❌ OTP mismatch
#         if user.otp != otp:
#             return jsonify({"error": "Invalid OTP"}), 401

#         # ❌ OTP expired
#         if not user.otp_expiry or user.otp_expiry < datetime.utcnow():
#             return jsonify({"error": "OTP expired"}), 401

#         # ✅ Clear OTP after successful verification
#         user.otp = None
#         user.otp_expiry = None
#         user.last_login = datetime.utcnow()

#         db.session.commit()

#         # ✅ CREATE TOKEN HERE
#         access_token = create_access_token(identity=str(user.id))

#         return jsonify({
#             "message": "Login successful",
#             "access_token": access_token,
#             "user": {
#                 "id": user.id,
#                 "email": user.email,
#                 "name": user.name
#             }
#         }), 200

#     except Exception as e:
#         print("❌ OTP VERIFY ERROR:", e)
#         return jsonify({"error": "Internal server error"}), 500



from flask_jwt_extended import create_access_token, create_refresh_token, get_jti

# @app.route("/api/auth/verify-otp", methods=["POST"])
# def verify_otp():
#     try:
#         data = request.get_json()
#         email = data.get("email", "").strip().lower()
#         otp = data.get("otp", "").strip()

#         user = User.query.filter_by(email=email).first()
#         if not user or user.otp != otp:
#             return jsonify({"error": "Invalid credentials"}), 401

#         if not user.otp_expiry or user.otp_expiry < datetime.utcnow():
#             return jsonify({"error": "OTP expired"}), 401

#         # ✅ 1. Generate Tokens
#         identity = str(user.id)
#         access_token = create_access_token(identity=identity)
#         refresh_token = create_refresh_token(identity=identity)

#         # ✅ 2. Extract JTIs (Unique IDs for the tokens)
#         access_jti = get_jti(access_token)
#         refresh_jti = get_jti(refresh_token)

#         # ✅ 3. Store in TokenBlocklist Table
#         # Access Token Record
#         db.session.add(TokenBlocklist(
#             jti=access_jti,
#             token_type='access',
#             user_id=user.id,
#             expires=datetime.utcnow() + timedelta(minutes=15) # Match your JWT config
#         ))
#         # Refresh Token Record
#         db.session.add(TokenBlocklist(
#             jti=refresh_jti,
#             token_type='refresh',
#             user_id=user.id,
#             expires=datetime.utcnow() + timedelta(days=7)
#         ))

#         # Clear OTP
#         user.otp = None
#         user.otp_expiry = None
#         user.last_login = datetime.utcnow()
#         db.session.commit()

#         return jsonify({
#             "message": "Login successful",
#             "access_token": access_token,
#             "refresh_token": refresh_token,
#             "user": {"id": user.id, "email": user.email, "name": user.name}
#         }), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500


@app.route("/api/auth/verify-otp", methods=["POST"])
def verify_otp():
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()
        otp = data.get("otp", "").strip()

        user = User.query.filter_by(email=email).first()
        
        # 1. Basic validation
        if not user or user.otp != otp:
            return jsonify({"error": "Invalid credentials"}), 401

        if not user.otp_expiry or user.otp_expiry < datetime.utcnow():
            return jsonify({"error": "OTP expired"}), 401

        # ---------------------------------------------------------
        # PASTE THE TOKEN LOGIC HERE
        # ---------------------------------------------------------
        identity = str(user.id)
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)

        access_jti = get_jti(access_token)
        refresh_jti = get_jti(refresh_token)

        # Store the tokens in your database table
        db.session.add(TokenBlocklist(
            jti=access_jti,
            token_type='access',
            user_id=user.id,
            expires=datetime.utcnow() + timedelta(minutes=15)
        ))
        db.session.add(TokenBlocklist(
            jti=refresh_jti,
            token_type='refresh',
            user_id=user.id,
            expires=datetime.utcnow() + timedelta(days=7)
        ))

        # 2. Cleanup and commit
        user.otp = None
        user.otp_expiry = None
        user.last_login = datetime.utcnow()
        db.session.commit()

        # 3. Return tokens to the frontend
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {"id": user.id, "email": user.email, "name": user.name , "role": user.role},
            'role': user.role  # 🔥 Include role in response for frontend checks
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/logout", methods=["POST"])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

def generate_otp():
    return str(random.randint(100000, 999999))

@app.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json

    email = data.get("email", "").strip().lower()
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Generate OTP
    otp = generate_otp()
    user.otp = otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)

    db.session.commit()

    # Send Email
    sent = send_email(
        email,
        "Reset Password OTP",
        f"Your password reset OTP is: {otp}\nValid for 5 minutes."
    )

    if not sent:
        return jsonify({"error": "Failed to send email"}), 500

    return jsonify({"message": "OTP sent for password reset"}), 200

@app.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    data = request.json

    email = data.get("email", "").strip().lower()
    otp = str(data.get("otp", "")).strip()
    new_password = data.get("new_password", "")

    if not email or not otp or not new_password:
        return jsonify({"error": "All fields are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check OTP
    if not user.otp or not user.otp_expiry:
        return jsonify({"error": "No OTP generated"}), 400

    if user.otp != otp:
        return jsonify({"error": "Invalid OTP"}), 401

    if datetime.utcnow() > user.otp_expiry:
        return jsonify({"error": "OTP expired"}), 401

    # ✅ Update password
    user.password_hash = hash_pw(new_password)

    # Clear OTP
    user.otp = None
    user.otp_expiry = None

    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200


# @app.route("/api/auth/me", methods=["GET"])
# @jwt_required()
# def get_current_user():
#     """Get current logged-in user info using JWT"""
#     try:
#         # ✅ Get user identity from JWT token
#         # user_id = get_jwt_identity()

#         # Fetch user from DB
#         # user = User.query.get(user_id)

#         # if not user:
#         #     return jsonify({'error': 'User not found'}), 404

#         return jsonify({
#             'user': {
#                 'id': user.id,
#                 'name': user.name,
#                 'email': user.email,
#                 'phone': user.phone
#             }
#         }), 200

#     except Exception as e:
#         print(f"❌ GET USER ERROR: {e}")
#         return jsonify({'error': 'Failed to get user info'}), 500

from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()  # ✅ FROM TOKEN

        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'role': user.role   # 🔥 IMPORTANT FOR ADMIN CHECK
            }
        }), 200

    except Exception as e:
        print(f"❌ GET USER ERROR: {e}")
        return jsonify({'error': 'Failed to get user info'}), 500


# @app.route("/api/auth/update-profile", methods=["PUT"])
# @jwt_required()
# def update_profile():
#     """Update user profile"""
#     try:
#         data = request.get_json()

#         # ✅ Get user_id from JWT instead of session
#         user_id = get_jwt_identity()

#         user = User.query.get(user_id)

#         if not user:
#             return jsonify({'error': 'User not found'}), 404

#         # ✅ Update fields safely
#         if 'name' in data and data['name'].strip():
#             user.name = data['name'].strip()

#         if 'phone' in data and data['phone']:
#             user.phone = data['phone'].strip()

#         db.session.commit()

#         return jsonify({
#             'message': 'Profile updated successfully',
#             'user': {
#                 'id': user.id,
#                 'name': user.name,
#                 'email': user.email,
#                 'phone': user.phone
#             }
#         }), 200

#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ UPDATE PROFILE ERROR: {e}")
#         return jsonify({'error': 'Failed to update profile'}), 500

@app.route("/api/auth/update-profile", methods=["PUT"])
def update_profile():
    """Update user profile (NO auth, simple version)"""
    try:
        data = request.get_json()

        # ✅ Expect user_id directly from request
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400

        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # ✅ Update fields safely
        if 'name' in data and data['name'].strip():
            user.name = data['name'].strip()

        if 'phone' in data and data['phone']:
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


# ==========================================
# EXISTING ROUTES
# ==========================================

@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "SafeGuard API is running! 🛡️"})




# @app.route("/api/find-nearby", methods=["POST"])
# def find_nearby():
#     # ✅ Check login using session instead of JWT
#     if "user_id" not in session:
#         return jsonify({"error": "Authentication required"}), 401

#     user_id = session["user_id"]

#     data = request.get_json()

#     if not data or "lat" not in data or "lon" not in data:
#         return jsonify({"error": "Latitude and Longitude required"}), 400

#     try:
#         lat = float(data.get("lat"))
#         lon = float(data.get("lon"))
#     except ValueError:
#         return jsonify({"error": "Invalid coordinates"}), 400

#     # 🔍 Find nearest service
#     nearest = get_nearest_amenity(lat, lon)

#     if not nearest:
#         return jsonify({"error": "Not found"}), 404

#     # 💾 Save search history
#     record = SearchHistory(
#         user_id=user_id,
#         service_type="police",
#         search_address=f"{lat},{lon}",
#         found_service_name=nearest["name"],
#         distance_km=nearest["dist"]
#     )

#     db.session.add(record)
#     db.session.commit()

#     return jsonify(nearest), 200

# @app.route("/api/find-nearby", methods=["POST"])
# @jwt_required()
# def find_nearby():
#     user_id = get_jwt_identity()
#     data = request.json
#     lat, lon = data.get('lat'), data.get('lon')
#     s_type = data.get('service_type', 'police')

#     # Overpass API Call
#     url = "https://overpass-api.de/api/interpreter"
#     query = f'[out:json];node["amenity"="{s_type}"](around:10000,{lat},{lon});out;'
    
#     try:
#         res = requests.post(url, data=query, timeout=10).json()
#         elements = res.get('elements', [])
#         if not elements: return jsonify({"error": "None found"}), 404
        
#         # Take first result for logic simplicity
#         target = elements[0]
#         name = target.get('tags', {}).get('name', f'Unknown {s_type}')
#         t_lat, t_lon = target['lat'], target['lon']
#         dist = geodesic((lat, lon), (t_lat, t_lon)).km

#         # Log search to history
#         new_history = SearchHistory(
#             user_id=user_id,
#             service_type=s_type,
#             user_lat=lat, user_lon=lon,
#             found_service_name=name,
#             distance_km=dist,
#             device_info=request.headers.get('User-Agent')
#         )
#         db.session.add(new_history)
#         db.session.commit()

#         return jsonify({"name": name, "distance": dist, "lat": t_lat, "lon": t_lon})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500







# @app.route("/api/find-nearby", methods=["POST"])
# @jwt_required()
# def find_nearby():
#     user_id = get_jwt_identity()
#     data = request.json
    
#     # FIX 1: Support both 'lng' (frontend) and 'lon' (backend)
#     lat = data.get('lat')
#     lon = data.get('lon') or data.get('lng')
#     s_type = data.get('service_type', 'police')

#     if not lat or not lon:
#         return jsonify({"error": "Latitude and Longitude are required"}), 400

#     # Map frontend types to Overpass OSM tags
#     osm_type = s_type
#     if s_type == 'fire': osm_type = 'fire_station'
#     if s_type == 'hospital': osm_type = 'hospital'

#     # FIX 2: More robust Overpass Query
#     url = "https://overpass-api.de/api/interpreter"
#     query = f"""
#     [out:json][timeout:25];
#     (
#       node["amenity"="{osm_type}"](around:15000,{lat},{lon});
#       way["amenity"="{osm_type}"](around:15000,{lat},{lon});
#       relation["amenity"="{osm_type}"](around:15000,{lat},{lon});
#     );
#     out center;
#     """
    
#     try:
#         response = requests.post(url, data=query, timeout=15)
#         if response.status_code != 200:
#             return jsonify({"error": "Overpass API busy"}), 503
            
#         res = response.json()
#         elements = res.get('elements', [])
        
#         if not elements: 
#             return jsonify({"error": f"No {s_type} found within 15km"}), 404
        
#         # Calculate distances and find the closest one
#         places = []
#         for e in elements:
#             # Ways/Relations use 'center', Nodes use 'lat/lon'
#             p_lat = e.get('lat') or e.get('center', {}).get('lat')
#             p_lon = e.get('lon') or e.get('center', {}).get('lon')
            
#             if p_lat and p_lon:
#                 dist = geodesic((lat, lon), (p_lat, p_lon)).km
#                 places.append({
#                     "name": e.get('tags', {}).get('name', f"Nearest {s_type}"),
#                     "lat": p_lat,
#                     "lon": p_lon,
#                     "distance": dist,
#                     "phone": e.get('tags', {}).get('phone') or e.get('tags', {}).get('contact:phone', "112")
#                 })

#         if not places:
#             return jsonify({"error": "Could not parse location data"}), 404

#         # Get the absolute nearest
#         nearest = min(places, key=lambda x: x['distance'])

#         # Log search to history
#         new_history = SearchHistory(
#             user_id=user_id,
#             service_type=s_type,
#             user_lat=lat, user_lon=lon,
#             found_service_name=nearest["name"],
#             distance_km=nearest["distance"],
#             device_info=request.headers.get('User-Agent')
#         )
#         db.session.add(new_history)
#         db.session.commit()

#         return jsonify(nearest), 200

#     except Exception as e:
#         print(f"Server Error: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500



# @app.route("/api/find-nearby", methods=["POST"])
# @jwt_required()
# def find_nearby():
#     user_id = get_jwt_identity()
#     data = request.json
    
#     lat = data.get('lat')
#     lon = data.get('lon') or data.get('lng')
#     s_type = data.get('service_type', 'police')

#     if not lat or not lon:
#         return jsonify({"error": "Latitude and Longitude are required"}), 400

#     # Optimization: Map frontend types to OSM tags
#     osm_type = s_type
#     if s_type == 'fire': osm_type = 'fire_station'
#     if s_type == 'hospital': osm_type = 'hospital'

#     # CHANGE 1: Increase timeout and use a simpler query to reduce 503 errors
#     url = "https://overpass-api.de/api/interpreter"
#     query = f"""
#     [out:json][timeout:30];
#     (
#       node["amenity"="{osm_type}"](around:20000,{lat},{lon});
#       way["amenity"="{osm_type}"](around:20000,{lat},{lon});
#     );
#     out center;
#     """
    
#     try:
#         # CHANGE 2: Add a longer timeout for the request itself
#         response = requests.post(url, data=query, timeout=20)
        
#         # If Overpass is down (503), don't just crash, return a helpful error
#         if response.status_code == 503:
#              return jsonify({"error": "Map server is currently busy. Please try again in a few seconds."}), 503
            
#         res = response.json()
#         elements = res.get('elements', [])
        
#         if not elements: 
#             return jsonify({"error": f"No {s_type} found within 20km range"}), 404
        
#         places = []
#         for e in elements:
#             p_lat = e.get('lat') or e.get('center', {}).get('lat')
#             p_lon = e.get('lon') or e.get('center', {}).get('lon')
            
#             if p_lat and p_lon:
#                 dist = geodesic((lat, lon), (p_lat, p_lon)).km
#                 places.append({
#                     "name": e.get('tags', {}).get('name', f"Nearby {s_type}"),
#                     "lat": p_lat,
#                     "lon": p_lon,
#                     "distance": dist,
#                     "phone": e.get('tags', {}).get('phone') or "112",
#                     "address": e.get('tags', {}).get('addr:street', "Address available on map")
#                 })

#         nearest = min(places, key=lambda x: x['distance'])

#         # Save to history
#         new_history = SearchHistory(
#             user_id=user_id,
#             service_type=s_type,
#             found_service_name=nearest["name"],
#             distance_km=nearest["distance"],
#             timestamp=datetime.utcnow()
#         )
#         db.session.add(new_history)
#         db.session.commit()

#         return jsonify(nearest), 200

#     except requests.exceptions.Timeout:
#         return jsonify({"error": "The search took too long. Please try again."}), 504
#     except Exception as e:
#         print(f"Server Error: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500

import requests
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from geopy.distance import geodesic # Ensure this is installed: pip install geopy
from datetime import datetime

@app.route("/api/find-nearby", methods=["POST"])
@jwt_required()
def find_nearby():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        lat = data.get('lat')
        lon = data.get('lon') or data.get('lng')
        s_type = data.get('service_type', 'police')

        if not lat or not lon:
            return jsonify({"error": "Latitude and Longitude are required"}), 400

        # Map frontend types to OSM tags
        osm_type = s_type
        if s_type == 'fire' or s_type == 'fire_station': osm_type = 'fire_station'
        if s_type == 'hospital': osm_type = 'hospital'
        if s_type == 'police': osm_type = 'police'

        url = "https://overpass-api.de/api/interpreter"
        # Expanded query to include relations (common for large campuses)
        query = f"""
        [out:json][timeout:25];
        (
          node["amenity"="{osm_type}"](around:20000,{lat},{lon});
          way["amenity"="{osm_type}"](around:20000,{lat},{lon});
          relation["amenity"="{osm_type}"](around:20000,{lat},{lon});
        );
        out center;
        """
        
        try:
            response = requests.post(url, data=query, timeout=15)
            if response.status_code == 503:
                return jsonify({"error": "Map server busy. Try again in 5 seconds."}), 503
            
            res = response.json()
            elements = res.get('elements', [])
            
            if not elements: 
                return jsonify({"error": f"No {s_type} found within 20km."}), 404
            
            places = []
            for e in elements:
                # Overpass center logic for ways/relations
                p_lat = e.get('lat') or e.get('center', {}).get('lat')
                p_lon = e.get('lon') or e.get('center', {}).get('lon')
                
                if p_lat and p_lon:
                    dist = geodesic((lat, lon), (p_lat, p_lon)).km
                    tags = e.get('tags', {})
                    places.append({
                        "name": tags.get('name', f"Nearby {s_type.replace('_', ' ')}"),
                        "lat": p_lat,
                        "lon": p_lon,
                        "distance": dist,
                        "phone": tags.get('phone') or tags.get('contact:phone') or "112",
                        "address": tags.get('addr:street', "Location identified")
                    })

            if not places:
                return jsonify({"error": "Could not calculate distances for nearby places."}), 404

            # Get the absolute nearest
            nearest = min(places, key=lambda x: x['distance'])

            # Log search history
            try:
                new_history = SearchHistory(
                    user_id=user_id,
                    service_type=s_type,
                    found_service_name=nearest["name"],
                    distance_km=nearest["distance"],
                    timestamp=datetime.utcnow()
                )
                db.session.add(new_history)
                db.session.commit()
            except Exception as db_e:
                db.session.rollback()
                print(f"Database logging failed: {db_e}")

            return jsonify(nearest), 200

        except requests.exceptions.Timeout:
            return jsonify({"error": "Map search timed out."}), 504

    except Exception as e:
        print(f"CRITICAL SERVER ERROR: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/api/admin/alert-count", methods=["GET"])
@admin_required
def get_alert_count():
    """Returns the total number of emergency alerts logged in the system"""
    try:
        # This queries the SafetyLog table we defined earlier
        count = SafetyLog.query.count()
        return jsonify({"count": count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# @app.route("/api/admin/analytics", methods=["GET"])
# @admin_required
# def get_analytics():
#     total_users = User.query.count()
#     total_searches = SearchHistory.query.count()
    
#     # Breakdown by service type
#     stats = db.session.query(
#         SearchHistory.service_type, db.func.count(SearchHistory.id)
#     ).group_by(SearchHistory.service_type).all()
    
#     return jsonify({
#         "users": total_users,
#         "searches": total_searches,
#         "breakdown": {s: c for s, c in stats}
#     })

from datetime import datetime, timedelta

# @app.route("/api/admin/analytics", methods=["GET"])
# @admin_required
# def get_analytics():
#     try:
#         # 1. User Stats
#         total_users = User.query.count()
#         admin_count = User.query.filter_by(role='admin').count()
#         regular_users = total_users - admin_count

#         # 2. Search Stats
#         total_searches = SearchHistory.query.count()

#         # 3. Service Breakdown (Pie Chart Data)
#         # Groups by type and counts: {'police': 5, 'hospital': 2}
#         service_stats = db.session.query(
#             SearchHistory.service_type, db.func.count(SearchHistory.id)
#         ).group_by(SearchHistory.service_type).all()
        
#         service_breakdown = {s: c for s, c in service_stats}

#         # 4. Daily Searches - Last 30 Days (Bar Chart Data)
#         thirty_days_ago = datetime.utcnow() - timedelta(days=30)
#         daily_stats = db.session.query(
#             db.func.date(SearchHistory.timestamp), db.func.count(SearchHistory.id)
#         ).filter(SearchHistory.timestamp >= thirty_days_ago)\
#          .group_by(db.func.date(SearchHistory.timestamp)).all()

#         daily_searches = {str(date): count for date, count in daily_stats}

#         return jsonify({
#             "total_users": total_users,
#             "regular_users": regular_users,
#             "admin_count": admin_count,
#             "total_searches": total_searches,
#             "service_breakdown": service_breakdown,
#             "daily_searches_last_30_days": daily_searches
#         }), 200

#     except Exception as e:
#         print(f"Analytics Error: {e}")
#         return jsonify({"error": "Failed to calculate analytics"}), 500



# @app.route("/api/admin/analytics", methods=["GET"])
# @admin_required
# def get_analytics():
#     """
#     Provides data for the Search Analytics Frontend:
#     1. Pie Chart (service_breakdown)
#     2. Bar Chart (daily_searches_last_30_days)
#     3. Summary Cards (total_users, total_searches, etc.)
#     """
#     try:
#         # --- 1. USER STATS ---
#         total_users = User.query.count()
#         admin_count = User.query.filter_by(role='admin').count()
#         regular_users = total_users - admin_count

#         # --- 2. SEARCH STATS ---
#         total_searches = SearchHistory.query.count()

#         # --- 3. SERVICE BREAKDOWN (For the Pie Chart) ---
#         # Expected format: {"police": 10, "hospital": 5, "fire": 2}
#         service_stats = db.session.query(
#             SearchHistory.service_type, 
#             func.count(SearchHistory.id)
#         ).group_by(SearchHistory.service_type).all()
        
#         service_breakdown = {s: c for s, c in service_stats}

#         # Ensure all keys exist so the frontend doesn't crash
#         for s_type in ['police', 'hospital', 'fire']:
#             if s_type not in service_breakdown:
#                 service_breakdown[s_type] = 0

#         # --- 4. DAILY SEARCHES - LAST 30 DAYS (For the Bar Chart) ---
#         # Expected format: {"2023-10-01": 5, "2023-10-02": 12...}
#         thirty_days_ago = datetime.utcnow() - timedelta(days=30)
#         daily_stats = db.session.query(
#             func.date(SearchHistory.timestamp).label('date'), 
#             func.count(SearchHistory.id).label('count')
#         ).filter(SearchHistory.timestamp >= thirty_days_ago)\
#          .group_by(func.date(SearchHistory.timestamp)).all()

#         daily_searches = {str(date): count for date, count in daily_stats}

#         # --- 5. RESPONSE ---
#         return jsonify({
#             "total_users": total_users,
#             "regular_users": regular_users,
#             "admin_count": admin_count,
#             "total_searches": total_searches,
#             "service_breakdown": service_breakdown,
#             "daily_searches_last_30_days": daily_searches
#         }), 200

#     except Exception as e:
#         print(f"Analytics Error: {e}")
#         return jsonify({"error": "Failed to calculate analytics"}), 500

# @app.route("/api/admin/analytics", methods=["GET"])
# @admin_required
# def get_analytics():
#     try:
#         # 1. Basic Stats
#         total_users = User.query.count()
#         total_searches = SearchHistory.query.count()
#         active_alerts = SafetyLog.query.count()

#         # 2. Service Breakdown (Pie Chart)
#         # service_stats = db.session.query(
#         #     SearchHistory.service_type, 
#         #     func.count(SearchHistory.id)
#         # ).group_by(SearchHistory.service_type).all()
#         # service_breakdown = {s: c for s, c in service_stats}

#         # # 3. Daily Searches - Last 30 Days (Bar Chart)
#         # thirty_days_ago = datetime.utcnow() - timedelta(days=30)
#         # daily_stats = db.session.query(
#         #     func.date(SearchHistory.timestamp).label('date'), 
#         #     func.count(SearchHistory.id).label('count')
#         # ).filter(SearchHistory.timestamp >= thirty_days_ago)\
#         #  .group_by(func.date(SearchHistory.timestamp)).all()

#         # # Format: {"2024-03-01": 5, "2024-03-02": 8}
#         # daily_searches_last_30_days = {str(date): count for date, count in daily_stats}

#         # return jsonify({
#         #     "total_users": total_users,
#         #     "total_searches": total_searches,
#         #     "activeAlerts": active_alerts,
#         #     "service_breakdown": service_breakdown,
#         #     "daily_searches_last_30_days": daily_searches_last_30_days
#         # }), 200

        

#     except Exception as e:
#         print(f"Analytics Error: {e}")
#         return jsonify({"error": "Failed to calculate analytics"}), 500
@app.route("/api/admin/analytics", methods=["GET"])
@admin_required
def get_analytics():
    try:
        # 1. Basic Stats Calculation
        total_users = User.query.count()
        total_searches = SearchHistory.query.count()
        active_alerts = SafetyLog.query.count()

        # 2. Service Breakdown (For Pie/Bar Chart)
        service_stats = db.session.query(
            SearchHistory.service_type, 
            func.count(SearchHistory.id)
        ).group_by(SearchHistory.service_type).all()
        service_breakdown = {s: c for s, c in service_stats}

        # Ensure keys exist for common services
        for s_type in ['police', 'hospital', 'fire_station']:
            if s_type not in service_breakdown:
                service_breakdown[s_type] = 0

        # 3. Location Breakdown (Fixes empty Location Graph)
        # Groups by search_address (the location users searched from)
        location_stats = db.session.query(
            SearchHistory.search_address, 
            func.count(SearchHistory.id)
        ).filter(SearchHistory.search_address != None)\
         .group_by(SearchHistory.search_address)\
         .limit(10).all()

        location_breakdown = [
            {"location": loc if loc else "Unknown Area", "count": cnt} 
            for loc, cnt in location_stats
        ]

        # 4. Daily Searches - Last 30 Days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        daily_stats = db.session.query(
            func.date(SearchHistory.timestamp).label('date'), 
            func.count(SearchHistory.id).label('count')
        ).filter(SearchHistory.timestamp >= thirty_days_ago)\
         .group_by(func.date(SearchHistory.timestamp)).all()
        
        daily_searches_last_30_days = {str(date): count for date, count in daily_stats}

        # 5. Full response payload
        return jsonify({
            "total_users": total_users,
            "total_searches": total_searches,
            "activeAlerts": active_alerts,
            "service_breakdown": service_breakdown,
            "location_breakdown": location_breakdown,
            "daily_searches_last_30_days": daily_searches_last_30_days
        }), 200

    except Exception as e:
        print(f"❌ Analytics Error: {str(e)}")
        return jsonify({"error": "Failed to calculate analytics"}), 500

# backend/app.py

# @app.route("/api/admin/invite-admin", methods=["POST"])
# @admin_required
# def invite_admin():
#     """
#     Finds a user by email and promotes them to admin, 
#     sending a notification email.
#     """
#     try:
#         data = request.get_json()
#         target_email = data.get('email', '').strip().lower()

#         if not target_email:
#             return jsonify({'error': 'Email is required'}), 400

#         # Find the user
#         user = User.query.filter_by(email=target_email).first()
        
#         if not user:
#             return jsonify({'error': 'User not found. They must register first.'}), 404

#         if user.role == 'admin':
#             return jsonify({'message': 'User is already an admin'}), 200

#         # Promote
#         user.role = 'admin'
#         db.session.commit()

#         # Send Notification
#         subject = "🛡️ Admin Privileges Granted - SafeGuard"
#         body = f"Hello {user.name},\n\nYou have been promoted to Admin by an existing administrator. You now have access to the Search Analytics and User Management dashboards."
#         send_email(user.email, subject, body)

#         return jsonify({
#             'message': f'Successfully promoted {user.name} to admin.',
#             'user_id': user.id
#         }), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

# backend/app.py

@app.route("/api/admin/invite-admin", methods=["POST"])
@admin_required
def invite_admin():
    """
    Finds a user by email and promotes them to admin, 
    sending a notification email with a direct login link.
    """
    try:
        data = request.get_json()
        target_email = data.get('email', '').strip().lower()
        
        # Change this to your actual frontend login URL
        LOGIN_URL = "http://localhost:3000/auth/login" 

        if not target_email:
            return jsonify({'error': 'Email is required'}), 400

        # Find the user
        user = User.query.filter_by(email=target_email).first()
        
        if not user:
            return jsonify({'error': 'User not found. The user must register an account first.'}), 404

        if user.role == 'admin':
            return jsonify({'message': 'User is already an administrator.'}), 200

        # Promote the user
        user.role = 'admin'
        db.session.commit()

        # Send Notification Email
        subject = "🛡️ SafeGuard: Admin Access Granted"
        
        # Plain text version for compatibility
        body = f"""
Hello {user.name},

You have been promoted to an Administrator for the SafeGuard platform. 
You now have access to the Admin Panel, User Management, and Search Analytics.

To get started, please log in to your account here:
{LOGIN_URL}

Stay safe,
The SafeGuard Team
        """
        
        # If your send_email function supports HTML, you could enhance it there.
        # For now, we use the standard body.
        send_email(user.email, subject, body)

        return jsonify({
            'message': f'Successfully promoted {user.name} to admin. Invitation sent to {user.email}.',
            'user_id': user.id
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ INVITE ERROR: {e}")
        return jsonify({'error': 'Failed to process admin invitation.'}), 500

@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        user = User.query.filter_by(email=email).first()

        # ❌ User not found
        if not user:
            return jsonify({"error": "User not found"}), 404

        # ❌ Password wrong
        if not verify_pw(password, user.password_hash):
            return jsonify({"error": "Invalid credentials"}), 401

        # ❌ Not verified
        if not user.is_verified:
            return jsonify({"error": "Account not verified"}), 403

        # ✅ GENERATE OTP
        otp = str(random.randint(100000, 999999))
        user.otp = otp
        user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)

        db.session.commit()

        print(f"DEBUG OTP for {email}: {otp}")  # 🔥 IMPORTANT (check terminal)

        # ✅ SEND EMAIL
        subject = "SafeGuard Login OTP"
        body = f"""
Hello {user.name},

Your login OTP is: {otp}

This OTP is valid for 5 minutes.

- SafeGuard Team
"""

        email_sent = send_email(email, subject, body)

        if not email_sent:
            return jsonify({"error": "Failed to send OTP email"}), 500

        return jsonify({
            "message": "OTP sent to your email",
            "email": email
        }), 200

    except Exception as e:
        print("❌ LOGIN ERROR:", e)
        return jsonify({"error": "Internal server error"}), 500


# ==========================================
# CONTACTS ROUTES (JWT आधारित)
# ==========================================

# 1. GET CONTACTS
# @app.route("/api/contacts", methods=["GET"])
# @jwt_required()
# def get_contacts():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)

#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     # ✅ Admin can see all contacts
#     if user.role == 'admin':
#         contacts = db.session.query(EmergencyContact, User).join(User).all()
#         return jsonify([{
#             "id": c.id,
#             "name": c.name,
#             "relationship": c.relationship,
#             "phone": c.phone,
#             "owner": u.email
#         } for c, u in contacts]), 200

#     # ✅ Normal user → only their contacts
#     return jsonify([{
#         "id": c.id,
#         "name": c.name,
#         "relationship": c.relationship,
#         "phone": c.phone
#     } for c in user.contacts]), 200

@app.route("/api/contacts", methods=["GET"])
def get_contacts():
    try:
        contacts = EmergencyContact.query.all()

        return jsonify([{
            "id": c.id,
            "name": c.name,
            "relationship": c.relationship,
            "phone": c.phone
        } for c in contacts]), 200

    except Exception as e:
        print(f"❌ GET ERROR: {e}")
        return jsonify({"error": "Failed to fetch contacts"}), 500



# 2. POST (ADD CONTACT)
# Update your existing add_contact in the Flask file
# @app.route("/api/contacts", methods=["POST"])
# @jwt_required()
# def add_contact():
#     try:
#         # Ensure identity is an integer
#         identity = get_jwt_identity()
#         user_id = int(identity)
#         data = request.get_json()
        
#         if not data or not data.get("name") or not data.get("phone"):
#             return jsonify({"error": "Name and phone are required"}), 400

#         new_contact = EmergencyContact(
#             name=data.get("name").strip(),
#             phone=data.get("phone").strip(),
#             relationship=data.get("relationship", "").strip(),
#             user_id=user_id
#         )
#         db.session.add(new_contact)
#         db.session.commit()
        
#         # Return the object directly (matching what the frontend map() expects)
#         return jsonify({
#             "id": str(new_contact.id), 
#             "name": new_contact.name, 
#             "phone": new_contact.phone, 
#             "relationship": new_contact.relationship
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         print(f"BACKEND ERROR: {e}")
#         return jsonify({"error": str(e)}), 500


from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route("/api/contacts", methods=["POST"])
@jwt_required()
def add_contact():
    try:
        data = request.get_json()
        
        # Extract user_id from the JWT token
        # We convert to int because identity was stored as str(user.id) during login
        user_id = int(get_jwt_identity())  

        if not data or not data.get("name") or not data.get("phone"):
            return jsonify({"error": "Name and phone are required"}), 400

        new_contact = EmergencyContact(
            name=data.get("name").strip(),
            phone=data.get("phone").strip(),
            relationship=data.get("relationship", "").strip(),
            user_id=user_id
        )

        db.session.add(new_contact)
        db.session.commit()

        return jsonify({
            "message": "Contact added successfully",
            "contact": {
                "id": new_contact.id,
                "name": new_contact.name,
                "relationship": new_contact.relationship
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ ADD CONTACT ERROR: {e}")
        return jsonify({"error": "Internal server error"}), 500




# 3. PUT (UPDATE CONTACT)
# @app.route("/api/contacts/<int:id>", methods=["PUT"])
# @jwt_required()
# def update_contact(id):
#     try:
#         user_id = get_jwt_identity()
#         contact = EmergencyContact.query.get_or_404(id)

#         # 🔒 Ownership check
#         if contact.user_id != user_id:
#             return jsonify({"error": "Unauthorized"}), 403

#         data = request.get_json()

#         contact.name = data.get("name", contact.name)
#         contact.relationship = data.get("relationship", contact.relationship)
#         contact.phone = data.get("phone", contact.phone)

#         db.session.commit()

#         return jsonify({"message": "Contact updated successfully"}), 200

#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ UPDATE CONTACT ERROR: {e}")
#         return jsonify({"error": "Failed to update contact"}), 500

@app.route("/api/contacts/<int:id>", methods=["PUT"])
def update_contact(id):
    try:
        contact = EmergencyContact.query.get_or_404(id)
        data = request.get_json()

        contact.name = data.get("name", contact.name)
        contact.relationship = data.get("relationship", contact.relationship)
        contact.phone = data.get("phone", contact.phone)

        db.session.commit()

        return jsonify({"message": "Contact updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ UPDATE ERROR: {e}")
        return jsonify({"error": "Failed to update contact"}), 500


# 4. DELETE (DELETE CONTACT)
# @app.route("/api/contacts/<int:id>", methods=["DELETE"])
# @jwt_required()
# def delete_contact(id):
#     try:
#         user_id = get_jwt_identity()
#         contact = EmergencyContact.query.get_or_404(id)

#         # 🔒 Ownership check
#         if contact.user_id != user_id:
#             return jsonify({"error": "Unauthorized"}), 403

#         db.session.delete(contact)
#         db.session.commit()

#         return jsonify({"message": "Contact deleted successfully"}), 200

#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ DELETE CONTACT ERROR: {e}")
#         return jsonify({"error": "Failed to delete contact"}), 500

@app.route("/api/contacts/<int:id>", methods=["DELETE"])
def delete_contact(id):
    try:
        contact = EmergencyContact.query.get_or_404(id)

        db.session.delete(contact)
        db.session.commit()

        return jsonify({"message": "Contact deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ DELETE ERROR: {e}")
        return jsonify({"error": "Failed to delete contact"}), 500

# @app.route("/api/test-token")
# def test_token():
#     # Replace '1' with your actual user ID from the database
#     token = create_access_token(identity=1) 
#     return jsonify(access_token=token)


@app.route("/api/alert", methods=["POST"])
def trigger_alert():
    """Trigger emergency alert"""
    try:
        data = request.get_json()
        user_email = data.get("user_email")
        lat = float(data.get("lat"))
        lon = float(data.get("lon"))
        message = data.get("message", "Emergency alert triggered!")

        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        log = SafetyLog(
            user_id=user.id,
            lat=lat,
            lon=lon,
            status=message
        )
        db.session.add(log)
        db.session.commit()

        for contact in user.contacts:
            if contact.email:
                subject = "🚨 Emergency Alert from SafeGuard"
                body = f"""
                Your contact has triggered an emergency alert!
                
                Message: {message}
                Location: https://maps.google.com/?q={lat},{lon}
                Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                
                Please check on them immediately!
                
                SafeGuard Team
                """
                send_email(contact.email, subject, body)

        return jsonify({
            "status": "Alert triggered",
            "contacts_notified": len(user.contacts),
            "location": {"lat": lat, "lon": lon}
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ ERROR: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})
































# """
# SafeGuard Flask Backend (No JWT / No Sessions)
# All routes & tables preserved
# """

# import os
# import random
# import smtplib
# from flask_migrate import Migrate
# import requests
# import hashlib
# import secrets
# from datetime import datetime, timedelta
# from email.message import EmailMessage
# from dotenv import load_dotenv
# from flask import Flask, jsonify, request
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from geopy.distance import geodesic
# from sqlalchemy import func

# # ==============================
# # APP CONFIG
# # ==============================

# app = Flask(__name__)
# CORS(app)


# load_dotenv()


# app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")





# CORS(
#     app,
#     supports_credentials=True,
#     resources={
#         r"/api/*": {
#             "origins": ["http://localhost:3000"],
#             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#             "allow_headers": ["Content-Type", "Authorization"]
#         }
#     }
# )


# # Database Configuration
# DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///safeguard_new.db')
# app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY" , "dev-secret-key-123")

# app.config['SESSION_COOKIE_HTTPONLY'] = True
# app.config['SESSION_PERMANENT'] = True

# app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 280}
# app.config['SESSION_COOKIE_SAMESITE'] = 'None'
# app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

# db = SQLAlchemy(app)

# migrate = Migrate(app, db)


# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///safeguard_new.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# # ==============================
# # DATABASE MODELS
# # ==============================

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100))
#     email = db.Column(db.String(120), unique=True)
#     phone = db.Column(db.String(20))
#     password_hash = db.Column(db.String(256))
#     role = db.Column(db.String(20), default='user')
#     is_verified = db.Column(db.Boolean, default=False)
#     otp = db.Column(db.String(6))
#     otp_expiry = db.Column(db.DateTime)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)


# class EmergencyContact(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100))
#     phone = db.Column(db.String(20))
#     relationship = db.Column(db.String(50))
#     user_id = db.Column(db.Integer)


# class SafetyLog(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer)
#     lat = db.Column(db.Float)
#     lon = db.Column(db.Float)
#     status = db.Column(db.String(50), default="Alert Triggered")
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# class SearchHistory(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer)
#     service_type = db.Column(db.String(50))
#     search_address = db.Column(db.String(200))
#     found_service_name = db.Column(db.String(200))
#     found_service_address = db.Column(db.String(200))
#     distance_km = db.Column(db.Float)
#     found_service_phone = db.Column(db.String(20))
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# with app.app_context():
#     db.create_all()

# # ==============================
# # HELPER FUNCTIONS
# # ==============================

# def hash_password(password, salt=None):
#     if not salt:
#         salt = secrets.token_hex(16)

#     hashed = hashlib.pbkdf2_hmac(
#         'sha256',
#         password.encode(),
#         salt.encode(),
#         100000
#     ).hex()

#     return f"{salt}${hashed}"


# def verify_password(password, stored):
#     try:
#         salt, _ = stored.split("$")
#         return hash_password(password, salt) == stored
#     except:
#         return False


# def send_email(receiver, subject, body):
#     try:
#         msg = EmailMessage()
#         msg.set_content(body)
#         msg['Subject'] = subject
#         msg['From'] = "your_email@gmail.com"
#         msg['To'] = receiver

#         with smtplib.SMTP("smtp.gmail.com", 587) as server:
#             server.starttls()
#             server.login("your_email@gmail.com", "your_app_password")
#             server.send_message(msg)

#         return True
#     except Exception as e:
#         print("EMAIL ERROR:", e)
#         return False


# # ==============================
# # AUTH ROUTES
# # ==============================

from flask import request, jsonify
from datetime import datetime, timedelta
import random

# Use strict_slashes=False to prevent 404s if you accidentally add a "/" at the end
@app.route("/api/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing JSON in request body'}), 400

        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')

        # 1. Validation
        if not all([name, email, phone, password]) or len(password) < 6:
            return jsonify({'error': 'All fields are required and password must be 6+ chars'}), 400

        # 2. Check for existing user
        user = User.query.filter_by(email=email).first()
        
        if user and user.is_verified:
            return jsonify({'error': 'Email already exists and is verified'}), 409

        # 3. Create or Update User (for re-sending OTP if not verified)
        if not user:
            user = User(
                name=name, 
                email=email, 
                phone=phone, 
                password_hash=hash_pw(password)
            )
            db.session.add(user)
        else:
            # Update info for existing unverified user
            user.name = name
            user.phone = phone
            user.password_hash = hash_pw(password)

        # 4. Generate and Save OTP
        otp_code = str(random.randint(100000, 999999))
        user.otp = otp_code
        # Ensure you use timezone-aware UTC if possible, or consistent with your DB
        user.otp_expiry = datetime.utcnow() + timedelta(minutes=10)
        
        db.session.commit()

        # 5. Send Email
        body = f"Hello {name}, your SafeGuard OTP is: {otp_code}. Valid for 10 minutes."
        if send_email(email, "SafeGuard Verification", body):
            return jsonify({'message': 'OTP sent successfully'}), 200
        else:
            return jsonify({'error': 'Failed to send email. Check SMTP settings.'}), 500

    except Exception as e:
        db.session.rollback()
        # Logging the error is better than just returning it
        print(f"Registration Error: {str(e)}") 
        return jsonify({'error': 'An internal server error occurred'}), 500


# Add routes for OTP verification and login


# @app.route("/api/auth/verify-otp", methods=["POST"])
# def verify_otp():
#     data = request.json

#     user = User.query.filter_by(email=data.get("email")).first()

#     if user and user.otp == data.get("otp") and datetime.utcnow() < user.otp_expiry:
#         user.is_verified = True
#         user.otp = None
#         db.session.commit()
#         return jsonify({"message": "Verified"})

#     return jsonify({"error": "Invalid OTP"}), 400


# @app.route("/api/auth/login", methods=["POST"])
# def login():
#     data = request.json

#     user = User.query.filter_by(email=data.get("email")).first()

#     if not user or not verify_password(data.get("password"), user.password_hash):
#         return jsonify({"error": "Invalid credentials"}), 401

#     if not user.is_verified:
#         return jsonify({"error": "Verify first"}), 403

#     return jsonify({
#         "message": "Login successful",
#         "user_id": user.id,
#         "email": user.email
#     })


# @app.route('/api/auth/verify-otp', methods=['POST'])
# def verify_otp():
#     try:
#         data = request.get_json()

#         email = data.get('email', '').strip().lower()
#         otp = str(data.get('otp', '')).strip()

#         if not email or not otp:
#             return jsonify({'error': 'Email and OTP are required'}), 400

#         user = User.query.filter_by(email=email).first()

#         if not user:
#             return jsonify({'error': 'User not found'}), 404

#         # 🔴 IMPORTANT FIXES
#         if not user.otp or not user.otp_expiry:
#             return jsonify({'error': 'OTP not generated'}), 400

#         if str(user.otp) != otp:
#             return jsonify({'error': 'Invalid OTP'}), 401

#         if datetime.utcnow() > user.otp_expiry:
#             return jsonify({'error': 'OTP expired'}), 401

#         # ✅ Clear OTP
#         user.otp = None
#         user.otp_expiry = None
#         db.session.commit()

#         # ✅ CREATE JWT TOKEN
       

#         return jsonify({
#             "message": "Login successful",
#             # "access_token": access_token,
#             "user": {
#                 "id": user.id,
#                 "email": user.email
#             }
#         }), 200

#     except Exception as e:
#         print("❌ VERIFY OTP ERROR:", e)
#         return jsonify({'error': 'Internal server error'}), 500


# @app.route("/api/auth/logout", methods=["POST"])
# def logout():
#     """Logout user"""
#     requests.session.clear()
#     return jsonify({'message': 'Logged out successfully'}), 200




# # ==============================
# # CONTACT ROUTES
# # ==============================

# @app.route("/api/contacts", methods=["GET"])
# def get_contacts():
#     user_id = request.args.get("user_id")

#     contacts = EmergencyContact.query.filter_by(user_id=user_id).all()

#     return jsonify([{
#         "id": c.id,
#         "name": c.name,
#         "phone": c.phone,
#         "relationship": c.relationship
#     } for c in contacts])


# @app.route("/api/contacts", methods=["POST"])
# def add_contact():
#     data = request.json

#     contact = EmergencyContact(
#         name=data.get("name"),
#         phone=data.get("phone"),
#         relationship=data.get("relationship"),
#         user_id=data.get("user_id")
#     )

#     db.session.add(contact)
#     db.session.commit()

#     return jsonify({"message": "Contact added"}), 201


# @app.route("/api/contacts/<int:id>", methods=["DELETE"])
# def delete_contact(id):
#     contact = EmergencyContact.query.get(id)

#     if not contact:
#         return jsonify({"error": "Not found"}), 404

#     db.session.delete(contact)
#     db.session.commit()

#     return jsonify({"message": "Deleted"})


# # ==============================
# # SEARCH HISTORY
# # ==============================

# @app.route("/api/search-history", methods=["POST"])
# def add_search_history():
#     data = request.json

#     record = SearchHistory(
#         user_id=data.get("user_id"),
#         service_type=data.get("service_type"),
#         search_address=data.get("search_address"),
#         found_service_name=data.get("found_service_name"),
#         distance_km=data.get("distance_km")
#     )

#     db.session.add(record)
#     db.session.commit()

#     return jsonify({"message": "Saved"})


# @app.route("/api/search-history", methods=["GET"])
# def get_search_history():
#     user_id = request.args.get("user_id")

#     records = SearchHistory.query.filter_by(user_id=user_id).all()

#     return jsonify([{
#         "service": r.service_type,
#         "distance": r.distance_km,
#         "time": r.timestamp
#     } for r in records])


# @app.route("/api/admin/search-stats", methods=["GET"])
# def search_stats():
#     stats = db.session.query(
#         SearchHistory.service_type,
#         func.count(SearchHistory.id)
#     ).group_by(SearchHistory.service_type).all()

#     return jsonify({s: c for s, c in stats})


# # ==============================
# # NEARBY SEARCH
# # ==============================

# @app.route("/api/find-nearby", methods=["POST"])
# def find_nearby():
#     data = request.json

#     lat = float(data.get("lat"))
#     lon = float(data.get("lon"))
#     user_id = data.get("user_id")

#     url = "https://overpass-api.de/api/interpreter"
#     query = f"""
#     [out:json];
#     node["amenity"="police"](around:5000,{lat},{lon});
#     out;
#     """

#     res = requests.post(url, data=query).json()

#     if not res.get("elements"):
#         return jsonify({"error": "Not found"}), 404

#     place = res["elements"][0]

#     # SAVE HISTORY
#     record = SearchHistory(
#         user_id=user_id,
#         service_type="police",
#         search_address=f"{lat},{lon}",
#         found_service_name=place.get("tags", {}).get("name"),
#         distance_km=0
#     )
#     db.session.add(record)
#     db.session.commit()

#     return jsonify(place)


# # ==============================
# # ALERT
# # ==============================

# @app.route("/api/alert", methods=["POST"])
# def alert():
#     data = request.json

#     user = User.query.filter_by(email=data.get("email")).first()

#     log = SafetyLog(
#         user_id=user.id,
#         lat=data.get("lat"),
#         lon=data.get("lon")
#     )

#     db.session.add(log)
#     db.session.commit()

#     contacts = EmergencyContact.query.filter_by(user_id=user.id).all()

#     for c in contacts:
#         send_email(c.phone, "Emergency", f"{data.get('lat')},{data.get('lon')}")

#     return jsonify({"message": "Alert sent"})


# # ==============================
# # MAIN
# # ==============================

# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)