# 🛡️ SafeGuard - Emergency Services Locator

A modern, fully-featured emergency response platform with Next.js 16 frontend and Flask backend. Find nearby emergency services (police, hospitals, fire stations), manage emergency contacts, and access comprehensive safety resources. Built with React 19, Tailwind CSS, and real-time mapping integration.

## ✨ Features

### 🎯 Core Features
- **🚨 Emergency Service Finder**: Locate nearest police stations, hospitals, and fire stations using real-time GPS
- **📍 Interactive Maps**: Beautiful Folium-generated maps showing nearby emergency services with distances
- **📞 One-Click Calling**: Direct calling to emergency services and saved contacts
- **👥 Emergency Contacts Management**: Add, edit, delete, and organize emergency contacts
- **🌓 Dark/Light Mode**: Full theme support with automatic detection
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **♿ Accessible**: WCAG 2.1 AA compliant with proper ARIA labels and semantic HTML
- **📧 Email Integration**: SMTP-based notifications and contact form submissions
- **🛠️ Admin Dashboard Ready**: Backend database for user management and logging

### 📄 Pages Included
- **Home** (`/`): Main dashboard with emergency service finder and map
- **About** (`/about`): Company mission, values, and features
- **Contact** (`/contact`): Contact form with multiple support channels
- **Support** (`/support`): Comprehensive FAQ and troubleshooting guide
- **Emergency Contacts** (`/emergency-contacts`): Manage personal emergency contacts

### 🎨 Design
- Modern gradient design with Blue/Purple/Teal color scheme
- Smooth animations and transitions
- Intuitive forms and user interactions
- Mobile-first responsive design
- High contrast for readability
- Professional footer with social media integration

## 🚀 Quick Start (Both Frontend & Backend)

### Prerequisites
- **Node.js** 18+ (for Next.js frontend)
- **Python** 3.8+ (for Flask backend)
- **MySQL** 8.0+ (recommended) OR SQLite (default fallback)
- **npm** or **pnpm** package manager
- Modern web browser with location services support

### Step 1: Install All Dependencies

```bash
# Install Node.js dependencies for frontend
pnpm install
# or: npm install

# Install Python dependencies for backend
pip install -r requirements.txt
```

### Step 2: Configure Environment (.env already provided)

The `.env` file is already configured with your credentials:
- **Email**: niyatiupadhyay690@gmail.com (Gmail SMTP configured)
- **Database**: MySQL connection to `accident_finder_2`
- **Flask Secret**: Secure secret key configured

Optional: Edit `.env` to customize:
```bash
# Email Configuration
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb

# Database (MySQL)
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2

# Or use SQLite (no MySQL needed):
# DATABASE_URI=sqlite:///safety_app.db
```

### Step 3: Set Up Database (Choose One)

#### Option A: MySQL (Recommended for Production)
```bash
# 1. Start MySQL service
mysql -u root -p

# 2. In MySQL console, create database:
CREATE DATABASE IF NOT EXISTS accident_finder_2;
USE accident_finder_2;

# 3. Exit MySQL, Flask will auto-create tables on first run
exit
```

#### Option B: SQLite (Simple, No Setup)
```bash
# Just run Flask, SQLite database will auto-create
# No MySQL setup needed
```

### Step 4: Run the Application

#### Terminal 1: Start Flask Backend
```bash
python app.py
```
✅ Backend running at: `http://localhost:5000`

#### Terminal 2: Start Next.js Frontend
```bash
pnpm dev
# or: npm run dev
```
✅ Frontend running at: `http://localhost:3000`

**Open browser to:** `http://localhost:3000`

### That's it! 🎉
Both frontend and backend are now running and connected!

## 📚 Project Structure

```
/vercel/share/v0-project/
├── app/                            # Next.js app directory
│   ├── page.tsx                    # Home page with map
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles & theme
│   ├── about/page.tsx              # About page
│   ├── contact/page.tsx            # Contact form
│   ├── support/page.tsx            # Support & FAQ
│   └── emergency-contacts/page.tsx # Emergency contacts manager
├── components/
│   ├── navbar.tsx                  # Navigation bar
│   ├── footer.tsx                  # Footer with social media
│   ├── map-component.tsx           # Interactive Leaflet map
│   └── ui/                         # shadcn/ui components
├── hooks/
│   ├── use-mobile.tsx              # Mobile detection
│   └── use-toast.ts                # Toast notifications
├── lib/
│   └── utils.ts                    # Utility functions
├── public/                         # Static assets
├── app.py                          # Flask backend (API server)
├── .env                            # Environment variables (configured)
├── requirements.txt                # Python dependencies
├── package.json                    # Node.js dependencies
├── tsconfig.json                   # TypeScript config
├── next.config.mjs                 # Next.js config
└── README.md                       # This file
```

## 🔌 API Endpoints (Flask Backend)

### Health Check
```bash
GET /api/health
```
Response: `{"status": "ok", "message": "Safety App Backend Running"}`

### Find Nearest Emergency Service
```bash
POST /api/find-nearby
Content-Type: application/json

{
  "lat": 40.7128,
  "lon": -74.0060,
  "type": "police"  # or "hospital", "fire_station"
}
```

Response:
```json
{
  "name": "Central Police Station",
  "distance": 0.85,
  "phone": "+1-555-0100",
  "lat": 40.715,
  "lon": -74.008,
  "map_html": "<div>...folium map...</div>"
}
```

### Find All Nearby Services
```bash
POST /api/nearby-services
Content-Type: application/json

{
  "lat": 40.7128,
  "lon": -74.0060
}
```

Response:
```json
{
  "services": {
    "police": { "name": "...", "distance": 0.85, ... },
    "hospital": { "name": "...", "distance": 1.2, ... },
    "fire_station": { "name": "...", "distance": 0.5, ... }
  },
  "map_html": "<div>...combined map...</div>"
}
```

### Contact Form Submission
```bash
POST /api/send-message
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Bug Report",
  "message": "Found an issue with..."
}
```

## 🔐 Database Configuration

### MySQL (Recommended)
```
Host: localhost
Port: 3306
User: root
Password: Niya@1820
Database: accident_finder_2
URI: mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
```

**Tables Created Automatically:**
- `user` - User accounts
- `emergency_contact` - Emergency contacts per user
- `safety_log` - Activity logs

### SQLite (Default Fallback)
```
File: safety_app.db
No setup required - auto-created on first run
Perfect for development and testing
```

## 🎨 Customization Guide

### Change Color Scheme

Edit `app/globals.css` to change the theme colors:
```css
:root {
  /* Current colors (Blue/Purple/Teal) */
  --primary: #2563eb;        /* Blue */
  --secondary: #7c3aed;      /* Purple */
  --accent: #14b8a6;         /* Teal */
  --destructive: #dc2626;    /* Red for warnings */
  --background: #ffffff;     /* Light background */
  --foreground: #1f2937;     /* Dark text */
  --card: #f9fafb;           /* Light card background */
  --border: #e5e7eb;         /* Border color */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;
    --foreground: #f8fafc;
    --card: #1e293b;
    --border: #334155;
  }
}
```

### Add New Emergency Service Types

Edit `app.py` in the `get_nearest_amenity()` function:
```python
amenity_map = {
    'police': 'police',
    'hospital': 'hospital',
    'fire_station': 'fire_station',
    'pharmacy': 'pharmacy',  # Add new
    'clinic': 'clinic',      # Add new
    'doctor': 'doctors',     # Add new
}
```

### Update Social Media Links

Edit `components/footer.tsx`:
```tsx
<div className="flex gap-4">
  <a href="https://twitter.com/safeguard" target="_blank" rel="noopener noreferrer">
    <Twitter className="w-5 h-5" />
  </a>
  <a href="https://instagram.com/safeguard" target="_blank" rel="noopener noreferrer">
    <Instagram className="w-5 h-5" />
  </a>
</div>
```

### Change Company Information

Edit `components/footer.tsx`:
```tsx
<p className="text-foreground/70">
  © 2026 Your Company Name. All rights reserved.
</p>
```

### Add New Pages

1. Create directory: `app/new-page/`
2. Create file: `app/new-page/page.tsx`
3. Update navbar in `components/navbar.tsx`:
```tsx
<Link href="/new-page" className="text-foreground/70 hover:text-foreground">
  New Page
</Link>
```

### Customize Home Page

Edit `app/page.tsx` to change:
- Welcome message
- Feature descriptions
- Map settings
- Button text and colors

### Use Custom Fonts

Edit `app/layout.tsx`:
```tsx
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })
```

Then use in CSS:
```css
body {
  font-family: var(--font-inter);
}

h1, h2, h3 {
  font-family: var(--font-playfair);
}
```

### Add Components with shadcn/ui

```bash
# Add button component
npx shadcn-ui@latest add button

# Add dialog component
npx shadcn-ui@latest add dialog

# Add accordion component
npx shadcn-ui@latest add accordion

# See all available: https://ui.shadcn.com
```

## 🔒 Security Features

- **Client-side location processing**: Location data never sent to external servers
- **Environment variables**: Sensitive data not in codebase
- **No authentication required**: Works without user accounts
- **Input validation**: All form inputs sanitized
- **HTTPS ready**: Secure by default on deployment
- **Privacy-focused**: Minimal data collection

## 📱 Browser Support

- Chrome/Chromium (90+)
- Firefox (88+)
- Safari (14+)
- Edge (90+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## ⚡ Performance

- **Server-side rendering**: Fast initial page loads
- **Code splitting**: Automatic route-based splitting
- **Image optimization**: Next.js Image component
- **CSS optimization**: Tailwind CSS purging
- **Bundle analysis**: Minimal JavaScript payload

## 🚀 Deployment

### Deploy Frontend to Vercel (Recommended)

**Option 1: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**Option 2: GitHub Auto-Deployment**
1. Push code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Select GitHub repository
5. Click "Deploy"

Vercel will auto-deploy on every git push.

### Deploy Backend to Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create safeguard-api

# Add MySQL database
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set FLASK_ENV=production
heroku config:set DATABASE_URI=<your-mysql-url>
heroku config:set MAIL_PASSWORD=<your-gmail-password>

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy Frontend to Netlify

```bash
# Build
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.next
```

### Using Docker (for Self-Hosted)

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM python:3.10-slim
WORKDIR /app

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

# Copy built frontend
COPY --from=frontend-builder /app/.next ./.next

# Copy backend
COPY app.py requirements.txt ./

# Install Python deps
RUN pip install -r requirements.txt

# Install pnpm
RUN npm install -g pnpm

EXPOSE 3000 5000

CMD ["sh", "-c", "python app.py & pnpm start"]
```

**Build and run:**
```bash
docker build -t safeguard .
docker run -p 3000:3000 -p 5000:5000 safeguard
```

### Deploy to AWS EC2

```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# Install dependencies
sudo apt-get update
sudo apt-get install -y nodejs npm python3-pip mysql-client

# Clone repo
git clone https://github.com/yourrepo/safeguard.git
cd safeguard

# Install dependencies
npm install
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=production
export DATABASE_URI=mysql://...

# Run with PM2 (process manager)
npm install -g pm2
pm2 start "python app.py" --name "flask-backend"
pm2 start "npm start" --name "next-frontend"
pm2 startup
pm2 save
```

### Environment Variables for Production

Create `.env` for your hosting platform:

**Vercel (Frontend):**
1. Go to Project Settings → Environment Variables
2. Add variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

**Heroku/Other (Backend):**
```bash
FLASK_ENV=production
FLASK_SECRET_KEY=<strong-random-key>
DATABASE_URI=<your-mysql-url>
MAIL_USERNAME=<your-email>
MAIL_PASSWORD=<app-password>
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
CORS_ORIGINS=https://yourdomain.com
```

### Pre-Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] HTTPS/SSL certificate installed
- [ ] CORS properly configured for production domain
- [ ] Email service tested
- [ ] Database connection tested
- [ ] Frontend API URL points to production backend
- [ ] Error logging enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled on API

## 🧪 Development

### Build for Production
```bash
npm run build
```

### Run Production Build Locally
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

## 📚 Additional Resources

### Official Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://www.sqlalchemy.org/)
- [Geopy Documentation](https://geopy.readthedocs.io/)

### API References
- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [OpenStreetMap Data](https://www.openstreetmap.org)
- [Folium Documentation](https://python-visualization.github.io/folium/)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

### Useful Tools
- [VS Code](https://code.visualstudio.com/) - Code editor
- [Postman](https://www.postman.com/) - API testing
- [GitHub Desktop](https://desktop.github.com/) - Version control
- [DBeaver](https://dbeaver.io/) - Database management
- [DevTools](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools) - Browser debugging

## 🔒 Security Best Practices

### Before Production Deployment

1. **Change Flask Secret Key**
```python
# Generate new secure key:
python -c "import secrets; print(secrets.token_hex(32))"

# Update in .env:
FLASK_SECRET_KEY=<new-secure-key>
```

2. **Use Environment Variables**
   - Never hardcode credentials
   - Use `.env` files (NOT in version control)
   - Different values for development and production

3. **Enable HTTPS**
   - Get SSL certificate (Let's Encrypt, AWS ACM, etc.)
   - Redirect HTTP to HTTPS
   - Enable security headers

4. **Database Security**
   - Use strong passwords
   - Limit database user permissions
   - Enable database backups
   - Use connection pooling
   - Never expose database credentials

5. **API Security**
   - Rate limiting (prevent abuse)
   - Input validation and sanitization
   - CORS configuration (specific origins only)
   - API key rotation
   - Logging and monitoring

6. **Keep Dependencies Updated**
```bash
# Check for security vulnerabilities
npm audit
pip check

# Update packages
npm update
pip install --upgrade -r requirements.txt
```

## 📈 Performance Tips

### Frontend
- Use `next/Image` for image optimization
- Enable ISR (Incremental Static Regeneration)
- Implement code splitting
- Use lazy loading for maps
- Minimize external scripts

### Backend
- Use database connection pooling
- Cache frequently accessed data
- Implement request timeouts
- Use pagination for large datasets
- Monitor API response times

## 🧪 Testing

### Frontend Testing
```bash
# Install testing libraries (optional)
npm install --save-dev @testing-library/react jest

# Run tests
npm test
```

### Backend Testing
```bash
# Test API endpoints
python -m pytest tests/

# Or use curl/Postman
curl -X POST http://localhost:5000/api/find-nearby \
  -H "Content-Type: application/json" \
  -d '{"lat": 40.7128, "lon": -74.0060, "type": "police"}'
```

## 📊 Monitoring & Logging

### Backend Logging
Flask logs are printed to console by default. For production:
```bash
# Redirect to file
python app.py > logs/app.log 2>&1 &

# Or use logging service (Sentry, CloudWatch, etc.)
```

### Frontend Error Tracking
Consider using:
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- [Google Analytics](https://analytics.google.com/) - User analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

Please ensure:
- Code is properly formatted
- No console errors
- All features are tested
- README is updated if needed

## 🛠️ Configuration Guide

### Email Setup (Gmail SMTP)

1. **Enable 2-Factor Authentication** on Gmail account
2. **Generate App Password**:
   - Go to Google Account Security: https://myaccount.google.com/security
   - Find "App passwords" under 2FA
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
   - Paste in `.env` as `MAIL_PASSWORD`

Current Configuration:
```env
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb  # App Password
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

### Database Selection

**Use MySQL if:**
- Running in production
- Need multiple users
- Want persistent user data
- Building admin dashboard

**Use SQLite if:**
- Testing/development
- Single user
- Want no setup
- Want portable database

Edit `.env` to switch:
```bash
# For MySQL:
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2

# For SQLite:
DATABASE_URI=sqlite:///safety_app.db
```

## 🐛 Troubleshooting

### 🚨 Common Issues & Solutions

#### 1. Map Not Loading
**Symptoms:** Blank map area, no location shown
**Solutions:**
```bash
# Check browser console for errors (F12)
# Grant location permission when prompted
# Verify geolocation is enabled in browser settings
# Try incognito/private mode
# Check internet connection
```

#### 2. Location Permission Denied
**Symptoms:** "Please enable location services" message
**Solutions:**
- Click location icon in browser address bar
- Select "Always allow" for this site
- Check OS location settings
  - **Windows**: Settings → Privacy → Location → ON
  - **Mac**: System Preferences → Security & Privacy → Location Services → ON
  - **iOS**: Settings → Privacy → Location Services → ON
  - **Android**: Settings → Apps → Permissions → Location → Allow

#### 3. Flask Backend Not Running
**Symptoms:** "Connection refused" or "Cannot connect to http://localhost:5000"
**Solutions:**
```bash
# Check if Flask is running
lsof -i :5000

# Kill any process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Restart Flask
python app.py

# Or use different port
python app.py --port 5001
```

#### 4. Database Connection Error
**Symptoms:** "Can't connect to MySQL server" or database errors
**Solutions:**

For MySQL:
```bash
# Start MySQL service
# Windows:
net start MySQL80

# Mac:
brew services start mysql

# Linux:
sudo systemctl start mysql

# Verify connection:
mysql -u root -p -e "SELECT 1;"
```

For SQLite:
```bash
# Just use SQLite (no MySQL needed)
# Edit .env:
DATABASE_URI=sqlite:///safety_app.db

# Restart Flask - database will auto-create
```

#### 5. Email Not Sending
**Symptoms:** Contact forms don't send emails
**Solutions:**
```bash
# Verify credentials in .env:
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb

# Check Gmail 2FA is enabled
# Regenerate app password if needed
# Allow "Less secure apps" (old Gmail setting)

# Test with curl:
curl -X POST http://localhost:5000/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "your-email@gmail.com",
    "subject": "Test",
    "message": "Test message"
  }'
```

#### 6. CORS Errors in Browser Console
**Symptoms:** "Cross-Origin Request Blocked"
**Solutions:**
```bash
# Frontend is running on http://localhost:3000
# Backend is on http://localhost:5000
# CORS is enabled in Flask (Flask-CORS configured)

# If errors persist:
# Verify backend is actually running
# Check .env has correct API_URL
# Restart both frontend and backend

# Check browser console:
# Right-click → Inspect → Console
# Look for CORS-related errors
```

#### 7. Port Already in Use
**Symptoms:** "Address already in use" when starting server
**Solutions:**
```bash
# Find process using the port
lsof -i :3000    # Frontend
lsof -i :5000    # Backend

# Kill the process
kill -9 <PID>

# Or use different ports:
pnpm dev -- -p 3001      # Frontend on 3001
python app.py --port 5001 # Backend on 5001
```

#### 8. "No police/hospital found nearby"
**Symptoms:** Error when searching for services
**Solutions:**
```bash
# Overpass API might be slow or rate-limited
# Wait a few moments and try again
# Check location is correct
# Try different location (try a major city)
# Verify internet connection

# Backend logs will show Overpass API errors
# Check terminal where Flask is running
```

#### 9. Styles not loading (CSS broken)
**Symptoms:** Page looks unstyled, no colors/layout
**Solutions:**
```bash
# Rebuild Tailwind CSS
pnpm dev

# Clear Next.js cache:
rm -rf .next
pnpm dev

# Check globals.css is imported in layout.tsx
# Verify tailwind.config.ts exists
```

#### 10. Can't see contacts after adding them
**Symptoms:** Contacts disappear after page reload
**Solutions:**
```bash
# Contacts stored in browser localStorage
# Check browser DevTools:
# Right-click → Inspect → Application → LocalStorage
# Should see "emergencyContacts" key

# Clear and re-add:
# Go to emergency-contacts page
# Clear all contacts
# Re-add them

# Check if localStorage is enabled:
# Some browsers/extensions may block it
```

### 📋 Debugging Checklist

- [ ] Both frontend (port 3000) and backend (port 5000) are running
- [ ] `.env` file exists with correct credentials
- [ ] Database connection verified (MySQL or SQLite)
- [ ] Email credentials correct in `.env`
- [ ] Browser location permission granted
- [ ] JavaScript console has no errors (F12)
- [ ] Backend console shows no errors
- [ ] Tried incognito/private mode
- [ ] Cleared browser cache

### Getting Help

Check terminal output for detailed error messages:
```bash
# Frontend errors:
# Terminal where you ran `pnpm dev`

# Backend errors:
# Terminal where you ran `python app.py`

# Browser errors:
# Open DevTools: F12 or Right-click → Inspect
# Check Console, Network, Application tabs
```

## 📞 Support & Contact

### Getting Help

**For Technical Issues:**
- Check the [Troubleshooting](#-troubleshooting) section
- Review [Configuration Guide](#-configuration-guide)
- Check browser console (F12) for error messages
- Check Flask terminal for backend errors

**For General Support:**
- **Email**: support@safeguard.app
- **Phone**: 1-800-SAFEGUARD
- **Website**: https://safeguard.app
- **Contact Form**: Available on the `/contact` page
- **Support/FAQ**: Available on the `/support` page

### Response Times
- **General Inquiries**: 24-48 hours
- **Technical Support**: 4-8 hours
- **Bug Reports**: 2-4 hours
- **Emergency Issues**: Call immediately

## 📄 License & Legal

### License
This project is provided as-is for educational and personal use.

### Disclaimer - IMPORTANT ⚠️

**SafeGuard is a SUPPLEMENTAL TOOL ONLY.**

This application is designed to assist users in finding nearby emergency services and managing contacts. It is NOT a replacement for direct emergency communication.

**IN ANY LIFE-THREATENING EMERGENCY, IMMEDIATELY CALL YOUR LOCAL EMERGENCY SERVICE:**

🇺🇸 **USA**: 911
🇬🇧 **UK**: 999
🇪🇺 **Europe**: 112
🇮🇳 **India**: 
  - Police: 100
  - Ambulance: 102
  - Fire: 101
🇦🇺 **Australia**: 000

**DO NOT:**
- Delay calling emergency services to use this app
- Rely solely on this app for emergency communication
- Use this app as a substitute for professional emergency services
- Assume the information is always accurate or up-to-date

**The developers, distributors, and maintainers are NOT liable for:**
- Any delays in finding emergency services
- Inaccurate or outdated location data
- Service failures or interruptions
- Any harm or injury resulting from use of this app
- Any decisions made based on information provided by this app

**By using this application, you acknowledge that you understand these limitations and agree to hold harmless all parties involved in its development and distribution.**

## 🙏 Acknowledgments

### Frontend
- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Accessible components
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library

### Backend
- [Flask](https://flask.palletsprojects.com/) - Python web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - Database ORM
- [Folium](https://python-visualization.github.io/folium/) - Interactive maps
- [Geopy](https://geopy.readthedocs.io/) - Geolocation library
- [Overpass API](https://overpass-api.de/) - OpenStreetMap data

### Hosting & Services
- [Vercel](https://vercel.com/) - Frontend hosting
- [OpenStreetMap](https://www.openstreetmap.org/) - Map data
- [Google Fonts](https://fonts.google.com/) - Typography

### Development Tools
- [VS Code](https://code.visualstudio.com/) - Code editor
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Git](https://git-scm.com/) - Version control

## 📊 Statistics

- **Frontend**: Next.js 16 with React 19 & TypeScript
- **Backend**: Flask with Python 3.8+
- **Database**: SQLAlchemy (MySQL/SQLite support)
- **Lines of Code**: ~2,500+ frontend + backend
- **API Endpoints**: 5+ fully functional endpoints
- **Supported Services**: Police, Hospitals, Fire Stations
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest)
- **Mobile Support**: iOS & Android responsive design

## 🎯 Project Goals

✅ Provide quick access to emergency services
✅ Reduce emergency response time
✅ Easy-to-use interface for all ages
✅ Work offline for basic functionality
✅ Privacy-focused (no tracking)
✅ Accessible to people with disabilities
✅ Open to community contributions
✅ Educational and transparent

## 🚀 Future Roadmap

- [ ] Push notifications for alerts
- [ ] SMS support for contacts
- [ ] Multi-language support
- [ ] Offline maps (PWA)
- [ ] Emergency alert broadcasting
- [ ] Integration with official 911 services
- [ ] AI-powered safety scoring
- [ ] Community safety reports and incidents
- [ ] First responder integration
- [ ] Wearable device support
- [ ] Voice command support
- [ ] Real-time traffic data integration

## 💡 Ideas & Suggestions

Have ideas for improvement? Found a bug? Want to contribute?

1. Open an issue on GitHub
2. Create a pull request with improvements
3. Email suggestions to: ideas@safeguard.app
4. Fill out the contact form on the website

All feedback is valuable and helps us improve!

## 📝 Changelog

### v1.0.0 (March 2026)
- Initial release
- Emergency service finder
- Emergency contact management
- Interactive maps with Folium
- Multi-page application (About, Contact, Support, etc.)
- Responsive mobile design
- Dark/Light mode support
- Email notifications
- MySQL and SQLite support

## 👥 Team

Built with care by developers passionate about safety and emergency response.

---

## 🎉 Thank You!

Thank you for using SafeGuard! We're committed to continuously improving this application to help people in emergency situations.

**Stay Safe! Your safety is our priority. 🛡️**

Made with ❤️ for community safety, emergency response, and peace of mind.

*Last Updated: March 2026*
*Version: 1.0.0*
