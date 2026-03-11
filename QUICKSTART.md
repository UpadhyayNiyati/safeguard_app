# SafeGuard - Quick Start Guide (5 Minutes!)

Get the SafeGuard emergency app running in 5 minutes with 3 simple steps!

## ⚡ Super Quick (TL;DR)

Just need the essentials? Here's all you need:

```bash
# Terminal 1: Start MySQL
mysql.server start  # macOS
# net start MySQL80  # Windows
# sudo systemctl start mysql  # Linux

# Terminal 2: Start Flask Backend
cd backend && python app.py

# Terminal 3: Start Next.js Frontend  
pnpm dev

# Open: http://localhost:3000
```

Done! ✅

---

## 📋 Prerequisites (Check First!)

```bash
# Check Node.js installed
node --version  # Must be 18+

# Check Python installed
python --version  # Must be 3.8+

# Check MySQL installed
mysql --version  # Must be 8.0+

# Check pnpm installed
pnpm --version  # If not, run: npm install -g pnpm
```

**All three must be installed!** Get them from:
- Node.js: https://nodejs.org/
- Python: https://www.python.org/
- MySQL: https://dev.mysql.com/downloads/mysql/

---

## 🚀 3-Step Startup

### Step 1️⃣: Start MySQL (Keep Running)

**macOS:**
```bash
mysql.server start
```

**Windows:**
```bash
# Go to Services app → find MySQL80 → Start
# Or command line:
net start MySQL80
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Test it works:**
```bash
mysql -u root -p -h localhost accident_finder_2
# Password: Niya@1820
# Should connect - type: exit
```

---

### Step 2️⃣: Start Flask Backend (NEW Terminal)

```bash
# Navigate to backend
cd backend

# Run Flask
python app.py

# ✅ You should see: Running on http://127.0.0.1:5000
```

**Keep this terminal open!** Backend must stay running.

---

### Step 3️⃣: Start Next.js Frontend (ANOTHER NEW Terminal)

```bash
# Navigate to project root (NOT backend folder!)
cd /path/to/safeguard

# Start development server
pnpm dev

# ✅ You should see: Local: http://localhost:3000
```

**Keep this terminal open too!**

---

## 🌐 Open in Browser

```
http://localhost:3000
```

**You should see:**
✅ SafeGuard homepage
✅ Red emergency button
✅ Service finder cards
✅ Interactive map
✅ All features working

---

## ✨ Try These Features

### 1. Find Police Station
1. Click "Find Nearest Police Station" card
2. Allow location permission
3. See nearest police on map
4. Get phone number & directions

### 2. Call Emergency Number
1. Click "Emergency Call (112)" button
2. Phone dialer opens
3. Call the emergency service

### 3. Add Emergency Contact
1. Click "Get Started" button in navbar
2. Click "Add Emergency Contact"
3. Enter: Name, Relationship, Phone
4. Save - contact appears in list
5. Click contact to call

### 4. Try AI Analysis
1. Click "Describe Your Emergency"
2. Type: "Person injured in accident"
3. Click "Analyze"
4. See severity & recommendations

---

## 🔑 Credentials & Config

Everything is already configured! But here's what's set up:

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)
```
Database: mysql+pymysql://root:Niya%401820@localhost/accident_finder_2
Email: niyatiupadhyay690@gmail.com (for OTP)
```

### MySQL
```
User: root
Password: Niya@1820
Database: accident_finder_2
```

---

## ❌ Troubleshooting (3 Common Issues)

### Issue #1: "Cannot connect to Flask" 

**Symptoms:** Error about http://localhost:5000 connection
```bash
# Solution: Make sure Flask is running!
# Terminal 2 should show: Running on http://127.0.0.1:5000
cd backend
python app.py  # Restart Flask
```

### Issue #2: "Port already in use"

**Symptoms:** "Port 3000/5000 already in use"
```bash
# Kill process using port
# macOS/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue #3: "Map is blank"

**Symptoms:** Map shows but no location
```
Solution:
1. Allow location permission in browser
2. Check internet connection (needs Overpass API)
3. Open F12 console - check for errors
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## 📂 What's Where

| What | Where | Port |
|------|-------|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:5000 | 5000 |
| Database | localhost:3306 | 3306 |

**All 3 must be running!**

---

## 🎨 Want to Customize?

### Change Colors
Edit `app/globals.css` - colors at top of file:
```css
--primary: #3B82F6;      /* Blue */
--secondary: #8B5CF6;    /* Purple */
--accent: #14B8A6;       /* Teal */
```

### Change Company Name
Edit `components/footer.tsx` - find company name

### Update Social Links
Edit `components/footer.tsx` - update URL links

### Add New Pages
1. Create: `app/new-page/page.tsx`
2. Update navbar in: `components/navbar.tsx`

---

## 📚 Need More Info?

| Need | File |
|------|------|
| Detailed setup | [SETUP.md](./SETUP.md) |
| Full docs | [README.md](./README.md) |
| What was built | [IMPLEMENTATION.md](./IMPLEMENTATION.md) |
| Backend info | [backend/README.md](./backend/README.md) |

---

## 🆘 Emergency Numbers (India)

- **100** - Police
- **102** - Ambulance/Hospital
- **101** - Fire
- **112** - All services

*Always call directly in real emergencies!*

---

## ✅ Verify Everything

**Check all 3 terminals show:**

Terminal 1 (MySQL):
```
✅ MySQL is running
```

Terminal 2 (Flask):
```
✅ * Running on http://127.0.0.1:5000
```

Terminal 3 (Next.js):
```
✅ - Local: http://localhost:3000
```

Browser: http://localhost:3000
```
✅ SafeGuard homepage loads
✅ Map shows location
✅ Emergency buttons visible
✅ Service cards clickable
```

If all checkmarks ✅, you're ready to go!

---

## 🚀 What Next?

1. ✅ **Test features** - Try find police, add contact, AI analysis
2. ✅ **Explore code** - Check `app/page.tsx`, `backend/app.py`
3. ✅ **Read docs** - Check SETUP.md for full details
4. ✅ **Customize** - Change colors, add features
5. ✅ **Deploy** - When ready, deploy to Vercel + Heroku

---

## 💡 Pro Tips

✅ **Keep all 3 terminals open** - Close one = app breaks
✅ **Read terminal output** - Errors show there first
✅ **Use F12 in browser** - Check console for JavaScript errors  
✅ **Try incognito mode** - Clear cache issues
✅ **Check ports** - lsof -i :3000 and lsof -i :5000

---

## 🎯 That's It!

You now have:
✅ Emergency service locator
✅ AI-powered analysis
✅ Emergency contacts
✅ Interactive maps
✅ Beautiful UI
✅ Working backend
✅ Complete documentation

**Questions?** Check the docs or review the code!

---

**Version**: 1.0.0 | India Emergency Response

**Need help? Read SETUP.md for detailed guidance** 📖
