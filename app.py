import os
import random
import smtplib
import requests
import folium
from datetime import datetime, timedelta
from email.message import EmailMessage

from flask import Flask, jsonify, redirect, render_template, request, session, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from geopy.distance import geodesic
from dotenv import load_dotenv

# ============ CONFIGURATION ============
load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)  # Enable CORS for frontend communication
app.secret_key = os.getenv("FLASK_SECRET_KEY", "7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568")

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///safety_app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 280}

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# ============ MODELS ============
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    last_otp_sent = db.Column(db.DateTime)
    contacts = db.relationship('EmergencyContact', backref='owner', lazy=True, cascade='all, delete-orphan')

class EmergencyContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    relationship = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class SafetyLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Alert Triggered")
    amenity_type = db.Column(db.String(50), default="police")

# Initialize database tables
with app.app_context():
    db.create_all()

# ============ HELPERS ============
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
    
    amenity_mapping = {
        'police': 'police',
        'hospital': 'hospital',
        'fire_station': 'fire_station'
    }
    
    query_type = amenity_mapping.get(amenity_type, 'police')
    
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="{query_type}"](around:50000,{lat},{lon});
      way["amenity"="{query_type}"](around:50000,{lat},{lon});
      relation["amenity"="{query_type}"](around:50000,{lat},{lon});
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
            name = tags.get("name", f"Nearest {query_type.capitalize()}")
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

# ============ ROUTES ============

# PAGE ROUTES
@app.route("/")
def index():
    if "user" in session:
        return render_template("home.html")
    return redirect(url_for("login"))

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/support")
def support():
    return render_template("support.html")

@app.route("/emergency-contacts")
def emergency_contacts():
    if "user" not in session:
        return redirect(url_for("login"))
    
    user = User.query.filter_by(email=session.get("user")).first()
    contacts = user.contacts if user else []
    return render_template("emergency_contacts.html", contacts=contacts)

# AUTH ROUTES
@app.route("/register", methods=["POST"])
def register():
    try:
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        
        if not email or not name:
            return jsonify({"error": "Name and email are required"}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 400
        
        # Generate OTP for verification
        otp = str(random.randint(1000, 9999))
        session["otp"] = otp
        session["temp_user"] = email
        session["temp_name"] = name
        
        # Send OTP email
        success = send_email(email, "Your Safety App Verification Code", 
                           f"Your verification code is: {otp}\n\nThis code expires in 10 minutes.")
        if not success:
            print(f"📨 DEBUG OTP (Email failed): {otp}")
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email").strip()
        otp = str(random.randint(1000, 9999))
        session["otp"] = otp
        session["temp_user"] = email

        success = send_email(email, "Your Safety App OTP", f"Your verification code is: {otp}\n\nThis code expires in 10 minutes.")
        if not success:
            print(f"📨 DEBUG OTP (Email failed): {otp}")

        return render_template("otp.html")
    return render_template("login.html")

@app.route("/verify_otp", methods=["POST"])
def verify_otp():
    entered_otp = request.form.get("otp")

    if entered_otp == session.get("otp"):
        email = session.get("temp_user")

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, is_verified=True)
            db.session.add(user)
        else:
            user.is_verified = True

        db.session.commit()
        session["user"] = email
        return redirect(url_for("index"))

    return render_template("otp.html", error="Invalid OTP. Please try again.")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# API ROUTES
@app.route("/find_nearest", methods=["POST"])
def find_nearest():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        user_lat = float(data.get("lat"))
        user_lon = float(data.get("lon"))
        amenity_type = data.get("type", "police")
        
        nearest = get_nearest_amenity(user_lat, user_lon, amenity_type)
        if not nearest:
            return jsonify({"error": f"No {amenity_type} found nearby"}), 404

        # Save safety log
        user = User.query.filter_by(email=session.get("user")).first()
        if user:
            log = SafetyLog(
                user_id=user.id,
                lat=user_lat,
                lon=user_lon,
                amenity_type=amenity_type
            )
            db.session.add(log)
            db.session.commit()

        # Create map
        m = folium.Map(location=[user_lat, user_lon], zoom_start=14)
        folium.Marker(
            [user_lat, user_lon],
            popup="📍 Your Location",
            icon=folium.Icon(color="blue", icon="location")
        ).add_to(m)
        folium.Marker(
            [nearest["lat"], nearest["lon"]],
            popup=f"{nearest['name']}<br>Phone: {nearest['phone']}",
            icon=folium.Icon(color="red", icon="info-sign")
        ).add_to(m)

        phone_uri = f"tel:{nearest['phone'].replace(' ', '')}" if nearest['phone'] != "Not available" else "#"

        return jsonify({
            "name": nearest["name"],
            "distance": round(nearest["dist"], 2),
            "phone": nearest["phone"],
            "phone_uri": phone_uri,
            "map_html": m._repr_html_()
        })

    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@app.route("/add-contact", methods=["POST"])
def add_contact():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        user = User.query.filter_by(email=session.get("user")).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        contact = EmergencyContact(
            name=data.get("name"),
            phone=data.get("phone"),
            email=data.get("email"),
            relationship=data.get("relationship"),
            user_id=user.id
        )
        db.session.add(contact)
        db.session.commit()

        return jsonify({"success": True, "contact_id": contact.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete-contact/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        user = User.query.filter_by(email=session.get("user")).first()
        contact = EmergencyContact.query.filter_by(id=contact_id, user_id=user.id).first()
        
        if not contact:
            return jsonify({"error": "Contact not found"}), 404

        db.session.delete(contact)
        db.session.commit()

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-contacts", methods=["GET"])
def get_contacts():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        user = User.query.filter_by(email=session.get("user")).first()
        contacts = [{
            "id": c.id,
            "name": c.name,
            "phone": c.phone,
            "email": c.email,
            "relationship": c.relationship
        } for c in user.contacts] if user else []
        
        return jsonify({"contacts": contacts})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/send-message", methods=["POST"])
def send_message():
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        if not all([name, email, subject, message]):
            return jsonify({"error": "All fields are required"}), 400
        
        # Send email to admin/support
        admin_email = os.getenv('MAIL_USERNAME')
        email_body = f"""
New Contact Form Submission

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
"""
        send_email(admin_email, f"New Contact: {subject}", email_body)
        
        # Send confirmation email to user
        user_confirmation = f"""
Thank you for contacting Safety Assistant!

We've received your message and will get back to you as soon as possible.

Best regards,
Safety Assistant Team
"""
        send_email(email, "We received your message", user_confirmation)
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/contact-form", methods=["POST"])
def contact_form():
    try:
        data = request.get_json()
        
        # Send email to admin/support
        admin_email = os.getenv('MAIL_USERNAME')
        subject = f"New Contact Form Submission from {data.get('name')}"
        body = f"""
Name: {data.get('name')}
Email: {data.get('email')}
Phone: {data.get('phone')}
Message: {data.get('message')}
"""
        send_email(admin_email, subject, body)
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# New Enhanced API Endpoints for Frontend
@app.route("/api/find-nearby", methods=["POST"])
def api_find_nearby():
    """API endpoint to find nearby emergency services"""
    try:
        data = request.get_json()
        user_lat = float(data.get('lat'))
        user_lon = float(data.get('lon'))
        amenity_type = data.get('type', 'police')
        
        nearest = get_nearest_amenity(user_lat, user_lon, amenity_type)
        
        if not nearest:
            return jsonify({"error": f"No {amenity_type} found nearby"}), 404
        
        # Save safety log if user is logged in
        if "user" in session:
            user = User.query.filter_by(email=session.get("user")).first()
            if user:
                log = SafetyLog(
                    user_id=user.id,
                    lat=user_lat,
                    lon=user_lon,
                    amenity_type=amenity_type
                )
                db.session.add(log)
                db.session.commit()
        
        # Create map
        m = folium.Map(location=[user_lat, user_lon], zoom_start=14)
        folium.Marker(
            [user_lat, user_lon],
            popup="📍 Your Location",
            icon=folium.Icon(color="blue", icon="location")
        ).add_to(m)
        
        color_map = {'police': 'red', 'hospital': 'green', 'fire_station': 'orange'}
        folium.Marker(
            [nearest["lat"], nearest["lon"]],
            popup=f"{nearest['name']}<br>Phone: {nearest['phone']}",
            icon=folium.Icon(color=color_map.get(amenity_type, 'red'), icon="info-sign")
        ).add_to(m)
        
        return jsonify({
            "name": nearest["name"],
            "distance": round(nearest["dist"], 2),
            "phone": nearest["phone"],
            "lat": nearest["lat"],
            "lon": nearest["lon"],
            "map_html": m._repr_html_()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def api_health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Safety App Backend Running"})

@app.route("/api/nearby-services", methods=["POST"])
def api_nearby_services():
    """Find all nearby services (police, hospital, fire station)"""
    try:
        data = request.get_json()
        user_lat = float(data.get('lat'))
        user_lon = float(data.get('lon'))
        
        services = {}
        for service_type in ['police', 'hospital', 'fire_station']:
            nearest = get_nearest_amenity(user_lat, user_lon, service_type)
            if nearest:
                services[service_type] = nearest
        
        # Create combined map
        m = folium.Map(location=[user_lat, user_lon], zoom_start=13)
        folium.Marker(
            [user_lat, user_lon],
            popup="📍 Your Location",
            icon=folium.Icon(color="blue", icon="user")
        ).add_to(m)
        
        color_map = {'police': 'red', 'hospital': 'green', 'fire_station': 'orange'}
        for service_type, service in services.items():
            folium.Marker(
                [service["lat"], service["lon"]],
                popup=f"{service['name']}<br>Phone: {service['phone']}",
                icon=folium.Icon(color=color_map.get(service_type, 'gray'), icon="info-sign")
            ).add_to(m)
        
        return jsonify({
            "services": services,
            "map_html": m._repr_html_()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
