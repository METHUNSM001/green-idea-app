# Quick Deployment Guide

Complete steps to deploy Green Idea to GitHub, Vercel, and App Stores.

## 🚀 Step 1: Push to GitHub (5 minutes)

```bash
# Navigate to project root
cd c:\Users\smmet\greenidea

# Initialize git (if not already done)
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Green Idea platform with PWA and React Native"

# Add remote
git remote add origin https://github.com/METHUNSM001/green-idea-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify**: Visit https://github.com/METHUNSM001/green-idea-app

---

## 🌐 Step 2: Deploy Web/PWA to Vercel (10 minutes)

### Option A: Vercel CLI

```bash
cd frontend

# Login to Vercel
npm i -g vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Choose `green-idea-app` repo
5. Select `frontend` as root directory
6. Add environment variables:
   - `VITE_API_URL` = Your backend API URL
7. Click "Deploy"

### Environment Variables in Vercel

Project Settings → Environment Variables

```
VITE_API_URL=https://your-api.example.com
```

**Access your live PWA**:
- URL: `https://[project-name].vercel.app`
- Install on mobile home screen!

---

## 📱 Step 3: Build Mobile Apps (30-60 minutes)

### Prerequisites

```bash
# Install EAS CLI and Expo
npm i -g eas-cli expo-cli

# Login to Expo
eas login
```

### Build Android APK

```bash
cd green-idea-mobile

# Build for Android
eas build --platform android

# Download APK
eas build:list
eas build download --id <build-id> --platform android
```

### Build iOS IPA

```bash
cd green-idea-mobile

# Build for iOS
eas build --platform ios

# Download IPA
eas build:list
eas build download --id <build-id> --platform ios
```

---

## 📦 Step 4: Submit to App Stores (2-4 weeks)

### Google Play Store

```bash
# Prerequisites:
# 1. Google Play Developer account ($25 one-time)
# 2. Set up app signing certificate

cd green-idea-mobile

# Submit directly
eas submit --platform android --latest
```

**Or manually:**
1. Go to https://play.google.com/console
2. Create app listing
3. Upload APK to Internal Testing → Closed Testing → Production
4. Fill store listing details
5. Submit for review (2-3 days approval)

### Apple App Store

```bash
# Prerequisites:
# 1. Apple Developer account ($99/year)
# 2. Set up certificates & provisioning profiles

cd green-idea-mobile

# Submit directly
eas submit --platform ios --latest
```

**Or manually:**
1. Go to https://appstoreconnect.apple.com
2. Create app listing
3. Upload IPA via Transporter
4. Fill app details
5. Submit for review (1-2 weeks approval)

---

## ✅ Verification Checklist

### GitHub Repository
- [ ] Repository created at https://github.com/METHUNSM001/green-idea-app
- [ ] All files pushed successfully
- [ ] .gitignore is working (no node_modules, .env, etc.)
- [ ] README.md visible on repo home

### Vercel PWA
- [ ] PWA deployed and accessible
- [ ] Can install on Android home screen
- [ ] Can install on iOS home screen
- [ ] Offline mode works
- [ ] Service worker registered (DevTools → Application)

### Mobile Apps
- [ ] Android APK builds successfully
- [ ] iOS IPA builds successfully
- [ ] Apps connect to backend API
- [ ] Login/Register works

---

## 🔄 Continuous Updates

### Push updates to GitHub
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Auto-deploy to Vercel
Vercel automatically deploys when you push to `main` branch.

### Update mobile apps
```bash
cd green-idea-mobile
git add .
git commit -m "fix: bug fix"
git push origin main

# Then rebuild:
eas build --platform android
eas build --platform ios
```

---

## 🐛 Troubleshooting

### Vercel Deploy Fails
```bash
# Check build logs in Vercel dashboard
# Usually caused by:
# - Missing environment variables
# - Build errors (typos, imports)
# - Node version incompatibility

# Fix: Add all required env vars and rebuild
```

### EAS Build Fails
```bash
# Check logs
eas build:list

# Common issues:
# - No internet connection
# - Expo credentials expired
# - App.json configuration errors

# Fix: eas login again, check app.json
```

### App can't connect to backend
```bash
# Check VITE_API_URL / REACT_APP_API_URL
# Verify backend is running and accessible
# Check CORS configuration on backend
# Test with: curl https://your-api-url/api/auth/login
```

---

## 📊 Status Dashboard

Create this file in your repo root and update weekly:

```markdown
# Green Idea - Deployment Status

## 🌐 Web/PWA (Vercel)
- URL: https://[project].vercel.app
- Status: ✅ Live
- Last Deploy: YYYY-MM-DD
- Users: ~XXX

## 📱 Android (Google Play)
- Status: ⏳ Submitted for Review / ✅ Live
- Download: [Link to Play Store]
- Users: ~XXX

## 🍎 iOS (Apple App Store)
- Status: ⏳ Submitted for Review / ✅ Live
- Download: [Link to App Store]
- Users: ~XXX

## 🔧 Backend API
- URL: https://api.green-idea.com
- Status: ✅ Running
- Database: ✅ Connected
- Users: ~XXX

## 📊 Analytics
- MAU: ~XXX
- DAU: ~XXX
- Crashes: ~X
- Performance: Good
```

---

## 📞 Support URLs

Create GitHub Issues for:
- Bugs: https://github.com/METHUNSM001/green-idea-app/issues/new?template=bug.md
- Features: https://github.com/METHUNSM001/green-idea-app/issues/new?template=feature.md
- Questions: https://github.com/METHUNSM001/green-idea-app/discussions

---

## 🎯 Next Steps

1. **Week 1**: Push to GitHub, deploy to Vercel PWA
2. **Week 2**: Test PWA on mobile, collect feedback
3. **Week 3**: Build and submit Android app
4. **Week 4**: Build and submit iOS app
5. **Week 5+**: Monitor, iterate, and improve

---

**Estimated Time: 2-4 weeks from now until fully deployed to all platforms**
