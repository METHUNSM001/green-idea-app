# Green Idea - Smart Farming Platform

A complete agricultural services platform connecting farmers with workers, transporters, equipment providers, and AI-powered farming assistance.

**Live Versions:**
- 🌐 **Backend API**: https://green-idea-backend.onrender.com
- 📱 **Mobile App**: React Native + Expo (Expo Go or EAS build)

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
| **Frontend (Web/PWA)** | React 19 + Vite |
| **Frontend (Mobile)** | React Native + Expo |
| **Backend** | Flask + Python |
| **Database** | Supabase (Postgres) |
| **Backend Deployment** | Render |
| **Frontend Deployment** | Vercel |
| **Mobile Deployment** | Expo/EAS + App Stores |
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

## 🌐 Backend Deployment (Render)

### Installation on Mobile

**Android:**
1. Open app in Chrome
2. Menu (⋮) → "Install app"
3. Accept and app appears on home screen

**iOS:**
1. Open app in Safari
2. Share (↗️) → "Add to Home Screen"
3. Accept and app appears on home screen

### Deploy Backend to Render

The repo includes a Render Blueprint (`render.yaml` at the repo root). In
the Render dashboard: New -> Blueprint -> connect this repo. Render reads
`render.yaml`, builds from the `backend/` folder automatically, and
prompts you for each variable below on first setup.

Environment variables needed in Render service:
- `DATABASE_URL` (Supabase Postgres connection string)
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `GROQ_API_KEY`
- `OPENWEATHER_API_KEY`
- `FRONTEND_ORIGINS` (your Vercel URL, comma-separated if more than one)

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

See `backend/.env.example` for the full list with comments. Summary:

```
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_16_char_app_password
GROQ_API_KEY=your_groq_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
FRONTEND_ORIGINS=http://localhost:5173
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
  - image_url (Supabase Storage public URL, not the image itself)
  - available
  - created_at
```

All tables live in Supabase Postgres - see `supabase/schema.sql` for the
full migration (also applied directly to the project already).

---

## 🔐 Security

- ✅ Bcrypt password hashing
- ✅ JWT token authentication
- ✅ CORS restricted to `FRONTEND_ORIGINS` (not wide open)
- ✅ Admin credentials required via environment variables (no hardcoded
      fallback password in source)
- ✅ OTP-based password reset (same response whether or not the email exists)
- ✅ Row Level Security enabled on every Supabase table
- ✅ Service worker cache validation
- ⚠️ Worker/transporter/equipment registration endpoints have no
      server-side auth check yet (the frontend sends a token, the backend
      doesn't verify it) - decide if these should require login before
      relying on that as an access boundary.

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

### Backend (Render)
- [ ] Connect GitHub repository
- [ ] Configure Render environment variables
- [ ] Deploy backend service to Render
- [ ] Test API end-to-end with mobile app
- [ ] Verify CORS and HTTPS functionality

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

# Test the Supabase connection string directly
psql "$DATABASE_URL" -c "select 1;"

# Check environment variables are set (values hidden)
python -c "import config; print('config loaded OK')"
```
If that fails with an auth error, double check the password in
`DATABASE_URL` against Supabase Dashboard -> Project Settings ->
Database (the password isn't retrievable from the API - reset it there
if you don't have it).

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

