# 🛡️ SafeGuard - Emergency Safety App Complete Setup Guide

## 📋 What's New in This Version

### ✨ New Features
1. **Emergency Contacts Management** - Add, edit, and delete emergency contacts with phone numbers, emails, and relationships
2. **About Page** - Learn about SafeGuard features and benefits
3. **Contact Page** - Beautiful contact form with FAQ section
4. **Support/Help Page** - Comprehensive troubleshooting guide and safety tips
5. **Modern UI Design** - Blue/Purple/Teal gradient theme with smooth animations
6. **Interactive Maps** - Leaflet maps showing your location and nearby services via Overpass API
7. **Responsive Design** - Works perfectly on mobile, tablet, and desktop
8. **AI-Powered Emergency Analysis** - Smart recommendations based on emergency description
9. **Flask Backend Integration** - RESTful API with MySQL database
10. **Social Media Integration** - Footer with Instagram, Twitter, LinkedIn, Facebook links

### 🎨 UI Improvements
- Professional gradient backgrounds (blue to purple to teal)
- Smooth animations and hover effects
- Better color scheme with accessible contrast
- Responsive grid layouts
- Modern card-based design
- Mobile-first approach
- Social media icons in footer
- AI chat interface for emergency analysis

### 📄 Complete Page Structure
- **Home Page**: Map display, service finder, AI analysis, quick contacts
- **About Page**: Features, mission, values, and benefits
- **Contact Page**: Contact form + contact info + FAQ
- **Support Page**: Detailed guides, troubleshooting, safety tips
- **Emergency Contacts**: Full CRUD management system with localStorage
- **Navigation**: Shared navbar with responsive mobile menu
- **Footer**: Links, social media, contact information

---

## 🚀 Quick Start (10 Minutes)

### Step 1: Prerequisites
```bash
# Install Node.js 18+ and npm/pnpm
node --version
npm --version

# Install Python 3.8+
python --version

# Ensure MySQL is running
# On macOS: brew services start mysql
# On Windows: MySQL Server from Services
```

### Step 2: Frontend Setup (Next.js)
```bash
# Navigate to project root
cd /path/to/project

# Install dependencies
pnpm install
# or: npm install
```

### Step 3: Backend Setup (Flask)
```bash
# Navigate to Flask backend
cd flask_backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

**For Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
FLASK_SECRET_KEY=7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
```

**For Backend (flask_backend/.env):**
Already created with same credentials.

### Step 5: Setup MySQL Database
```bash
# Open MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE accident_finder_2;
USE accident_finder_2;

# Exit
EXIT;
```

### Step 6: Run Both Servers

**Terminal 1 - Start Flask Backend:**
```bash
cd flask_backend
python app.py
# Backend will run on http://localhost:5000
```

**Terminal 2 - Start Next.js Frontend:**
```bash
cd /path/to/project
pnpm dev
# or: npm run dev
# Frontend will run on http://localhost:3000
```

Visit **http://localhost:3000** in your browser!

---

## 🔑 Testing the Application

1. **Home Page**: View map, find services nearby
2. **Emergency Services**: Click "Find Now" for police, hospital, fire station
3. **AI Analysis**: Describe an emergency and get smart recommendations
4. **Add Contacts**: Go to "Emergency Contacts" and add test contacts
5. **Call**: Click phone numbers to test calling
6. **Support**: Check FAQ and troubleshooting guides

---

## 📁 File Structure

```
safety-assistant/
│
├── app.py                          # Main Flask application (345 lines)
│   ├── Database models (User, EmergencyContact, SafetyLog)
│   ├── Authentication routes (login, verify_otp, logout)
│   ├── Main routes (home, about, contact, support)
│   ├── API routes (find_nearest, contacts management)
│   └── Email helper functions
│
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # Full documentation
├── SETUP_GUIDE.md                  # This file
│
├── templates/                      # All HTML templates
│   ├── base.html                   # Navbar & base layout
│   ├── login.html                  # Login page with email input
│   ├── otp.html                    # OTP verification page
│   ├── index.html                  # Home/Dashboard (service finder)
│   ├── about.html                  # About page with features
│   ├── contact.html                # Contact form + FAQ
│   ├── support.html                # Support guide + troubleshooting
│   └── emergency_contacts.html     # Emergency contacts manager
│
└── static/
    └── style.css                   # Global CSS styles (379 lines)
```

---

## 🎯 Key Features Explained

### 1. Emergency Service Finder
- Select service type (Police, Hospital, Fire Station)
- Click "Find Nearest Service" to locate nearby services
- View results on interactive map
- One-click calling functionality

### 2. Emergency Contacts Management
- Add contacts with: Name, Phone, Email, Relationship
- View all contacts in a beautiful list
- Call directly from the app
- Delete contacts with confirmation
- All data is encrypted and stored securely

### 3. Authentication System
- No passwords - uses OTP (One-Time Password)
- Email verification for security
- Session-based authentication
- Auto-logout option in user menu

### 4. Interactive Maps
- Uses Leaflet (open-source mapping library)
- Shows your location in blue
- Shows nearby services in red
- Distance calculation and display

---

## 🔧 Configuration Options

### Email Settings
Edit `app.py` to change email provider:
```python
# Currently: Gmail SMTP
# To use different provider, modify send_email() function
```

### Database
Modify in `.env`:
```
# SQLite (default, no setup needed)
DATABASE_URI=sqlite:///safety_app.db

# PostgreSQL
DATABASE_URI=postgresql://user:password@localhost/safety_app
```

### Colors & Theme
Edit `static/style.css`:
```css
/* Primary colors */
#667eea  /* Purple */
#764ba2  /* Dark Purple */
#2ecc71  /* Green */
#e74c3c  /* Red */
```

---

## 🚀 Deployment

### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Add runtime.txt
echo "python-3.11.0" > runtime.txt

# Deploy
git push heroku main
```

### Option 2: AWS / DigitalOcean
1. Install Python 3.8+ on server
2. Clone repository
3. Set environment variables
4. Run: `gunicorn -w 4 app:app`

### Option 3: Docker
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "app:app"]
```

---

## 🐛 Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'flask'"
```bash
# Solution:
pip install -r requirements.txt
```

### Issue: Email not sending
- Verify Gmail App Password (not regular password)
- Check 2-Step Verification is enabled
- Check MAIL_USERNAME and MAIL_PASSWORD in .env

### Issue: Location permission denied
- Allow location access in browser settings
- Make sure HTTPS is used (or localhost)
- Try incognito/private mode

### Issue: Map not showing
- Check internet connection
- Verify Leaflet library loads (check browser console)
- Check that coordinates are valid (lat/lon)

### Issue: Database locked
- Stop the app and delete `safety_app.db`
- Restart the app (new database will be created)

---

## 📱 Testing Guide

### Test Emergency Service Finder
1. Login with any email
2. Click "Find Nearest Service"
3. Allow location access
4. See map with your location
5. Click "Call Now" to test

### Test Emergency Contacts
1. Login
2. Go to "Emergency Contacts"
3. Add a test contact
4. View in list
5. Test call button
6. Delete contact

### Test Forms
1. Go to Contact page
2. Fill out contact form
3. Submit and check success message
4. Check email for form submission

---

## 🔒 Security Best Practices

1. **Change FLASK_SECRET_KEY** before production deployment
2. **Use strong email passwords** (App Passwords, not regular passwords)
3. **Enable HTTPS** when deploying
4. **Regular backups** of your database
5. **Keep dependencies updated** - run `pip install --upgrade -r requirements.txt`
6. **Monitor error logs** for suspicious activity
7. **Implement rate limiting** for production use
8. **Use environment variables** for all sensitive data

---

## 📊 API Reference

### Authentication Endpoints
| Method | Route | Purpose |
|--------|-------|---------|
| GET/POST | `/login` | Login page |
| POST | `/verify_otp` | Verify OTP code |
| GET | `/logout` | Logout user |

### Page Routes
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/` | Home (protected) |
| GET | `/about` | About page |
| GET | `/contact` | Contact page |
| GET | `/support` | Support page |
| GET | `/emergency-contacts` | Contacts manager |

### API Routes
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/find_nearest` | Find nearest service |
| POST | `/add-contact` | Add emergency contact |
| DELETE | `/delete-contact/<id>` | Delete contact |
| GET | `/get-contacts` | Get user's contacts |
| POST | `/contact-form` | Submit contact form |

---

## 📞 Support & Help

### Getting Help
1. Check the Support page in the app
2. Read README.md for detailed documentation
3. Review .env.example for configuration help
4. Check console/logs for error messages
5. Email support@safetyassistant.com

### Common Commands
```bash
# Start development server
python app.py

# Create database
python -c "from app import db, app; app.app_context().push(); db.create_all()"

# List all routes
python -c "from app import app; print([str(rule) for rule in app.url_map.iter_rules()])"

# Generate secret key
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🎓 Learning Resources

### Flask
- [Flask Official Documentation](https://flask.palletsprojects.com/)
- [Flask-SQLAlchemy Guide](https://flask-sqlalchemy.palletsprojects.com/)

### Maps
- [Leaflet Documentation](https://leafletjs.com/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
- [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)

### Frontend
- [HTML/CSS Reference](https://developer.mozilla.org/en-US/)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

---

## 🎉 You're All Set!

Your Safety Assistant is now ready to use! 

**Next Steps:**
1. ✅ Setup complete
2. ✅ Run the app with `python app.py`
3. ✅ Visit `http://localhost:5000`
4. ✅ Test all features
5. ✅ Customize colors/content as needed
6. ✅ Deploy to production

---

**Questions? Issues? Contact us anytime!**
**Emergency? Always call 911 first! 🚨**

Made with ❤️ for your safety
