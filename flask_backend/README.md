# SafeGuard Flask Backend API

RESTful API backend for the SafeGuard Emergency Safety Application. Provides emergency service location discovery, contact management, and alert notifications.

## 🚀 Quick Start

```bash
# Setup virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env with your credentials
cp .env.example .env

# Run the server
python app.py
```

Server will run on **http://localhost:5000**

## 📋 Features

- **Emergency Service Finder** - Uses Overpass API to find nearest police, hospitals, fire stations
- **Interactive Maps** - Generates Folium maps with service locations
- **Contact Management** - Store and manage emergency contacts with database
- **Alert System** - Send emergency alerts to contacts via email
- **Safety Logging** - Track emergency incidents with location and timestamp
- **CORS Support** - Fully enabled for Next.js frontend integration
- **Email Notifications** - Gmail SMTP integration for alerts

## 🔧 Configuration

### Environment Variables (.env)

```env
# Flask Configuration
FLASK_SECRET_KEY=your_secret_key_here
FLASK_ENV=development

# Email (Gmail SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=accident_finder_2

# Full Database URI
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
```

### Database Setup

```bash
# Create database
mysql -u root -p
> CREATE DATABASE accident_finder_2;
> EXIT;

# Tables will auto-create on first run
python app.py
```

### Gmail Configuration

1. Enable 2-Factor Authentication: [myaccount.google.com/security](https://myaccount.google.com/security)
2. Generate App Password:
   - Search "App Password" in Security settings
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
   - Paste into .env as MAIL_PASSWORD

## 📊 API Endpoints

### Health Check
```
GET /
GET /api/health

Response:
{
  "message": "SafeGuard API is running! 🛡️",
  "status": "healthy",
  "timestamp": "2024-03-10T12:00:00"
}
```

### Find Nearest Services
```
POST /api/find-nearby
Content-Type: application/json

Request:
{
  "lat": 40.7128,
  "lon": -74.0060,
  "type": "police" | "hospital" | "fire_station"
}

Response:
{
  "name": "Central Police Station",
  "distance": 0.8,
  "phone": "+1-911",
  "lat": 40.7110,
  "lon": -74.0095,
  "map_html": "<html>...</html>"
}
```

### Get Emergency Contacts
```
GET /api/contacts?user_email=user@example.com

Response:
[
  {
    "id": 1,
    "name": "Emergency Contact Name",
    "phone": "+1-555-0000",
    "email": "contact@example.com"
  }
]
```

### Add Emergency Contact
```
POST /api/contacts
Content-Type: application/json

Request:
{
  "user_email": "user@example.com",
  "name": "Emergency Contact Name",
  "phone": "+1-555-0000",
  "email": "contact@example.com"
}

Response:
{
  "id": 1,
  "name": "Emergency Contact Name",
  "phone": "+1-555-0000",
  "email": "contact@example.com"
}
```

### Trigger Emergency Alert
```
POST /api/alert
Content-Type: application/json

Request:
{
  "user_email": "user@example.com",
  "lat": 40.7128,
  "lon": -74.0060,
  "message": "Emergency situation description"
}

Response:
{
  "status": "Alert triggered",
  "contacts_notified": 3,
  "location": {"lat": 40.7128, "lon": -74.0060}
}
```

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(120) UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  last_otp_sent DATETIME
);
```

### EmergencyContact Table
```sql
CREATE TABLE emergency_contact (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120),
  user_id INT FOREIGN KEY REFERENCES user(id)
);
```

### SafetyLog Table
```sql
CREATE TABLE safety_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT FOREIGN KEY REFERENCES user(id),
  timestamp DATETIME DEFAULT NOW(),
  lat FLOAT NOT NULL,
  lon FLOAT NOT NULL,
  status VARCHAR(50) DEFAULT "Alert Triggered"
);
```

## 🗺️ Using Overpass API

The application uses the Overpass API to query OpenStreetMap data for nearby services.

### Supported Service Types
- **police** - Police stations and law enforcement
- **hospital** - Hospitals and medical centers
- **fire_station** - Fire departments and rescue services

### Search Radius
- Default: 50km radius from user location
- Results sorted by distance (nearest first)

### Example Query
```
[out:json][timeout:25];
(
  node["amenity"="police"](around:50000,40.7128,-74.0060);
  way["amenity"="police"](around:50000,40.7128,-74.0060);
  relation["amenity"="police"](around:50000,40.7128,-74.0060);
);
out center;
```

## 🐛 Troubleshooting

### Module Not Found
```bash
# Ensure requirements are installed
pip install -r requirements.txt
```

### Database Connection Error
```bash
# Verify MySQL is running and credentials are correct
mysql -u root -p
# Test connection with correct password
```

### Email Not Sending
- Verify Gmail App Password (not regular password)
- Check 2-Factor Authentication is enabled
- Verify MAIL_USERNAME and MAIL_PASSWORD in .env
- Check email configuration in app.py

### CORS Errors
- Ensure CORS is configured for your frontend URL
- Default: http://localhost:3000
- Check backend console for CORS policy errors

### Map Not Rendering
- Ensure Folium HTML is being generated correctly
- Check Overpass API response format
- Verify coordinates are valid (lat/lon)

## 📦 Dependencies

All dependencies are in `requirements.txt`:

```
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-CORS==4.0.0
requests==2.31.0
python-dotenv==1.0.0
geopy==2.3.0
folium==0.14.0
pymysql==1.1.0
```

## 🔒 Security Considerations

1. **Secret Key**: Generate a strong secret key for production
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Database**: Use strong passwords, don't commit .env to git

3. **Email**: Use App Passwords, not regular account passwords

4. **CORS**: Restrict to specific frontend domains in production

5. **HTTPS**: Enable HTTPS for all production deployments

6. **Rate Limiting**: Implement rate limiting for production

7. **Input Validation**: All inputs are validated before processing

## 🚀 Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Using Heroku
```bash
# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Create runtime.txt
echo "python-3.11.0" > runtime.txt

# Deploy
git push heroku main
```

## 📝 Logging

All errors and important events are logged to console:

```python
print("[v0] Finding police near (40.7128, -74.0060)")
print("❌ OVERPASS API ERROR: Connection timeout")
print("✅ EMAIL SENT: Alert notification")
```

## 🧪 Testing

### Test Service Finder
```bash
curl -X POST http://localhost:5000/api/find-nearby \
  -H "Content-Type: application/json" \
  -d '{"lat": 40.7128, "lon": -74.0060, "type": "police"}'
```

### Test Contact Management
```bash
# Add contact
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"user_email": "user@example.com", "name": "John", "phone": "+1-555-0000"}'

# Get contacts
curl http://localhost:5000/api/contacts?user_email=user@example.com
```

## 📞 Support

For issues or questions:
- Check Flask documentation: [flask.palletsprojects.com](https://flask.palletsprojects.com/)
- Check Overpass API: [wiki.openstreetmap.org/wiki/Overpass_API](https://wiki.openstreetmap.org/wiki/Overpass_API)
- Report bugs in GitHub Issues

## 📄 License

This project is provided as-is for educational and emergency safety purposes.

---

**SafeGuard API** - Keeping You Safe, Every Step of the Way 🛡️
