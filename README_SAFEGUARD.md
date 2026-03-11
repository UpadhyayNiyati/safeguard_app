# SafeGuard - Emergency Safety Application

A comprehensive emergency safety application that helps users locate nearby emergency services (police stations, hospitals, fire departments) and manage emergency contacts. Built with **Next.js 16** for the frontend and **Flask** for the backend, with **MySQL** database integration.

## 🌟 Key Features

### Emergency Services Finder
- **Real-time Location Detection**: Uses GPS to find your current location
- **Multiple Service Types**: Police stations, hospitals, fire departments
- **Distance Calculation**: Shows exact distance to nearest service
- **Interactive Maps**: Visual representation using Folium maps
- **Direct Calling**: One-click emergency service calling

### Emergency Contacts Management
- **Save Contacts**: Store important contact information securely
- **Quick Dial**: Call contacts with a single tap
- **Edit/Delete**: Manage your contact list easily
- **Local Storage**: Contacts saved in browser for offline access
- **Relationship Tags**: Identify contact types (mother, doctor, friend, etc.)

### User-Friendly Interface
- **Modern Design**: Gradient-based UI with smooth transitions
- **Responsive Layout**: Works seamlessly on all devices
- **Dark/Light Mode**: Automatic theme switching
- **Accessibility**: WCAG compliant design
- **Social Media Integration**: Follow us on Instagram, Twitter, LinkedIn, Facebook

### Support & Information
- **FAQ Section**: Comprehensive answers to common questions
- **Support Channels**: Email, phone, and live chat options
- **Contact Form**: Send feedback and inquiries
- **About Page**: Learn about our mission and values

## 🚀 Quick Start

### Automated Setup (Recommended)

#### On macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

#### On Windows:
```cmd
setup.bat
```

### Manual Setup

#### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- Python 3.8+ ([download](https://www.python.org))
- MySQL 5.7+ ([download](https://www.mysql.com))

#### Step-by-step Instructions

**1. Install Frontend Dependencies**
```bash
npm install
# or
pnpm install
```

**2. Set Up Python Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**3. Install Backend Dependencies**
```bash
pip install -r requirements.txt
```

**4. Configure Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE accident_finder_2;
EXIT;
```

**5. Initialize Database Tables**
```bash
# With virtual environment activated
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('✅ Database initialized')"
```

**6. Start Flask Backend**
```bash
# Keep virtual environment activated
python app.py
```

**7. Start Next.js Frontend (in new terminal)**
```bash
npm run dev
```

**8. Access the Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
safeguard/
├── app/
│   ├── page.tsx                    # Home page with service finder
│   ├── about/page.tsx              # About us
│   ├── contact/page.tsx            # Contact form
│   ├── support/page.tsx            # FAQ & support
│   ├── emergency-contacts/page.tsx # Emergency contacts
│   ├── api/                        # API routes
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── navbar.tsx                  # Navigation
│   ├── footer.tsx                  # Footer with social links
│   ├── map-component.tsx           # Map visualization
│   └── ui/                         # shadcn/ui components
├── app.py                          # Flask backend
├── requirements.txt                # Python dependencies
├── package.json                    # Node.js dependencies
├── .env.local                      # Environment config
├── COMPLETE_SETUP.md               # Detailed setup guide
└── setup.sh / setup.bat            # Auto setup scripts
```

## 🔌 API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login with email
- `POST /verify_otp` - OTP verification
- `GET /logout` - User logout

### Emergency Services
- `POST /api/find-nearby` - Find nearest service
- `POST /api/nearby-services` - Find all nearby services
- `GET /api/health` - Backend health check

### Emergency Contacts
- `GET /get-contacts` - Retrieve user's contacts
- `POST /add-contact` - Add new emergency contact
- `DELETE /delete-contact/<id>` - Remove contact

### Communication
- `POST /send-message` - Contact form submission
- `POST /contact-form` - General inquiry form

## 🎨 UI/UX Features

### Color Scheme
- **Primary Blue**: #3B82F6 - Main actions and highlights
- **Secondary Purple**: #8B5CF6 - Secondary elements
- **Accent Teal**: #14B8A6 - Accent elements
- **Neutrals**: White, Grays, Black for backgrounds and text

### Typography
- **Headings**: Bold, gradient text for visual impact
- **Body**: Clear, readable sans-serif font
- **Icons**: Lucide React icons throughout

### Responsive Design
- Mobile-first approach
- Tablet optimizations (md: breakpoint)
- Desktop enhancements (lg: breakpoint)
- Touch-friendly buttons and inputs

## 🔐 Security Features

- **Environment Variables**: Sensitive data stored in `.env.local`
- **CORS Protection**: Configured for frontend-backend communication
- **Database Validation**: Input validation on all endpoints
- **Email Verification**: OTP-based user verification
- **Session Management**: Secure session handling

## 📋 Environment Configuration

The `.env.local` file contains:

```
# Flask Configuration
FLASK_SECRET_KEY=7c917997c5f294d22a42087f4ab9252a11698b22d0ccf568
FLASK_ENV=development

# Email Settings (Gmail SMTP)
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

# Frontend API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Verify MySQL is running
# Check credentials in .env.local
# Ensure database exists
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS accident_finder_2;"
```

### Module Not Found (Python)
```bash
# Reactivate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use
```bash
# Change Flask port
flask run --port 5001

# Change Next.js port
npm run dev -- -p 3001
```

### Email Not Sending
- Verify Gmail app password
- Enable "Less secure app access"
- Check `MAIL_USERNAME` and `MAIL_PASSWORD`

### Map Not Loading
- Enable geolocation in browser
- Check browser console for errors
- Ensure internet connection

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy on push

### Backend (Heroku/Railway)
1. Create `Procfile`: `web: gunicorn app:app`
2. Set environment variables on platform
3. Deploy with database connection string

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## ⚠️ Important Disclaimer

**SafeGuard is a supplemental tool only.** In life-threatening situations, always call emergency services immediately:
- **US**: 911
- **Europe**: 112
- **India**: 100 (Police), 102 (Ambulance), 101 (Fire)

Do not rely solely on this app for emergency assistance.

## 📞 Support & Contact

- **Email**: support@safeguard.app
- **Phone**: 1-800-SAFEGUARD
- **Website**: https://safeguard.app

## 🙏 Acknowledgments

Built with:
- [Next.js 16](https://nextjs.org) - React framework
- [Flask](https://flask.palletsprojects.com) - Python web framework
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Folium](https://python-visualization.github.io/folium/) - Maps
- [Lucide Icons](https://lucide.dev) - Icon library

---

**Made with ❤️ for your safety**
