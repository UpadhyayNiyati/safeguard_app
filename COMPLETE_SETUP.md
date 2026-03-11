# SafeGuard - Complete Setup Guide

This document contains comprehensive setup instructions for running the SafeGuard Emergency Safety Application with both the Next.js frontend and Flask backend.

## Project Structure

```
project/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home page with map & service finder
│   ├── about/page.tsx           # About us page
│   ├── contact/page.tsx         # Contact form page
│   ├── support/page.tsx         # FAQ & support page
│   ├── emergency-contacts/      # Emergency contacts management
│   ├── api/                     # API routes
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── navbar.tsx               # Navigation bar
│   ├── footer.tsx               # Footer with social media
│   ├── map-component.tsx        # Map component
│   └── ui/                      # shadcn/ui components
├── app.py                       # Flask backend application
├── requirements.txt             # Python dependencies
├── package.json                 # Node.js dependencies
├── .env.local                   # Environment variables
└── README.md                    # Project documentation
```

## Prerequisites

Before starting, ensure you have installed:

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
2. **Python 3.8+** - Download from [python.org](https://www.python.org)
3. **MySQL 5.7+** - Download from [mysql.com](https://www.mysql.com)
4. **Git** - Download from [git-scm.com](https://git-scm.com)

## Setup Instructions

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <your-repo-url>
cd safeguard

# Or if downloaded as ZIP, extract it and navigate to the folder
cd safeguard
```

### Step 2: Install Frontend Dependencies

```bash
# Install Node.js dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Step 3: Set Up Python Virtual Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 4: Install Backend Dependencies

```bash
# Install all Python dependencies
pip install -r requirements.txt
```

### Step 5: Configure Environment Variables

The `.env.local` file is already configured with your credentials:

```
FLASK_SECRET_KEY=7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
```

### Step 6: Set Up the Database

```bash
# Option A: Using command line (MySQL already installed)
mysql -u root -p

# At the MySQL prompt, run:
CREATE DATABASE IF NOT EXISTS accident_finder_2;
EXIT;

# Option B: Using MySQL Workbench
# 1. Open MySQL Workbench
# 2. Create a new connection or use existing one
# 3. Execute: CREATE DATABASE IF NOT EXISTS accident_finder_2;
```

### Step 7: Initialize Flask Database

```bash
# Set Flask app
export FLASK_APP=app.py
# On Windows:
set FLASK_APP=app.py

# Create database tables
flask db init
flask db migrate
flask db upgrade

# Or use the Python script to initialize
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized!')"
```

### Step 8: Start the Flask Backend

```bash
# Ensure virtual environment is activated
python app.py

# Or use Flask CLI
flask run

# The backend will start on http://localhost:5000
```

### Step 9: Start the Next.js Frontend

In a new terminal window:

```bash
# Make sure you're in the project root (not in venv)
npm run dev
# or
pnpm dev

# The frontend will start on http://localhost:3000
```

### Step 10: Access the Application

1. Open your browser
2. Navigate to `http://localhost:3000`
3. The application is now running!

## Features Overview

### Home Page
- **Emergency Services Finder**: Find nearest police stations, hospitals, and fire departments
- **Interactive Map**: Shows your location and nearby services
- **One-Click Calling**: Direct links to emergency numbers
- **Quick Emergency Contacts**: Display of saved emergency contacts

### Emergency Contacts Page
- **Add Contacts**: Store important contact information
- **Quick Dial**: One-click calling functionality
- **Edit/Delete**: Manage your contacts
- **Persistent Storage**: Contacts saved in browser localStorage

### About Page
- **Mission Statement**: Learn about SafeGuard
- **Core Values**: Safety, Reliability, Accessibility
- **Key Features**: Overview of app capabilities

### Support Page
- **FAQ**: Frequently asked questions with answers
- **Contact Options**: Email, phone, and live chat support
- **Contact Form**: Send messages to support team

### Contact Page
- **Contact Form**: Send feedback and inquiries
- **Support Information**: Email, phone, office details
- **Response Times**: Expected response time for different inquiry types

## API Endpoints

### Authentication Routes
- `POST /register` - Register new user
- `POST /login` - Login with email
- `POST /verify_otp` - Verify OTP
- `GET /logout` - Logout user

### Emergency Services Routes
- `POST /api/find-nearby` - Find nearest service (police, hospital, fire station)
- `POST /api/nearby-services` - Find all nearby services
- `GET /api/health` - Health check endpoint

### Emergency Contacts Routes
- `GET /get-contacts` - Retrieve user's contacts
- `POST /add-contact` - Add new contact
- `DELETE /delete-contact/<id>` - Delete contact

### Communication Routes
- `POST /send-message` - Send contact form message
- `POST /contact-form` - Submit contact inquiry

## Troubleshooting

### Issue: "Cannot connect to database"
**Solution**: 
1. Verify MySQL is running
2. Check credentials in `.env.local`
3. Ensure database exists: `CREATE DATABASE accident_finder_2;`

### Issue: "Module not found" (Python)
**Solution**:
1. Activate virtual environment: `source venv/bin/activate`
2. Reinstall requirements: `pip install -r requirements.txt`

### Issue: "Port 5000 already in use"
**Solution**:
1. Change Flask port: `flask run --port 5001`
2. Update `NEXT_PUBLIC_API_URL` in `.env.local`

### Issue: "Port 3000 already in use"
**Solution**:
1. Change Next.js port: `npm run dev -- -p 3001`

### Issue: "Geolocation not working"
**Solution**:
1. Ensure HTTPS is used (or localhost for development)
2. Grant location permission in browser
3. Check browser console for errors

### Issue: "Emails not sending"
**Solution**:
1. Verify Gmail app password is correct
2. Enable "Less secure app access" if needed
3. Check `MAIL_USERNAME` and `MAIL_PASSWORD` in `.env.local`

## Development Tips

### Code Organization
- **Components**: Reusable UI components in `/components`
- **Pages**: Route-based pages in `/app`
- **Styles**: Global CSS in `/app/globals.css`
- **Backend**: Flask routes in `app.py`

### Adding New Features
1. Create components in `/components`
2. Add pages in `/app`
3. Create API routes in Flask (`app.py`)
4. Update `.env.local` with new configuration if needed

### Database Models
The application uses SQLAlchemy with these main models:
- `User`: User accounts with email verification
- `EmergencyContact`: Stored emergency contacts
- `SafetyLog`: Record of service searches and emergencies

## Deployment

### Deploy Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy automatically on push

### Deploy Backend (Heroku or Other)
1. Prepare Procfile: `web: gunicorn app:app`
2. Set environment variables on hosting platform
3. Push code to hosting service
4. Update `NEXT_PUBLIC_API_URL` to production backend URL

## Security Considerations

1. **Never commit `.env.local`** to version control
2. **Use HTTPS** in production
3. **Validate all inputs** on backend
4. **Implement rate limiting** for API endpoints
5. **Store sensitive data securely** in database
6. **Keep dependencies updated** regularly

## Support & Contact

For issues or questions:
- Email: support@safeguard.app
- Phone: 1-800-SAFEGUARD
- Website: https://www.safeguard.app

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Important Disclaimer

SafeGuard is a supplemental tool designed to assist in finding emergency services. In life-threatening situations, always call your local emergency number (911 in the US, 112 in Europe, or your country's equivalent) immediately. This app should not be relied upon as your sole means of emergency communication.
