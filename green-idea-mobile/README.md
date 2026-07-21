# Green Idea - React Native Mobile App

This is the native mobile version of Green Idea using React Native with Expo.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
cd green-idea-mobile
npm install
```

### Run Locally

**Development Server:**
```bash
npm start
```

**On Android:**
```bash
npm run android
```

**On iOS:**
```bash
npm run ios
```

**On Web (for testing):**
```bash
npm run web
```

## 📁 Project Structure

```
green-idea-mobile/
├── App.js (Main navigation)
├── app.json (Expo configuration)
├── package.json
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── DashboardScreen.js
│   ├── AgricultureScreen.js
│   ├── ServicesScreen.js
│   ├── WorkersScreen.js
│   ├── TransportScreen.js
│   └── EquipmentScreen.js
├── assets/ (Icons, splash screen)
└── .env (Environment variables)
```

## 🔧 Configuration

Create `.env` file:
```
REACT_APP_API_URL=https://green-idea-backend.onrender.com
REACT_APP_API_TIMEOUT=30000
```

Update `app.json` for your project:
```json
{
  "expo": {
    "name": "Green Idea",
    "slug": "green-idea-app",
    "extra": {
      "apiUrl": "http://localhost:5000"
    }
  }
}
```

## 📦 Building for Distribution

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

### Local Build (Android Only)

```bash
npm run build:android
```

## 📱 Distribution

### Google Play Store
1. Create Google Play Developer account ($25 one-time fee)
2. Run: `eas submit --platform android --latest`
3. Upload APK from EAS build

### Apple App Store
1. Create Apple Developer account ($99/year)
2. Run: `eas submit --platform ios --latest`
3. Follow App Store Connect submission process

## 🔑 Environment Setup for App Store Submission

### Android
- Generate keystore: `keytool -genkey -v -keystore app.jks -keyalg RSA -keysize 2048 -validity 10000 -alias app`
- Configure in `app.json` or EAS build settings

### iOS
- Certificate signing requests (CSR)
- App ID creation in Apple Developer
- Provisioning profiles setup

## 📚 Features

- ✅ User Authentication (Login/Register)
- ✅ Dashboard with quick access
- ✅ Smart Farming recommendations
- ✅ Service discovery (Workers, Transport, Equipment)
- ✅ Bilingual support (English/Tamil) - coming soon
- ✅ Image uploads with camera/gallery
- ✅ Offline mode - coming soon
- ✅ Push notifications - coming soon

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on `http://localhost:5000`
- Check firewall settings
- For device testing, use your computer's IP: `http://YOUR_IP:5000`

### Build fails
- Clear cache: `expo start --clear`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 16+)

### Hot reload not working
- Kill and restart: `npm start`
- Check if file saves are triggering recompile

## 📖 Documentation

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Navigation Library](https://reactnavigation.org)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on multiple devices/sizes
4. Submit pull request

## 📝 License

MIT License - See LICENSE file for details
