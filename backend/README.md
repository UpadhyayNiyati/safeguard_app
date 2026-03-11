# SafeGuard Backend - Flask API

A comprehensive Flask backend for the SafeGuard emergency safety application providing location-based emergency services, AI-powered analysis, and contact management.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- MySQL Server (or SQLite for development)
- pip package manager

### 1. Installation

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_PORT=5000
FLASK_SECRET_KEY=7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568

# Database (MySQL)
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Niya@1820
DB_NAME=accident_finder_2

# Email (Gmail SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb

# AI Integration (Optional)
ANTHROPIC_API_KEY=your_anthropic_key_here

# Emergency Numbers (India)
EMERGENCY_POLICE=100
EMERGENCY_AMBULANCE=102
EMERGENCY_FIRE=101
EMERGENCY_ALL=112
```

### 3. Database Setup

**For MySQL:**

```bash
# Create database
mysql -u root -p
CREATE DATABASE accident_finder_2;
EXIT;

# Then in Python:
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

**For SQLite (Development):**

Just update `.env`:
```env
DATABASE_URI=sqlite:///safety_app.db
```

### 4. Running the Server

```bash
python app.py
```

Server will start at `http://localhost:5000`

**Production Mode (with Gunicorn):**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
Response: {"status": "ok", "message": "SafeGuard backend is running"}
```

### Find Nearby Services
```
POST /api/find-nearby
Headers: Content-Type: application/json
Body: {
  "lat": 28.6139,
  "lon": 77.2090,
  "type": "police|hospital|fire_station"
}
Response: {
  "name": "Police Station Name",
  "distance": 2.5,
  "phone": "100",
  "address": "Station Address",
  "lat": 28.6149,
  "lon": 77.2100,
  "map_html": "<folium map HTML>",
  "directions_url": "Google Maps URL"
}
```

### AI Emergency Analysis
```
POST /api/ai-alert
Headers: Content-Type: application/json
Body: {
  "description": "Person injured in car accident",
  "location": {"lat": 28.6139, "lng": 77.2090},
  "contacts": []
}
Response: {
  "severity": "CRITICAL|HIGH|MEDIUM|LOW",
  "recommendation": "Suggested action",
  "services_needed": ["hospital", "police"],
  "reasoning": "Why this severity level"
}
```

### Multiple Services Search
```
POST /api/multiple-services
Body: {
  "lat": 28.6139,
  "lon": 77.2090,
  "types": ["police", "hospital", "fire"]
}
```

### Send Contact Message
```
POST /api/contact/send
Body: {
  "name": "John",
  "email": "john@example.com",
  "message": "Your message"
}
```

## ✨ Features

✅ **Real-time Location Services** - Find nearest police, hospitals, fire departments
✅ **AI Emergency Analysis** - Intelligent severity assessment with Claude AI
✅ **Interactive Maps** - Folium-based visualization with directions
✅ **Emergency Contacts** - Store and manage important contact numbers
✅ **Safety Logging** - Track all emergency alerts and searches
✅ **Email Notifications** - Alert emergency contacts automatically
✅ **Multi-Database Support** - MySQL, PostgreSQL, SQLite compatible
✅ **CORS Enabled** - Full frontend-backend integration support
✅ **Production Ready** - Comprehensive error handling and logging

## 🇮🇳 Emergency Numbers (India)
- **Police:** 100
- **Ambulance:** 102
- **Fire:** 101
- **All Services:** 112

## Database Models

### User
- Email (unique)
- Is Verified
- Emergency Contacts (relationship)
- Safety Logs (relationship)

### EmergencyContact
- Name
- Phone
- Relationship
- Email
- User ID (foreign key)

### SafetyLog
- User ID (foreign key)
- Timestamp
- Latitude
- Longitude
- Status
- Service Type
- Description

## 🔧 Configuration

### CORS Setup
CORS is enabled for all origins in development. For production, modify in `app.py`:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})
```

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| FLASK_ENV | dev/production | development |
| FLASK_SECRET_KEY | Session secret | 7c917997c5f... |
| DATABASE_URI | Database URL | mysql+pymysql://... |
| MAIL_USERNAME | Gmail address | your@gmail.com |
| MAIL_PASSWORD | App password | abcd efgh ijkl mnop |
| ANTHROPIC_API_KEY | Claude API key | sk-ant-... |

## 🐛 Troubleshooting

### Email Not Sending
```
1. Verify Gmail 2-Factor Authentication is enabled
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-character App Password (not your Gmail password)
4. Ensure MAIL_USERNAME and MAIL_PASSWORD are correct in .env
5. Check firewall/antivirus blocking SMTP port 587
```

### Database Connection Error
```
Error: "Can't connect to MySQL server"
Solution:
1. Start MySQL: sudo service mysql start
2. Check DATABASE_URI format: mysql+pymysql://user:pass@host:port/db
3. Verify credentials: mysql -u root -p
4. Ensure database exists: CREATE DATABASE accident_finder_2;
```

### Location Services Not Working
```
Issue: API returns null for nearby services
Solution:
1. Check internet connection
2. Verify lat/lon are valid floats
3. Test Overpass API: https://overpass-api.de/api/interpreter
4. Increase radius in request if no results in 50km
```

### CORS Errors
```
Error: "Access to XMLHttpRequest blocked by CORS policy"
Solution:
1. Ensure CORS(app) is enabled in app.py
2. Check frontend URL is in CORS origins
3. Verify preflight requests are allowed
```

### Slow Response Times
```
Solution:
1. Optimize database queries
2. Use connection pooling: pool_recycle=280
3. Cache frequently requested data
4. Consider caching Overpass API responses
```

## 📦 Database Backup

```bash
# MySQL Backup
mysqldump -u root -p accident_finder_2 > backup.sql

# MySQL Restore
mysql -u root -p accident_finder_2 < backup.sql

# SQLite Backup
cp safety_app.db safety_app.db.backup
```

## 🚀 Production Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
```

### Using Docker

```dockerfile
FROM python:3.9
WORKDIR /backend
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Environment for Production

```env
FLASK_ENV=production
FLASK_DEBUG=0
DATABASE_URI=mysql+pymysql://prod_user:secure_pass@db_host/db_name
MAIL_USERNAME=alerts@yourdomain.com
MAIL_PASSWORD=app_password_here
```

### Security Checklist

- ✅ Use HTTPS/SSL certificates
- ✅ Set strong FLASK_SECRET_KEY
- ✅ Use environment variables for secrets
- ✅ Enable input validation
- ✅ Set appropriate CORS origins
- ✅ Use database credentials safely
- ✅ Enable rate limiting
- ✅ Set up logging and monitoring
- ✅ Regular database backups
- ✅ Keep dependencies updated

## 📞 Support

For issues or questions:
1. Check the error logs
2. Review troubleshooting section above
3. Verify all environment variables are set
4. Test with curl or Postman
5. Contact: support@safeguard.app

---

**Version**: 1.0.0  
**Last Updated**: March 2026
