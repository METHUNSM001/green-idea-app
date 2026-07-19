# GitHub Setup Guide

Complete guide to push Green Idea to GitHub and configure for deployments.

## 📋 Prerequisites

- GitHub account: https://github.com
- Git installed on your computer
- Repository created: https://github.com/METHUNSM001/green-idea-app

## 🚀 Initial Setup

### 1. Initialize Local Git Repository

```bash
cd c:\Users\smmet\greenidea
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 2. Create .gitignore

```bash
# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.env.local
frontend/package-lock.json

# Mobile
green-idea-mobile/node_modules/
green-idea-mobile/.expo/
green-idea-mobile/dist/
green-idea-mobile/.env
green-idea-mobile/package-lock.json

# Backend
backend/venv/
backend/.env
backend/__pycache__/
backend/*.pyc
backend/.flask_session/

# IDE
.vscode/
.idea/
*.swp
*.swo
*.DS_Store
```

### 3. Add Remote and Push

```bash
# Add remote repository
git remote add origin https://github.com/METHUNSM001/green-idea-app.git

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Green Idea platform with PWA and React Native"

# Push to GitHub
git branch -M main
git push -u origin main
```

## 📁 Repository Structure on GitHub

```
green-idea-app/
├── README.md
├── .gitignore
├── frontend/                 # React + Vite PWA
├── green-idea-mobile/        # React Native + Expo
├── backend/                  # Flask API
└── GITHUB_SETUP.md          # This file
```

## 🔐 Secrets Management

### GitHub Actions Secrets

Go to: Repository Settings → Secrets and Variables → Actions

Add these secrets:

```
VERCEL_TOKEN = your_vercel_token
VERCEL_PROJECT_ID = your_vercel_project_id
VERCEL_ORG_ID = your_vercel_org_id

EAS_TOKEN = your_eas_token
EXPO_TOKEN = your_expo_token

DATABASE_URL = your_mysql_connection_string
JWT_SECRET = your_jwt_secret
API_KEY_GROQ = your_groq_api_key
API_KEY_OPENWEATHER = your_openweather_key
```

### Getting Vercel Token

```bash
# Login to Vercel CLI
vercel login

# Get token from: https://vercel.com/account/tokens
# Create new token and copy it
```

### Getting Expo Token

```bash
# Login to Expo
expo login

# Get token from: https://expo.dev/settings/access-tokens
# Create new token and copy it
```

## 🔄 GitHub Actions CI/CD

### Workflow Files

Create `.github/workflows/` directory with automation workflows:

#### 1. Deploy PWA to Vercel
`.github/workflows/deploy-web.yml`

```yaml
name: Deploy Web (PWA) to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-web.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
        run: |
          cd frontend
          npm install -g vercel
          vercel --prod --token $VERCEL_TOKEN
```

#### 2. Test Backend
`.github/workflows/test-backend.yml`

```yaml
name: Test Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          python -m pytest
```

#### 3. Build Mobile App
`.github/workflows/build-mobile.yml`

```yaml
name: Build Mobile App

on:
  push:
    branches: [main]
    paths:
      - 'green-idea-mobile/**'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Expo CLI
        run: npm install -g expo-cli eas-cli
      
      - name: Install dependencies
        run: |
          cd green-idea-mobile
          npm install
      
      - name: Build Android
        env:
          EAS_TOKEN: ${{ secrets.EAS_TOKEN }}
        run: |
          cd green-idea-mobile
          eas build --platform android --non-interactive
```

## 📦 Environment Setup

### Frontend (.env)
Create `frontend/.env`:
```
VITE_API_URL=https://api.green-idea.com
```

### Mobile (.env)
Create `green-idea-mobile/.env`:
```
REACT_APP_API_URL=https://api.green-idea.com
```

### Backend (.env)
Create `backend/.env`:
```
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=green_idea

JWT_SECRET=your-jwt-secret
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

GROQ_API_KEY=your-groq-key
OPENWEATHER_API_KEY=your-weather-key
```

## 🌐 Vercel Deployment

### Connect to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select "Import Git Repository"
4. Select your GitHub repo
5. Choose "Frontend" folder as root
6. Add environment variables
7. Deploy

### Production Settings

Go to Project Settings:
- **Domains**: Add custom domain
- **Environment Variables**: Add all vars
- **Git**: Configure branch rules
- **Deployments**: Set production branch to `main`

## 🍎 Mobile Deployment

### Build for Google Play Store

```bash
cd green-idea-mobile
eas build --platform android

# Get APK
eas build download --platform android

# Submit to Google Play
eas submit --platform android
```

### Build for Apple App Store

```bash
cd green-idea-mobile
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

## 📊 Monitoring & Analytics

### GitHub Analytics
- Repository Settings → Insights
- Track commits, contributors, network
- Monitor pull requests and issues

### Vercel Analytics
- Vercel Dashboard → Analytics
- Monitor deployments, errors, performance
- Check lighthouse scores

### Application Monitoring
- Sentry: Error tracking
- LogRocket: Session replay
- DataDog: APM (Application Performance Monitoring)

## 🔍 Continuous Monitoring

### Setup Health Checks

Create monitoring for:
- API uptime: https://uptimerobot.com
- Frontend availability: StatusPage.io
- Database backups: Automated daily
- SSL certificates: Let's Encrypt auto-renewal

## 📝 Commit Guidelines

### Commit Message Format

```
type: subject

Body (optional)

Fixes #123
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Dependencies, build, etc.

Example:
```
feat: add equipment provider registration with image upload

- Added drag-and-drop image upload
- Integrated with backend API
- Added bilingual support
- Tested on mobile and desktop

Fixes #456
```

## 🚀 Release Process

### Creating Releases

```bash
# Create a tag
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"

# Push tag to GitHub
git push origin v1.0.0
```

### Automated Releases

In GitHub, go to:
Releases → Create a new release

Add:
- Version tag
- Release title
- Changelog
- Attach APK/IPA files

## 🤝 Collaboration

### Branch Strategy

```bash
# Main branch (production)
main

# Development branch
develop

# Feature branches
feature/add-payment
feature/add-notifications
bug/fix-login-issue
```

### Pull Request Process

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Commit: `git commit -m "feat: add feature"`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request on GitHub
6. Request review
7. Merge after approval

## 📞 Troubleshooting

### Git Issues

```bash
# Fix: Files marked as executable
git config core.filemode false

# Fix: Credential issues
git config --global credential.helper store
git pull  # Enter credentials once, stored

# Fix: Large files rejected
# Add to .gitignore and git rm --cached
```

### Vercel Issues

```bash
# Check deployment logs
vercel logs

# Rebuild production
vercel --prod

# Clear cache
vercel env pull
```

### Repository Size

```bash
# Check size
du -sh .git

# Clean up
git gc --aggressive
git prune
```

## 📚 Resources

- [GitHub Docs](https://docs.github.com)
- [Vercel Docs](https://vercel.com/docs)
- [Expo Deployment](https://docs.expo.dev/deployment)
- [Git Best Practices](https://git-scm.com/book)

---

**Repository**: https://github.com/METHUNSM001/green-idea-app
