# Flask Backend Integration Guide

This document explains how the Flask backend integrates with the Next.js frontend and how to use all the API endpoints.

## Architecture Overview

```
┌─────────────────────────────────────┐
│     Next.js Frontend (Port 3000)    │
│  - Home Page (Service Finder)       │
│  - Emergency Contacts               │
│  - About, Support, Contact Pages    │
└──────────────┬──────────────────────┘
               │
         HTTP/REST API
               │
┌──────────────▼──────────────────────┐
│   Flask Backend (Port 5000)          │
│  - User Authentication               │
│  - Emergency Service Search          │
│  - Contact Management                │
│  - Map Generation                    │
└──────────────┬──────────────────────┘
               │
        Database Connection
               │
┌──────────────▼──────────────────────┐
│    MySQL Database                    │
│  - Users Table                       │
│  - Emergency Contacts Table          │
│  - Safety Logs Table                 │
└──────────────────────────────────────┘
```

## Environment Setup

### Backend Environment Variables

Located in `.env.local`:

```
# Flask Configuration
FLASK_SECRET_KEY=7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568
FLASK_ENV=development
FLASK_DEBUG=1

# Email Configuration (Gmail SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb

# Database Configuration
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Niya@1820
DB_NAME=accident_finder_2
DB_PORT=3306

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Database Models

### User Model
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    last_otp_sent = db.Column(db.DateTime)
    contacts = db.relationship('EmergencyContact', backref='owner', lazy=True)
    logs = db.relationship('SafetyLog', backref='user', lazy=True)
```

### EmergencyContact Model
```python
class EmergencyContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    relationship = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

### SafetyLog Model
```python
class SafetyLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="Alert Triggered")
    amenity_type = db.Column(db.String(50), default="police")
```

## API Endpoints Reference

### 1. Authentication Endpoints

#### Register User
```
POST /register
Content-Type: application/x-www-form-urlencoded

Parameters:
- name (string): User's full name
- email (string): User's email address

Response:
{
  "success": true
}
```

#### Login
```
POST /login
Content-Type: application/x-www-form-urlencoded

Parameters:
- email (string): User's email address

Response:
Renders OTP verification page
```

#### Verify OTP
```
POST /verify_otp
Content-Type: application/x-www-form-urlencoded

Parameters:
- otp (string): 4-digit OTP received via email

Response:
Redirects to home page on success
```

#### Logout
```
GET /logout

Response:
Redirects to login page and clears session
```

### 2. Emergency Services Endpoints

#### Find Nearest Service
```
POST /api/find-nearby
Content-Type: application/json

Request Body:
{
  "lat": 40.7128,
  "lon": -74.0060,
  "type": "police"  // or "hospital" or "fire_station"
}

Response:
{
  "name": "Central Police Station",
  "distance": 0.8,
  "phone": "+1-911",
  "lat": 40.7150,
  "lon": -74.0050,
  "map_html": "<html>...</html>"
}
```

#### Find All Nearby Services
```
POST /api/nearby-services
Content-Type: application/json

Request Body:
{
  "lat": 40.7128,
  "lon": -74.0060
}

Response:
{
  "services": {
    "police": {
      "name": "Police Station",
      "distance": 0.8,
      "phone": "911",
      ...
    },
    "hospital": {
      "name": "Medical Center",
      "distance": 1.2,
      ...
    },
    "fire_station": {
      "name": "Fire Station 5",
      "distance": 0.5,
      ...
    }
  },
  "map_html": "<html>...</html>"
}
```

#### Health Check
```
GET /api/health

Response:
{
  "status": "ok",
  "message": "Safety App Backend Running"
}
```

### 3. Emergency Contacts Endpoints

#### Get All Contacts
```
GET /get-contacts

Response:
{
  "contacts": [
    {
      "id": 1,
      "name": "Mom",
      "phone": "555-1234",
      "email": "mom@example.com",
      "relationship": "Mother"
    },
    ...
  ]
}
```

#### Add Contact
```
POST /add-contact
Content-Type: application/json

Request Body:
{
  "name": "Mom",
  "phone": "555-1234",
  "email": "mom@example.com",
  "relationship": "Mother"
}

Response:
{
  "success": true,
  "contact_id": 1
}
```

#### Delete Contact
```
DELETE /delete-contact/<id>

Response:
{
  "success": true
}
```

### 4. Communication Endpoints

#### Send Message
```
POST /send-message
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Technical Support",
  "message": "I have a question about..."
}

Response:
{
  "success": true
}
```

#### Contact Form
```
POST /contact-form
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "message": "I'd like to discuss..."
}

Response:
{
  "success": true
}
```

## Frontend API Client Usage

### Example: Finding Nearest Police Station

```javascript
const findNearestService = async (lat, lon, serviceType) => {
  try {
    const response = await fetch('http://localhost:5000/api/find-nearby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        lat: lat,
        lon: lon,
        type: serviceType === 'fire' ? 'fire_station' : serviceType
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Found service:', data.name);
    console.log('Distance:', data.distance, 'km');
    console.log('Phone:', data.phone);
    
    // Display map
    displayMapHtml(data.map_html);
    
  } catch (error) {
    console.error('Error finding service:', error);
  }
};
```

### Example: Adding Emergency Contact

```javascript
const addContact = async (contactData) => {
  try {
    const response = await fetch('http://localhost:5000/add-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(contactData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Contact added with ID:', data.contact_id);
      // Update UI
      refreshContacts();
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};
```

## CORS Configuration

The Flask backend is configured to accept requests from the Next.js frontend:

```python
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

This allows:
- Frontend on `http://localhost:3000` to communicate with backend on `http://localhost:5000`
- API requests from the frontend with credentials (`credentials: 'include'`)

## Running the Backend

### Start the Flask Development Server

```bash
# Ensure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Run the Flask app
python app.py

# Or use Flask CLI
flask run

# The server will start on http://localhost:5000
```

### Start with Debug Mode

```bash
export FLASK_ENV=development  # macOS/Linux
set FLASK_ENV=development     # Windows

flask run --reload
```

## Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Example Error Response

```json
{
  "error": "No police station found nearby"
}
```

## Testing the Backend

### Using cURL

```bash
# Test health check
curl http://localhost:5000/api/health

# Test find nearby services
curl -X POST http://localhost:5000/api/find-nearby \
  -H "Content-Type: application/json" \
  -d '{"lat": 40.7128, "lon": -74.0060, "type": "police"}'
```

### Using Postman

1. Create a new request
2. Set method to POST
3. Enter URL: `http://localhost:5000/api/find-nearby`
4. Add headers: `Content-Type: application/json`
5. Add body:
```json
{
  "lat": 40.7128,
  "lon": -74.0060,
  "type": "police"
}
```

## Production Deployment

### Environment Variables for Production

```
FLASK_ENV=production
FLASK_SECRET_KEY=<secure-random-key>
DATABASE_URI=mysql+pymysql://<user>:<pass>@<host>/<db>
MAIL_USERNAME=<production-email>
MAIL_PASSWORD=<production-password>
```

### Deployment with Gunicorn

```bash
# Install gunicorn
pip install gunicorn

# Run production server
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Procfile for Heroku

```
web: gunicorn app:app
release: python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

## Monitoring and Logging

### Enable Request Logging

The Flask app logs all requests and errors to the console. Monitor for:
- OTP generation and verification
- Database operations
- API request errors
- Email sending status

### Example Log Output

```
[2024-03-10 10:30:45] 📍 USER LOCATION RECEIVED: 40.7128, -74.0060
[2024-03-10 10:30:46] ✅ Found 1 nearby police stations
[2024-03-10 10:30:47] 📨 Email sent successfully
```

## Security Best Practices

1. **Keep `.env.local` private** - Never commit to version control
2. **Use HTTPS** in production
3. **Validate all inputs** on the backend
4. **Implement rate limiting** for API endpoints
5. **Use secure session cookies** with HTTPOnly flag
6. **Regular security updates** to dependencies

## Troubleshooting

### Backend Not Responding

```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process if needed
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Connection Error

```bash
# Test MySQL connection
mysql -h localhost -u root -p accident_finder_2

# Check MySQL is running
sudo service mysql status  # Linux
brew services list  # macOS
```

### Email Not Sending

- Verify credentials in `.env.local`
- Check Gmail app password
- Enable "Less secure apps" if using Gmail
- Check spam folder for test emails

## Support

For issues with the Flask backend integration:
1. Check error logs in console
2. Review this documentation
3. Check the COMPLETE_SETUP.md for detailed setup
4. Contact support at support@safeguard.app

---

**Last Updated**: March 2024
**Version**: 1.0.0
