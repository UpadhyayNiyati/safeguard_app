# SafeGuard - Complete Setup & Running Guide

Emergency Safety Application with AI-Powered Analysis for India. Find nearest Police (100), Ambulance (102), Fire (101) instantly.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [MySQL Database Setup](#mysql-database-setup)
4. [Backend (Flask) Setup](#backend-flask-setup)
5. [Frontend (Next.js) Setup](#frontend-nextjs-setup)
6. [Running Everything](#running-everything)
7. [Testing & Verification](#testing--verification)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

**Want to run it in 5 minutes?**

```bash
# 1. Make sure MySQL, Node, Python are installed
# 2. Terminal 1: Start Flask backend
cd backend && python app.py

# 3. Terminal 2: Start Next.js frontend  
pnpm dev

# 4. Open http://localhost:3000
```

That's it! (Assumes database & dependencies already installed)

---

## Prerequisites

### REQUIRED - All Three Must Be Installed

1. **Node.js 18+** (For Next.js)
   - Download: https://nodejs.org/
   - Verify: `node --version` (should be 18+)
   - Verify: `npm --version` (comes with Node)

2. **Python 3.8+** (For Flask Backend)
   - Download: https://www.python.org/
   - Verify: `python --version`
   - Windows: Add to PATH during installation

3. **MySQL 8.0+** (For Database)
   - Download: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`
   - Default user: `root` password: `Niya@1820`

### RECOMMENDED Tools

- **Visual Studio Code** - Code editor: https://code.visualstudio.com/
- **MySQL Workbench** - Database management
- **Postman** - API testing: https://www.postman.com/
- **Git** - Version control: https://git-scm.com/

---

## MySQL Database Setup

### Step 1: Start MySQL Service

**macOS:**
```bash
brew services start mysql
# or
mysql.server start
```

**Windows:**
- MySQL should auto-start as a service
- Or go to Services app and start MySQL80

**Linux:**
```bash
sudo systemctl start mysql
```

### Step 2: Create the Database

```bash
# Connect to MySQL
mysql -u root -p

# Enter password when prompted
Password: Niya@1820

# Create database
CREATE DATABASE accident_finder_2;

# Verify it was created
SHOW DATABASES;

# Exit MySQL
EXIT;
```

### Step 3: Verify Connection

```bash
# Test connection to the database
mysql -u root -p -h localhost accident_finder_2

# Should connect successfully without errors
# Exit
EXIT;
```

---

## Backend (Flask) Setup

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Create Virtual Environment

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

Expected output: "Successfully installed Flask Flask-CORS Flask-SQLAlchemy..."

### Step 4: Verify .env File

Check that `backend/.env` exists with credentials:

```
FLASK_SECRET_KEY=7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb
DATABASE_URI=mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
FLASK_ENV=development
FLASK_DEBUG=1
```

### Step 5: Initialize Database Tables

```bash
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

Should complete without errors.

### Step 6: Run Flask Backend

```bash
python app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

**Keep this terminal open!** Backend must stay running.

---

## Frontend (Next.js) Setup

### Step 1: Navigate to Project Root

Open **NEW terminal window** (don't close the Flask one!):

```bash
cd /path/to/safeguard
```

### Step 2: Install Dependencies

```bash
pnpm install
```

Or if pnpm not installed:
```bash
npm install -g pnpm
pnpm install
```

### Step 3: Verify .env.local

Check that `.env.local` in project root contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 4: Run Development Server

```bash
pnpm dev
```

**Expected output:**
```
▲ Next.js 16.1.6
- Local: http://localhost:3000
```

**Don't close this terminal either!**

---

## Running Everything

### Complete Startup Checklist

**Terminal 1 - MySQL** (if not running as service):
```bash
# macOS:
mysql.server start

# Linux:
sudo systemctl start mysql

# Windows: Start from Services or command line
```

**Terminal 2 - Flask Backend**:
```bash
cd backend
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows

python app.py
# Should show: Running on http://127.0.0.1:5000
```

**Terminal 3 - Next.js Frontend**:
```bash
# From project root (different terminal)
pnpm dev
# Should show: Local: http://localhost:3000
```

### Verify Everything is Running

- Backend terminal: Shows "Running on http://127.0.0.1:5000"
- Frontend terminal: Shows "Local: http://localhost:3000"
- Open browser: http://localhost:3000
- Should see SafeGuard homepage with map and emergency buttons

---

## Testing & Verification

### Test 1: Backend Health Check

```bash
# In a new terminal or using curl:
curl http://localhost:5000/api/health

# Should return: {"status":"healthy"}
```

### Test 2: Manual Feature Testing

1. **Homepage loads**
   - Open http://localhost:3000
   - Should see SafeGuard title and map

2. **Location Services**
   - Allow location permission when prompted
   - Map should show your location

3. **Emergency Numbers**
   - Click "Emergency Call (112)" button
   - Should open phone dialer

4. **Find Police Station**
   - Click "Find Nearest Police Station" card
   - Should display result with phone & distance
   - Get Directions link should work

5. **Emergency Contacts**
   - Click "Get Started" button
   - Navigate to Emergency Contacts page
   - Add a test contact
   - Edit and delete should work

6. **AI Analysis**
   - Click "Describe Your Emergency"
   - Enter a scenario like "Person injured in accident"
   - Click "Analyze with AI"
   - Should show severity and recommendations

### Test 3: API Testing (Postman)

**Login Test:**
```
POST http://localhost:5000/api/login
Body: {"email":"test@example.com"}
Response: {"message":"OTP sent to email"}
```

**Find Nearby Test:**
```
POST http://localhost:5000/api/find-nearby
Body: {
  "lat": 28.6139,
  "lon": 77.2090,
  "type": "police"
}
Response: Emergency service data with map
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. "MySQL access denied for user 'root'"

```bash
# Reset MySQL password
mysql -u root

# If you don't remember password, reset it:
# macOS: /usr/local/mysql/bin/mysqld_safe --skip-grant-tables
# Then set new password in MySQL
```

#### 2. "Port 3000 already in use"

```bash
# Kill process using port 3000
# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
pnpm dev -- -p 3001
```

#### 3. "Port 5000 already in use"

```bash
# Kill process using port 5000
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### 4. "Cannot find module 'Flask'"

```bash
# Make sure virtual environment is activated:
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Then reinstall:
pip install -r requirements.txt
```

#### 5. "Cannot POST /api/find-nearby"

```bash
# Ensure:
# 1. Flask backend is running (Terminal 2)
# 2. .env.local has: NEXT_PUBLIC_API_URL=http://localhost:5000
# 3. Browser console shows no CORS errors
# 4. Backend has CORS enabled (check app.py)
```

#### 6. "Map not loading/showing blank"

```bash
# Solution:
1. Check browser console for errors (F12)
2. Ensure location permission granted
3. Check internet connection
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Clear browser cache and reload
```

#### 7. "Email not sending OTP"

```bash
# Verify credentials in backend/.env:
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb

# Check Gmail account:
1. Settings → Security → App Passwords
2. Ensure 2FA is enabled
3. Use the 16-character app password (not regular password)

# Check Flask logs for email errors
```

#### 8. "Database connection error"

```bash
# Verify DATABASE_URI is correct:
mysql+pymysql://root:Niya%401820@localhost/accident_finder_2

# Test connection:
mysql -u root -p -h localhost accident_finder_2

# If fails, create database:
mysql -u root -p
> CREATE DATABASE accident_finder_2;
> EXIT;
```

### Debug Mode

**Enable verbose logging:**

Backend (app.py):
```python
app.run(debug=True)  # Already enabled
```

Frontend - Check browser console:
```
Press F12 → Console tab → Check for red errors
```

**Check what's running:**
```bash
# macOS/Linux - check ports
lsof -i :3000
lsof -i :5000
netstat -an | grep LISTEN

# Windows
netstat -ano
```

---

## Features Implemented

✅ **Emergency Services**
- Find nearest Police (100)
- Find nearest Hospital (102)  
- Find nearest Fire Station (101)
- Direct phone integration
- Google Maps directions

✅ **AI Features**
- Emergency severity analysis
- Intelligent recommendations
- Service suggestions

✅ **Emergency Contacts**
- Add/Edit/Delete contacts
- Quick dial functionality
- Quick access from home

✅ **Maps**
- Live location tracking
- Service location markers
- Interactive Folium maps

✅ **India-Specific**
- Emergency numbers: 100, 102, 101, 112
- Optimized for Indian locations
- Rupee-friendly (free/low cost)

✅ **UI/UX**
- Beautiful gradient colors
- Responsive design
- Dark mode support
- Social media links

---

## Still Having Issues?

1. **Check all 3 are running:**
   ```bash
   # Terminal 1: MySQL running
   # Terminal 2: Flask running (shows http://127.0.0.1:5000)
   # Terminal 3: Next.js running (shows http://localhost:3000)
   ```

2. **Verify env files:**
   - `backend/.env` - database credentials
   - `.env.local` - NEXT_PUBLIC_API_URL

3. **Check connectivity:**
   ```bash
   curl http://localhost:5000/api/health  # Should work
   ```

4. **Review logs:**
   - Backend terminal: Python error messages
   - Frontend terminal: JavaScript errors
   - Browser console (F12): Network/CORS errors

5. **Last resort - restart everything:**
   ```bash
   # Close all 3 terminals
   # Start fresh with steps above
   ```

---

## Production Checklist

- [ ] Update NEXT_PUBLIC_API_URL to production backend
- [ ] Set FLASK_ENV=production
- [ ] Use proper database (not localhost)
- [ ] Enable HTTPS
- [ ] Configure email (use SendGrid, AWS SES, etc)
- [ ] Set up error logging (Sentry)
- [ ] Deploy frontend (Vercel, Netlify)
- [ ] Deploy backend (Heroku, DigitalOcean, AWS)

---

**Ready? Start with the Quick Start section at the top!** 🚀

---

## Troubleshooting

### Issue: Dependencies won't install

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use different port
pnpm dev -- -p 3001
```

### Issue: Location permission blocked

**Solution:**
1. Go to browser settings
2. Find "Privacy & Security" or "Site Settings"
3. Reset permissions for localhost
4. Reload the page

### Issue: API calls fail (CORS errors)

**Solution:**
- Ensure Flask backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify Flask has CORS enabled:
```python
from flask_cors import CORS
CORS(app)
```

### Issue: Map not loading

**Solution:**
- Check internet connection (maps require external CDN)
- Clear browser cache
- Try incognito/private mode
- Verify Leaflet CSS is loaded (should be in network tab)

### Issue: TypeScript errors

**Solution:**
```bash
# Regenerate TypeScript definitions
rm -rf .next
pnpm build
```

---

## Deployment

### Deploy to Vercel (Recommended)

**Option 1: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option 2: GitHub Integration**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel automatically builds and deploys on push

### Deploy to Netlify

```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.next
```

### Deploy to Traditional Server

```bash
# Build for production
npm run build

# Start production server
npm start

# (Keep terminal open with process manager like PM2)
npm install -g pm2
pm2 start "npm start" --name "safeguard"
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t safeguard .
docker run -p 3000:3000 safeguard
```

---

## Development Workflow

### Making Changes

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes:**
- Edit files in `app/`, `components/`, etc.
- Changes auto-reload with HMR

3. **Test your changes:**
- Visit http://localhost:3000
- Check browser console for errors

4. **Commit your changes:**
```bash
git add .
git commit -m "Add: description of changes"
git push origin feature/your-feature-name
```

5. **Create a Pull Request** on GitHub

### Testing

Run type checking:
```bash
npm run type-check
```

Lint code:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

---

## Next Steps

1. **Customize Colors**: Edit `tailwind.config.ts` and `app/globals.css`
2. **Add Backend Integration**: Implement real API calls in Flask
3. **Database Setup**: Add user accounts and data persistence
4. **Deploy**: Choose a hosting platform and deploy
5. **Monitor**: Set up error tracking and analytics

---

## Getting Help

- **Documentation**: See [README.md](./README.md)
- **Issues**: Check [GitHub Issues](https://github.com/yourusername/safeguard/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/safeguard/discussions)

---

**Ready to go? Start with: `pnpm dev`** 🚀
