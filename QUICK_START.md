# 🛡️ SafeGuard - Quick Start Guide (5 Minutes)

Get SafeGuard running locally in **5 minutes** ⚡

---

## 🚀 Quick Start (Frontend Only - 2 Minutes)

### Terminal 1: Install & Run
```bash
npm install
npm run dev
# Frontend running at http://localhost:3000
```

**Open browser:** http://localhost:3000 ✅

Works without backend! Maps and AI analysis have fallback data.

---

## 🚀 With Backend (Optional - 5 Minutes)

### Terminal 1: Start Flask Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Gmail credentials
python app.py
# Backend running on http://localhost:5000
```

### Terminal 2: Start Next.js Frontend
```bash
# From project root (new terminal)
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
# Frontend running at http://localhost:3000
```

**Open browser:** http://localhost:3000 ✅

---

## 📖 What You Get

### 🏠 Home Page - Main Features
- 🗺️ **Live Map** - Shows your location with Leaflet
- 🚔 **Find Police** - Nearest police stations (uses Overpass API)
- 🏥 **Find Hospitals** - Emergency medical centers
- 🚒 **Find Fire Stations** - Rescue services
- 🧠 **AI Analysis** - Describe emergency, get smart recommendations
- 📞 **Quick Contacts** - Your saved emergency contacts

### 👥 Emergency Contacts Page
- ➕ Add new contacts (Name, Phone, Email, Relationship)
- ✏️ Edit existing contacts
- 🗑️ Delete contacts with confirmation
- ☎️ One-click calling
- 💾 Saved locally and in database

### 📚 Information Pages
- **About** - Mission, values, benefits
- **Support** - FAQ, troubleshooting, safety tips
- **Contact** - Send message, get support

### 📱 Navigation
- Responsive navbar (mobile menu on small screens)
- Beautiful footer with social media links
- Smooth page transitions

---

## 🎯 Test These Features

1. **View Map**
   - Page loads with your location (blue dot)
   - Location permissions granted automatically

2. **Find Nearest Police**
   - Click "Find Now" under Police card
   - See police station on map
   - Distance shown in km
   - Phone number displayed

3. **Add Emergency Contact**
   - Click "My Contacts" in navbar
   - Click "Add Emergency Contact"
   - Fill: Name, Phone, Relationship
   - Click "Save Contact"
   - Contact appears in list

4. **Use AI Analysis**
   - On home page, find AI section (brain icon)
   - Click "Describe Your Emergency"
   - Type: "Person injured in car accident"
   - Click "Analyze with AI"
   - See severity, actions, services to contact

5. **Navigate All Pages**
   - Home - Map and services
   - About - Learn about us
   - Support - Get help
   - Contact - Send message
   - Contacts - Manage emergency contacts

---

## 🔧 Configuration Files

### Frontend (.env.local) - Optional
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (backend/.env) - Optional
```env
FLASK_ENV=development
FLASK_SECRET_KEY=7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568
DATABASE_URI=mysql+pymysql://root:Niya@1820@localhost/accident_finder_2
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=niyatiupadhyay690@gmail.com
MAIL_PASSWORD=cdvapbwqpvoqelwb
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page with map and AI |
| `app/about/page.tsx` | About page |
| `app/contact/page.tsx` | Contact form |
| `app/support/page.tsx` | Support & FAQ |
| `app/emergency-contacts/page.tsx` | Contact management |
| `components/navbar.tsx` | Top navigation |
| `components/footer.tsx` | Bottom footer with social media |
| `components/map-component.tsx` | Leaflet map display |
| `backend/app.py` | Flask REST API |
| `.env.local` | Frontend config (optional) |
| `backend/.env` | Backend config (optional) |

---

## ✅ How to Know It's Working

- [ ] Flask backend running on port 5000
- [ ] Next.js frontend running on port 3000
- [ ] Can see home page with map
- [ ] Blue dot shows your location
- [ ] "Find Now" buttons are clickable
- [ ] Can add/edit/delete contacts
- [ ] AI analysis form works
- [ ] All pages accessible via navbar
- [ ] Footer has social media links
- [ ] Responsive on mobile

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Map not showing | Allow location permission, refresh page |
| API connection error | Make sure Flask is running on 5000 |
| Database error | Create DB: `mysql -u root -p` → `CREATE DATABASE accident_finder_2;` |
| Dependencies missing | Run `pip install -r requirements.txt` |
| Port already in use | Change port: `pnpm dev -- -p 3001` |

---

## 🎨 UI Features

- **Modern Gradient Design** - Blue → Purple → Teal
- **Responsive Layout** - Mobile, tablet, desktop
- **Dark Mode Ready** - Uses CSS variables
- **Smooth Animations** - Hover effects, transitions
- **Accessible** - WCAG compliant
- **Icons** - Beautiful Lucide icons throughout
- **Cards** - Modern card-based layout
- **Forms** - Fully functional forms with validation

---

## 🚀 Next Steps

1. ✅ **Run locally** (you're here!)
2. ➡️ **Customize** - Edit colors, text, add your branding
3. ➡️ **Test thoroughly** - Use all features
4. ➡️ **Read docs** - Check SETUP_GUIDE.md for details
5. ➡️ **Deploy** - Follow DEPLOYMENT.md for production

---

## 📚 Documentation

| Document | What's Inside |
|----------|---------------|
| `SETUP.md` | Complete setup guide (120+ lines) |
| `PROJECT_SUMMARY.md` | Full project details |
| `backend/README.md` | Backend API reference (200+ lines) |
| `QUICK_START.md` | This file (5 minute setup) |
| `README.md` | Main documentation |

---

## 🎯 Architecture

```
Frontend (Next.js 16)           Backend (Flask)
├── Pages (6 total)             ├── REST API
│  ├── Home (map + services)   │  ├── Find services
│  ├── About                    │  ├── Manage contacts
│  ├── Contact                  │  ├── Send alerts
│  ├── Support                  │  └── Health check
│  └── Emergency Contacts       │
├── Components (reusable)       ├── Database (MySQL)
│  ├── Navbar                   │  ├── Users
│  ├── Footer                   │  ├── Contacts
│  ├── Map                      │  └── Logs
│  └── UI components            │
└── API Routes                  └── External APIs
   └── AI Analysis                 ├── Overpass (OSM)
                                   └── Gmail SMTP
```

---

## 💡 Pro Tips

- **Save environment variables** - They're in .env files, don't lose them
- **Check browser console** - Press F12 to see errors
- **Check Flask logs** - Look at terminal running Flask
- **Test in incognito** - Sometimes helps with caching
- **Clear browser cache** - Ctrl+Shift+Delete

---

## 🆘 Getting Help

1. **Check QUICK_START.md** (this file) - Common questions
2. **Check SETUP_GUIDE.md** - Detailed setup info
3. **Check flask_backend/README.md** - API details
4. **Check Support page in app** - FAQ section
5. **Review error messages** - They're usually helpful!

---

## ⚠️ Important Reminders

🚨 **In real emergencies, ALWAYS call 911 first!**

This app is a supplemental tool only, not a replacement for emergency services.

✅ **Keep all documentation files** - Reference them when deploying

📧 **Store credentials safely** - Don't commit .env to git

---

## 🎉 You're Ready!

Everything is set up and running. Start exploring SafeGuard!

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

**Questions? Check the docs! Happy coding! 🛡️**

---

**SafeGuard** - Keeping You Safe, Every Step of the Way 🛡️
