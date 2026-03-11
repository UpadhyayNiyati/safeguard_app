import os
import random
import smtplib
import requests
import folium
from datetime import datetime, timedelta
from email.message import EmailMessage
from flask import Flask, jsonify, redirect, render_template, request, session, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from geopy.distance import geodesic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")

# Enable CORS for Next.js frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Database Configuration
DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///safety_app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 280}

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    last_otp_sent = db.Column(db.DateTime)
    contacts = db.relationship('EmergencyContact', backref='owner', lazy=True)

class EmergencyContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class SafetyLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Alert Triggered")

# Initialize database tables
with app.app_context():
    db.create_all()

# Helper Functions
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

# Routes
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "SafeGuard API is running! 🛡️"})

@app.route("/api/find-nearby", methods=["POST"])
def find_nearby():
    """Find nearest emergency service"""
    try:
        data = request.get_json()
        user_lat = float(data.get("lat"))
        user_lon = float(data.get("lon"))
        service_type = data.get("type", "police")

        print(f"[v0] Finding {service_type} near ({user_lat}, {user_lon})")

        # Map service types to OSM amenity names
        amenity_map = {
            "police": "police",
            "hospital": "hospital",
            "fire_station": "fire_station",
            "fire": "fire_station"
        }

        amenity = amenity_map.get(service_type, service_type)
        nearest = get_nearest_amenity(user_lat, user_lon, amenity)

        if not nearest:
            return jsonify({"error": f"No {service_type} found nearby"}), 404

        # Generate map with Folium
        m = folium.Map(
            location=[user_lat, user_lon],
            zoom_start=14,
            tiles="OpenStreetMap"
        )

        # User marker
        folium.Marker(
            [user_lat, user_lon],
            popup="Your Location",
            icon=folium.Icon(color="blue", icon="info-sign")
        ).add_to(m)

        # Service marker
        service_colors = {
            "police": "red",
            "hospital": "green",
            "fire_station": "orange"
        }
        color = service_colors.get(amenity, "blue")

        folium.Marker(
            [nearest["lat"], nearest["lon"]],
            popup=f"<b>{nearest['name']}</b><br/>Phone: {nearest['phone']}<br/>Distance: {nearest['dist']:.2f} km",
            icon=folium.Icon(color=color, icon="info-sign")
        ).add_to(m)

        map_html = m._repr_html_()

        return jsonify({
            "name": nearest["name"],
            "distance": round(nearest["dist"], 2),
            "phone": nearest["phone"],
            "lat": nearest["lat"],
            "lon": nearest["lon"],
            "map_html": map_html
        })

    except Exception as e:
        print(f"❌ ERROR: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/contacts", methods=["GET"])
def get_contacts():
    """Get all contacts for logged-in user"""
    try:
        user_email = request.args.get("user_email")
        if not user_email:
            return jsonify({"error": "User email required"}), 400

        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify([])

        contacts = [{
            "id": c.id,
            "name": c.name,
            "phone": c.phone,
            "email": c.email
        } for c in user.contacts]

        return jsonify(contacts)

    except Exception as e:
        print(f"❌ ERROR: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/contacts", methods=["POST"])
def add_contact():
    """Add emergency contact"""
    try:
        data = request.get_json()
        user_email = data.get("user_email")
        name = data.get("name")
        phone = data.get("phone")
        email = data.get("email")

        if not all([user_email, name, phone]):
            return jsonify({"error": "Missing required fields"}), 400

        user = User.query.filter_by(email=user_email).first()
        if not user:
            user = User(email=user_email, is_verified=True)
            db.session.add(user)
            db.session.commit()

        contact = EmergencyContact(
            name=name,
            phone=phone,
            email=email,
            user_id=user.id
        )
        db.session.add(contact)
        db.session.commit()

        return jsonify({
            "id": contact.id,
            "name": contact.name,
            "phone": contact.phone,
            "email": contact.email
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ ERROR: {e}")
        return jsonify({"error": str(e)}), 500

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

        # Log the alert
        log = SafetyLog(
            user_id=user.id,
            lat=lat,
            lon=lon,
            status=message
        )
        db.session.add(log)
        db.session.commit()

        # Send alerts to emergency contacts
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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
