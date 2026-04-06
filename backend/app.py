# import os
# import random
# import smtplib
# import requests
# import folium
# import json
# import re
# from datetime import datetime, timedelta
# from email.message import EmailMessage
# from functools import wraps

# from flask import Flask, jsonify, redirect, render_template, request, session, url_for
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from geopy.distance import geodesic
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app, supports_credentials=True)

# # Configuration
# app.secret_key = os.getenv("FLASK_SECRET_KEY", "7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568")

# # Database Configuration
# DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///safety_app.db')
# app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 280}

# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

# # Models
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     is_verified = db.Column(db.Boolean, default=False)
#     last_otp_sent = db.Column(db.DateTime)
#     contacts = db.relationship('EmergencyContact', backref='owner', lazy=True)
#     alerts = db.relationship('SafetyLog', backref='user_rel', lazy=True)

# class EmergencyContact(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     phone = db.Column(db.String(20), nullable=False)
#     relationship = db.Column(db.String(50))
#     email = db.Column(db.String(120))
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

# class SafetyLog(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     timestamp = db.Column(db.DateTime, default=datetime.utcnow)
#     lat = db.Column(db.Float, nullable=False)
#     lon = db.Column(db.Float, nullable=False)
#     status = db.Column(db.String(50), default="Alert Triggered")
#     service_type = db.Column(db.String(50))
#     description = db.Column(db.Text)

# # Initialize database tables
# with app.app_context():
#     db.create_all()

# # Helper Functions
# def send_email(receiver_email, subject, body):
#     """Sends an email using SMTP settings from .env file."""
#     msg = EmailMessage()
#     msg.set_content(body)
#     msg['Subject'] = subject
#     msg['From'] = os.getenv('MAIL_USERNAME')
#     msg['To'] = receiver_email

#     try:
#         with smtplib.SMTP(os.getenv('MAIL_SERVER', "smtp.gmail.com"), int(os.getenv('MAIL_PORT', 587))) as server:
#             server.starttls()
#             server.login(os.getenv('MAIL_USERNAME'), os.getenv('MAIL_PASSWORD'))
#             server.send_message(msg)
#         return True
#     except Exception as e:
#         print(f"❌ EMAIL ERROR: {e}")
#         return False

# def get_nearest_amenity(lat, lon, amenity_type="police"):
#     """Queries Overpass API for the nearest amenity within 50km."""
#     url = "https://overpass-api.de/api/interpreter"
    
#     # Map amenity types
#     amenity_mapping = {
#         'police': 'police',
#         'hospital': 'hospital',
#         'fire': 'fire_station',
#         'fire_station': 'fire_station'
#     }
    
#     query_type = amenity_mapping.get(amenity_type, amenity_type)
    
#     query = f"""
#     [out:json][timeout:25];
#     (
#       node["amenity"="{query_type}"](around:50000,{lat},{lon});
#       way["amenity"="{query_type}"](around:50000,{lat},{lon});
#       relation["amenity"="{query_type}"](around:50000,{lat},{lon});
#     );
#     out center;
#     """
    
#     try:
#         headers = {"User-Agent": "SafetyApp/1.0"}
#         res = requests.post(url, data=query, headers=headers, timeout=30)
        
#         if res.status_code != 200:
#             print(f"API Status Error: {res.status_code}")
#             return None

#         data = res.json()
#         places = []

#         for e in data.get("elements", []):
#             p_lat = e.get("lat") or e.get("center", {}).get("lat")
#             p_lon = e.get("lon") or e.get("center", {}).get("lon")
#             if not p_lat or not p_lon:
#                 continue

#             tags = e.get("tags", {})
#             name = tags.get("name", f"Nearest {amenity_type.capitalize()}")
#             phone = tags.get("phone") or tags.get("contact:phone", "Not available")
#             address = tags.get("addr:full") or f"{tags.get('addr:street', '')}, {tags.get('addr:city', '')}"
#             dist = geodesic((lat, lon), (p_lat, p_lon)).km

#             places.append({
#                 "name": name,
#                 "lat": p_lat,
#                 "lon": p_lon,
#                 "dist": dist,
#                 "phone": phone,
#                 "address": address
#             })

#         return min(places, key=lambda x: x["dist"]) if places else None

#     except Exception as e:
#         print(f"❌ OVERPASS API ERROR: {e}")
#         return None

# def require_session(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         if "user" not in session:
#             return jsonify({"error": "Unauthorized"}), 401
#         return f(*args, **kwargs)
#     return decorated_function

# # API Routes
# @app.route('/api/login', methods=['POST'])
# def login():
#     """Send OTP to email for login"""
#     email = request.json.get('email', '').strip()
    
    
#     if not email:
#         return jsonify({"error": "Email is required"}), 400
    
#     otp = str(random.randint(100000, 999999))
#     session['otp'] = otp
#     session['temp_user'] = email
#     session['otp_timestamp'] = datetime.utcnow().isoformat()
    
#     # Send OTP email
#     subject = "Safety App - Your OTP"
#     body = f"""
#     Your Safety App verification code is: {otp}
    
#     This code will expire in 5 minutes.
    
#     Do not share this code with anyone.
    
#     - Safety Team
#     """
    
#     success = send_email(email, subject, body)
    
#     if not success:
#         print(f"📨 DEBUG OTP (Email failed): {otp}")
    
#     return jsonify({"message": "OTP sent to email", "debug_otp": otp if not success else None}), 200

# @app.route('/api/verify-otp', methods=['POST'])
# def verify_otp():
#     """Verify OTP and create/login user"""
#     entered_otp = request.json.get('otp', '')
    
#     if entered_otp != session.get('otp'):
#         return jsonify({"error": "Invalid OTP"}), 401
    
#     # Check if OTP has expired (5 minutes)
#     otp_timestamp = datetime.fromisoformat(session.get('otp_timestamp', datetime.utcnow().isoformat()))
#     if datetime.utcnow() - otp_timestamp > timedelta(minutes=5):
#         return jsonify({"error": "OTP expired"}), 401
    
#     email = session.get('temp_user')
    
#     # Create or get user
#     user = User.query.filter_by(email=email).first()
#     if not user:
#         user = User(email=email, is_verified=True)
#         db.session.add(user)
#     else:
#         user.is_verified = True
    
#     db.session.commit()
#     session['user'] = email
#     session['user_id'] = user.id
    
#     return jsonify({"message": "OTP verified", "user_id": user.id}), 200

# @app.route('/api/find-nearby', methods=['POST'])
# @require_session
# def find_nearby():
#     """Find nearby emergency services"""
#     data = request.json
#     lat = float(data.get('lat'))
#     lon = float(data.get('lon'))
#     service_type = data.get('type', 'police')
    
#     nearest = get_nearest_amenity(lat, lon, service_type)
    
#     if not nearest:
#         return jsonify({"error": f"No {service_type} found nearby"}), 404
    
#     # Create map
#     m = folium.Map(
#         location=[lat, lon],
#         zoom_start=14,
#         tiles='OpenStreetMap'
#     )
    
#     # Add user location
#     folium.Marker(
#         [lat, lon],
#         popup="Your Location",
#         icon=folium.Icon(color="blue", icon="user")
#     ).add_to(m)
    
#     # Add service location
#     icon_color = "red" if service_type == "police" else "green" if service_type == "hospital" else "orange"
#     folium.Marker(
#         [nearest["lat"], nearest["lon"]],
#         popup=nearest["name"],
#         icon=folium.Icon(color=icon_color, icon="info-sign")
#     ).add_to(m)
    
#     # Add line between locations
#     folium.PolyLine(
#         locations=[[lat, lon], [nearest["lat"], nearest["lon"]]],
#         color="red",
#         weight=2,
#         opacity=0.7
#     ).add_to(m)
    
#     # Log this alert
#     if 'user_id' in session:
#         log = SafetyLog(
#             user_id=session['user_id'],
#             lat=lat,
#             lon=lon,
#             service_type=service_type,
#             status="Searched"
#         )
#         db.session.add(log)
#         db.session.commit()
    
#     return jsonify({
#         "name": nearest["name"],
#         "distance": round(nearest["dist"], 2),
#         "phone": nearest["phone"],
#         "address": nearest["address"],
#         "lat": nearest["lat"],
#         "lon": nearest["lon"],
#         "map_html": m._repr_html_(),
#         "directions_url": f"https://www.google.com/maps/dir/?api=1&origin={lat},{lon}&destination={nearest['lat']},{nearest['lon']}"
#     }), 200

# @app.route('/api/add-emergency-contact', methods=['POST'])
# @require_session
# def add_emergency_contact():
#     """Add an emergency contact"""
#     data = request.json
    
#     contact = EmergencyContact(
#         name=data.get('name'),
#         phone=data.get('phone'),
#         relationship=data.get('relationship'),
#         email=data.get('email'),
#         user_id=session['user_id']
#     )
    
#     db.session.add(contact)
#     db.session.commit()
    
#     return jsonify({
#         "message": "Contact added successfully",
#         "contact_id": contact.id
#     }), 201

# @app.route('/api/emergency-contacts', methods=['GET'])
# @require_session
# def get_emergency_contacts():
#     """Get user's emergency contacts"""
#     user_id = session['user_id']
#     contacts = EmergencyContact.query.filter_by(user_id=user_id).all()
    
#     return jsonify([{
#         "id": c.id,
#         "name": c.name,
#         "phone": c.phone,
#         "relationship": c.relationship,
#         "email": c.email
#     } for c in contacts]), 200

# @app.route('/api/delete-contact/<int:contact_id>', methods=['DELETE'])
# @require_session
# def delete_contact(contact_id):
#     """Delete an emergency contact"""
#     user_id = session['user_id']
#     contact = EmergencyContact.query.filter_by(id=contact_id, user_id=user_id).first()
    
#     if not contact:
#         return jsonify({"error": "Contact not found"}), 404
    
#     db.session.delete(contact)
#     db.session.commit()
    
#     return jsonify({"message": "Contact deleted"}), 200

# @app.route('/api/emergency-alert', methods=['POST'])
# @require_session
# def emergency_alert():
#     """Trigger an emergency alert"""
#     data = request.json
#     lat = float(data.get('lat'))
#     lon = float(data.get('lon'))
#     description = data.get('description', '')
#     emergency_type = data.get('type', 'general')
    
#     # Create alert log
#     log = SafetyLog(
#         user_id=session['user_id'],
#         lat=lat,
#         lon=lon,
#         service_type=emergency_type,
#         status="Alert Triggered",
#         description=description
#     )
#     db.session.add(log)
#     db.session.commit()
    
#     # Get user's contacts
#     user = User.query.get(session['user_id'])
#     contacts = user.contacts
    
#     # Send notifications to contacts
#     for contact in contacts:
#         subject = f"EMERGENCY ALERT from {user.email}"
#         body = f"""
#         EMERGENCY ALERT
        
#         {user.email} has triggered an emergency alert.
#         Location: https://www.google.com/maps?q={lat},{lon}
        
#         Description: {description}
#         Type: {emergency_type}
        
#         Please check on them immediately if possible.
        
#         - Safety Team
#         """
        
#         if contact.email:
#             send_email(contact.email, subject, body)
    
#     return jsonify({
#         "message": "Emergency alert sent",
#         "alert_id": log.id,
#         "notifications_sent": len(contacts)
#     }), 201

# @app.route('/api/ai-alert', methods=['POST'])
# def ai_alert():
#     """AI-powered emergency analysis"""
#     data = request.json
#     description = data.get('description', '')
    
#     # Comprehensive keyword-based analysis
#     severity_keywords = {
#         'CRITICAL': [
#             'unconscious', 'unresponsive', 'not breathing', 'stopped breathing',
#             'cardiac arrest', 'heart attack', 'severe bleeding', 'heavy bleeding',
#             'choking', 'poisoning', 'overdose', 'fire', 'explosion', 'electrocution',
#             'stroke', 'anaphylaxis', 'allergic reaction', 'drowning', 'severe burns',
#             'crush injury', 'impaled object', 'multiple injuries'
#         ],
#         'HIGH': [
#             'injured', 'accident', 'car accident', 'poisoned', 'bleeding',
#             'broken', 'fracture', 'severe pain', 'difficulty breathing',
#             'chest pain', 'head injury', 'loss of consciousness', 'violent',
#             'assault', 'stab', 'gunshot', 'severe burn', 'toxic', 'chemical'
#         ],
#         'MEDIUM': [
#             'moderate pain', 'sprain', 'minor bleeding', 'nausea', 'vomiting',
#             'dizzy', 'dizziness', 'cut', 'wound', 'burn', 'twisted ankle',
#             'allergic', 'fever', 'severe cough', 'unable to move', 'panic'
#         ],
#         'LOW': [
#             'help', 'lost', 'assistance', 'question', 'general inquiry',
#             'guidance', 'information', 'minor cut'
#         ]
#     }
    
#     description_lower = description.lower()
#     severity = 'MEDIUM'
    
#     for level in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
#         if any(keyword in description_lower for keyword in severity_keywords[level]):
#             severity = level
#             break
    
#     # Generate personalized recommendations
#     recommendations = {
#         'CRITICAL': 'CALL 112 IMMEDIATELY! This is a life-threatening emergency. Provide your location and describe the situation clearly to the operator.',
#         'HIGH': 'Call 112 now. This is a serious situation requiring immediate medical attention. Stay on the line with the operator.',
#         'MEDIUM': 'Call 112 or visit the nearest hospital/clinic. Seek medical evaluation for your symptoms.',
#         'LOW': 'Contact your local police (100) or emergency services for guidance and assistance.'
#     }
    
#     # Recommend specific services
#     services_mapping = {
#         'CRITICAL': ['hospital', 'police', 'fire'] if any(kw in description_lower for kw in ['fire', 'explosion', 'chemical', 'toxic']) else ['hospital', 'police'],
#         'HIGH': ['hospital', 'police'],
#         'MEDIUM': ['hospital'],
#         'LOW': ['police']
#     }
    
#     return jsonify({
#         "severity": severity,
#         "recommendation": recommendations[severity],
#         "services_needed": services_mapping[severity],
#         "reasoning": f"Analysis shows {severity.lower()}-level emergency based on: {description[:80]}..."
#     }), 200

# @app.route('/api/logout', methods=['POST'])
# def logout():
#     """Logout user"""
#     session.clear()
#     return jsonify({"message": "Logged out"}), 200

# @app.route('/api/health', methods=['GET'])
# def health():
#     """Health check endpoint"""
#     return jsonify({"status": "healthy"}), 200

# # Error handlers
# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({"error": "Not found"}), 404

# @app.errorhandler(500)
# def server_error(error):
#     return jsonify({"error": "Server error"}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)


"""
SafeGuard Flask Backend
Provides authentication, search history tracking, and emergency service APIs
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from functools import wraps
import jwt

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', 
    'sqlite:////vercel/share/v0-project/backend/instance/safeguard.db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['JWT_EXPIRATION'] = 24 * 60 * 60  # 24 hours

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# ============================================================================
# DATABASE MODELS
# ============================================================================

class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    city = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    search_records = db.relationship('SearchRecord', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'phone': self.phone,
            'city': self.city,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    def generate_token(self):
        """Generate JWT token"""
        payload = {
            'user_id': self.id,
            'email': self.email,
            'exp': datetime.utcnow() + timedelta(seconds=app.config['JWT_EXPIRATION'])
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


class SearchRecord(db.Model):
    """Track all searches for audit and analytics"""
    __tablename__ = 'search_records'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # WHO searched
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # WHAT was searched
    service_type = db.Column(db.String(50), nullable=False, index=True)  # 'police', 'hospital', 'fire'
    
    # WHERE was searched from
    search_location_name = db.Column(db.String(255))
    user_lat = db.Column(db.Float, nullable=False)
    user_lon = db.Column(db.Float, nullable=False)
    search_address = db.Column(db.String(255))
    
    # WHAT was found
    found_service_id = db.Column(db.Integer)
    found_service_name = db.Column(db.String(255))
    found_service_type = db.Column(db.String(50))
    found_service_lat = db.Column(db.Float)
    found_service_lon = db.Column(db.Float)
    found_service_phone = db.Column(db.String(20))
    found_service_address = db.Column(db.String(255))
    
    # Additional details
    distance_km = db.Column(db.Float)
    search_results_count = db.Column(db.Integer, default=1)
    
    # WHEN was searched
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Device/IP tracking
    ip_address = db.Column(db.String(45))
    device_info = db.Column(db.String(255))
    
    # Metadata
    is_deleted = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'service_type': self.service_type,
            'search_location_name': self.search_location_name,
            'user_lat': self.user_lat,
            'user_lon': self.user_lon,
            'search_address': self.search_address,
            'found_service_name': self.found_service_name,
            'found_service_type': self.found_service_type,
            'found_service_lat': self.found_service_lat,
            'found_service_lon': self.found_service_lon,
            'found_service_phone': self.found_service_phone,
            'found_service_address': self.found_service_address,
            'distance_km': self.distance_km,
            'search_results_count': self.search_results_count,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'ip_address': self.ip_address,
            'device_info': self.device_info,
        }

# ============================================================================
# AUTHENTICATION DECORATORS
# ============================================================================

def token_required(f):
    """Decorator to protect routes requiring authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(payload['user_id'])
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('email') or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Email, username, and password are required'}), 400
        
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create user
        user = User(
            email=data['email'],
            username=data['username'],
            phone=data.get('phone', ''),
            city=data.get('city', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict(),
            'token': user.generate_token()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': user.generate_token()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user info"""
    return jsonify({
        'user': current_user.to_dict()
    }), 200


@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout(current_user):
    """Logout user (frontend should delete token)"""
    return jsonify({'message': 'Logged out successfully'}), 200

# ============================================================================
# SEARCH HISTORY ROUTES
# ============================================================================

@app.route('/api/search-history', methods=['GET'])
@token_required
def get_search_history(current_user):
    """Get user's search history with filters"""
    try:
        # Get query parameters
        service_type = request.args.get('service_type')
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        query = SearchRecord.query.filter_by(user_id=current_user.id, is_deleted=False)
        
        if service_type:
            query = query.filter_by(service_type=service_type)
        
        # Order by most recent first
        total = query.count()
        records = query.order_by(SearchRecord.timestamp.desc()).limit(limit).offset(offset).all()
        
        return jsonify({
            'total': total,
            'limit': limit,
            'offset': offset,
            'records': [record.to_dict() for record in records]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/search-history', methods=['POST'])
@token_required
def create_search_record(current_user):
    """Log a new search"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['service_type', 'user_lat', 'user_lon']
        if not all(field in data for field in required_fields):
            return jsonify({'error': f'Required fields: {", ".join(required_fields)}'}), 400
        
        # Get device info
        device_info = request.headers.get('User-Agent', 'Unknown')
        ip_address = request.remote_addr
        
        record = SearchRecord(
            user_id=current_user.id,
            service_type=data['service_type'],
            search_location_name=data.get('search_location_name'),
            user_lat=float(data['user_lat']),
            user_lon=float(data['user_lon']),
            search_address=data.get('search_address'),
            found_service_id=data.get('found_service_id'),
            found_service_name=data.get('found_service_name'),
            found_service_type=data.get('found_service_type'),
            found_service_lat=data.get('found_service_lat'),
            found_service_lon=data.get('found_service_lon'),
            found_service_phone=data.get('found_service_phone'),
            found_service_address=data.get('found_service_address'),
            distance_km=data.get('distance_km'),
            search_results_count=data.get('search_results_count', 1),
            ip_address=ip_address,
            device_info=device_info
        )
        
        db.session.add(record)
        db.session.commit()
        
        return jsonify({
            'message': 'Search recorded successfully',
            'record': record.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/search-history/<int:record_id>', methods=['DELETE'])
@token_required
def delete_search_record(current_user, record_id):
    """Soft delete a search record"""
    try:
        record = SearchRecord.query.get(record_id)
        
        if not record:
            return jsonify({'error': 'Record not found'}), 404
        
        if record.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        record.is_deleted = True
        db.session.commit()
        
        return jsonify({'message': 'Record deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/search-stats', methods=['GET'])
@token_required
def get_search_stats(current_user):
    """Get search analytics for current user"""
    try:
        records = SearchRecord.query.filter_by(user_id=current_user.id, is_deleted=False).all()
        
        # Calculate statistics
        total_searches = len(records)
        service_types = {}
        
        for record in records:
            if record.service_type:
                service_types[record.service_type] = service_types.get(record.service_type, 0) + 1
        
        # Get most recent 5 searches
        recent_searches = sorted(records, key=lambda x: x.timestamp or datetime.min, reverse=True)[:5]
        
        return jsonify({
            'total_searches': total_searches,
            'by_service_type': service_types,
            'recent_searches': [r.to_dict() for r in recent_searches]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# UTILITY ROUTES
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

# ============================================================================
# DATABASE INITIALIZATION
# ============================================================================

def init_db():
    """Initialize database"""
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)

