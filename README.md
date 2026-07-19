# Green Idea - Smart Farming Platform

A complete agricultural services platform connecting farmers with workers, transporters, equipment providers, and AI-powered farming assistance.

**Live Versions:**
- 🌐 **Web/PWA**: https://green-idea.vercel.app (Installable on home screen)
- 📱 **Mobile App**: Available on [Google Play](#) | [App Store](#) (Coming soon)

## 📋 Project Overview

Green Idea is a comprehensive platform that enables:
- **Farmers** to find workers, transport, and equipment
- **Workers** to find job opportunities
- **Transporters** to advertise their services
- **Equipment providers** to rent out tools and machinery
- **Smart AI recommendations** for crop selection and farming practices

### Technology Stack

| Component | Technology |
|---|---|
| **Frontend (Web/PWA)** | React 18 + Vite |
| **Frontend (Mobile)** | React Native + Expo |
| **Backend** | Flask + Python |
| **Database** | MySQL 8.x |
| **Deployment (Web)** | Vercel |
| **Deployment (Mobile)** | Expo/EAS + App Stores |
| **External APIs** | OpenWeather, Groq AI |

## 🚀 Quick Start

### For Web/PWA Development
```bash
cd frontend
npm install
npm run dev
```

Access at `http://localhost:5173`

### For Mobile Development
```bash
cd green-idea-mobile
npm install
npm start
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`

## 📁 Repository Structure

```
green-idea/
├── frontend/                    # React + Vite PWA app
│   ├── public/
│   │   ├── manifest.json       # PWA manifest
│   │   ├── service-worker.js   # Offline support
│   │   └── icons/              # App icons
│   ├── src/
│   │   ├── components/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html              # PWA meta tags
│   ├── vercel.json             # Vercel config
│   ├── vite.config.js
│   ├── PWA_SETUP.md            # PWA guide
│   └── package.json
│
├── green-idea-mobile/           # React Native + Expo app
│   ├── app.json                # Expo config
│   ├── App.js                  # Navigation
│   ├── screens/                # Screen components
│   ├── assets/                 # Icons & splash
│   ├── README.md               # Mobile guide
│   └── package.json
│
└── backend/                    # Flask API
    ├── app.py                  # Main application
    ├── auth_routes.py          # Authentication
    ├── database.py             # DB connection
    ├── config.py               # Config
    ├── requirements.txt
    └── .env                    # Secrets
```

## 🌐 Web/PWA Version (Vercel Deployment)

### Installation on Mobile

**Android:**
1. Open app in Chrome
2. Menu (⋮) → "Install app"
3. Accept and app appears on home screen

**iOS:**
1. Open app in Safari
2. Share (↗️) → "Add to Home Screen"
3. Accept and app appears on home screen

### Deploy to Vercel

```bash
cd frontend
npm run build      # Build for production
vercel --prod      # Deploy to production
```

Environment variables needed in Vercel dashboard:
- `VITE_API_URL` - Backend API URL

### Features (Web/PWA)
- ✅ Installable on home screen
- ✅ Offline support via service worker
- ✅ App shortcuts (Quick access to Farming, Jobs, Transport)
- ✅ Responsive design (Mobile-first)
- ✅ Bilingual (Tamil & English)
- ✅ Fast load times (code splitting)

See [PWA_SETUP.md](./frontend/PWA_SETUP.md) for detailed PWA configuration.

---

## 📱 Mobile App Version (React Native)

### Installation & Running

```bash
cd green-idea-mobile
npm install
npm start

# Then either:
npm run android   # Android emulator
npm run ios       # iOS simulator
npm run web       # Web preview
```

### Build for App Stores

```bash
# Android
npm run build:android
eas submit --platform android

# iOS
npm run build:ios
eas submit --platform ios
```

### Features (Mobile)
- ✅ Native performance
- ✅ Bottom tab navigation
- ✅ Image picker (camera/gallery)
- ✅ AsyncStorage (local data)
- ✅ Stack navigation
- ✅ Same backend as web

See [green-idea-mobile/README.md](./green-idea-mobile/README.md) for detailed mobile guide.

---

## ⚙️ Backend API

### Running Locally

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Runs on `http://localhost:5000`

### Environment Variables (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=green_idea
JWT_SECRET=your_jwt_secret
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@example.com
GROQ_API_KEY=your_groq_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### Workers
- `GET /api/workers` - List workers (filter by panchayat)
- `POST /api/workers` - Register worker

#### Transporters
- `GET /api/transporters` - List transporters (filter by city, district, vehicle)
- `POST /api/transporters` - Register transporter

#### Equipment
- `GET /api/services/equipment` - List equipment (filter by city, district)
- `POST /api/services/equipment` - Register equipment provider

#### Agriculture
- `POST /api/agriculture/chat` - AI farming assistant
- `GET /api/weather` - Weather forecast

---

## 🔄 Data Models

### Users
```
users:
  - id (PK)
  - username
  - email (unique)
  - password_hash
  - created_at
```

### Workers
```
workers:
  - id (PK)
  - name
  - age
  - phone
  - panchayat
  - city
  - district
  - created_at
```

### Transporters
```
transporters:
  - id (PK)
  - name
  - phone
  - service_type
  - vehicle_type
  - district
  - city
  - location
  - available
  - created_at
```

### Equipment Services
```
equipment_services:
  - id (PK)
  - name
  - phone
  - equipment_name
  - equipment_type
  - district
  - city
  - price
  - image_url (Base64)
  - available
  - created_at
```

---

## 🔐 Security

- ✅ Bcrypt password hashing
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Admin email aliases
- ✅ OTP-based password reset
- ✅ Service worker cache validation

---

## 📊 Deployment Checklist

### Before Production

- [ ] Update backend API URL in frontend
- [ ] Configure environment variables
- [ ] Set up HTTPS certificates
- [ ] Configure CORS properly
- [ ] Test all authentication flows
- [ ] Verify database backups
- [ ] Set up monitoring/logging
- [ ] Test mobile app on multiple devices

### Web/PWA (Vercel)
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Enable automatic deployments
- [ ] Test PWA installation
- [ ] Check offline functionality

### Mobile (App Stores)
- [ ] Build production APK/IPA
- [ ] Set up app signing certificates
- [ ] Create app store listings
- [ ] Configure privacy policy
- [ ] Set up beta testing (TestFlight/Beta)

---

## 🤝 Contributing

1. Clone the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

---

## 🐛 Troubleshooting

### Backend not connecting
```bash
# Check if Flask is running
python app.py

# Verify MySQL is running
mysql -u root -p

# Check environment variables
cat .env
```

### Frontend build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Mobile app crashes
```bash
# Clear Expo cache
expo start --clear

# Reinstall dependencies
rm -rf node_modules && npm install
```

---

## 📞 Support

- Issues: GitHub Issues
- Email: support@greenidea.com
- Documentation: See README files in each directory

---

## 📄 License

MIT License - See LICENSE file

---

## 🎯 Roadmap

- [ ] Push notifications
- [ ] Payment integration
- [ ] Ratings & reviews
- [ ] Chat/messaging
- [ ] Video calling
- [ ] Machine learning for recommendations
- [ ] Multilingual support (expand beyond Tamil/English)
- [ ] Offline data sync
- [ ] Dark mode

---

**Made with ❤️ for Indian farmers**
