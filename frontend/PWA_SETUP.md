# Green Idea - PWA Setup

This is the Progressive Web App (PWA) version of Green Idea that can be installed on mobile home screens.

## Features

✅ **Installable on Home Screen** - Add to home screen on Android/iOS
✅ **Offline Support** - Service worker caching for offline functionality
✅ **App Shortcuts** - Quick access to Farming, Jobs, and Transport
✅ **Push Notifications Ready** - Can receive notifications
✅ **Fast & Responsive** - Optimized for mobile devices
✅ **Bilingual** - Tamil and English support

## Installation on Mobile

### Android
1. Open the app in Chrome or Firefox
2. Tap the menu (⋮) → "Install app" or "Add to Home screen"
3. Choose app name and tap "Install"
4. App appears on home screen

### iOS (iPhone/iPad)
1. Open the app in Safari
2. Tap the Share button (↗️)
3. Scroll and tap "Add to Home Screen"
4. Enter app name and tap "Add"
5. App appears on home screen

## Building & Deployment

### Local Development
```bash
cd frontend
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy to Render
Deploy the backend service using `backend/render.yaml` and configure Render environment variables.

## Environment Variables (.env)

Create a `.env` file in the frontend directory:

```
VITE_API_URL=https://your-backend-api.com
```

For Vercel, add these in project settings → Environment Variables

## File Structure

```
frontend/
├── src/
│   ├── components/
│   ├── api/
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── manifest.json (PWA manifest)
│   ├── service-worker.js (offline support)
│   └── icons/ (app icons)
├── index.html (PWA meta tags)
├── vite.config.js
├── vercel.json (Vercel config)
└── package.json
```

## PWA Configuration Files

- **manifest.json** - App metadata, icons, app shortcuts
- **service-worker.js** - Offline caching, network handling
- **index.html** - PWA meta tags for iOS/Android
- **vercel.json** - Deployment configuration

## Backend API Integration

The app connects to the Flask backend at the URL specified in `VITE_API_URL`.

**Backend URL Examples:**
- Local: `http://localhost:5000`
- Production: `https://green-idea-api.example.com`

## Troubleshooting

### App not installable?
- Ensure service worker is registered (check browser console)
- Check manifest.json is accessible
- Clear browser cache and try again

### Images not showing?
- Ensure image URLs are complete (http/https)
- Check CORS configuration in backend
- Verify image URLs in database are valid

### Offline doesn't work?
- Check service worker in DevTools → Application → Service Workers
- Verify Cache Storage in DevTools
- Clear all caches and reload

## Testing

### Browser DevTools - Application Tab
1. Press F12 → Application tab
2. Check "Service Workers" status
3. View "Manifest" for PWA configuration
4. Test offline by going offline and checking if cached pages load
