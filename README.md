# GPA Calculator

A modern, user-friendly GPA calculator mobile app built with React Native and Expo. Track your academic progress across multiple accounts, semesters, and courses with ease.

## Features

- **Multiple Student Accounts** – Manage GPA calculations for multiple students or academic profiles
- **Semester & Year Organization** – Structure your courses by academic year and semester
- **Course Management** – Add courses with grades and credit hours
- **Customizable Grade Scales** – Configure your institution's grading system
- **Real-time GPA Calculation** – Instant updates as you add/modify courses
- **Persistent Storage** – Data saved locally on your device
- **Dark Mode Support** – Automatic theme switching based on system preferences
- **Cross-Platform** – Available on iOS, Android, and Web

## Tech Stack

- **Framework:** [Expo](https://expo.dev) with [Expo Router](https://docs.expo.dev/router/introduction/)
- **UI:** React Native with [React Native Paper](https://callstack.github.io/react-native-paper/)
- **State Management:** React Context + AsyncStorage for persistence
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Icons:** [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query)
- **Type Safety:** TypeScript

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm or yarn
- [Expo Go](https://expo.dev/go) app on your mobile device (for testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/teshankalhara/gpa-cal-react-native.git
   cd gpa-cal-react-native
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Open the app:
   - **Mobile:** Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - **Emulator:** Press `a` for Android or `i` for iOS
   - **Web:** Press `w` to open in browser

## Project Structure

```
gpa-cal-react-native/
├── app/                      # App routes (Expo Router file-based routing)
│   ├── (tabs)/               # Tab navigation group
│   │   ├── (home)/           # Home tab with account/semester/year views
│   │   └── settings/         # Settings tab
│   ├── onboarding.tsx        # Onboarding screen
│   ├── _layout.tsx           # Root layout with theme/providers
│   └── +not-found.tsx        # 404 page
├── components/               # Reusable UI components
├── constants/                # App constants and configuration
├── contexts/                 # React Context providers
│   ├── GPAContext.tsx        # GPA calculation & data management
│   └── ThemeContext.tsx      # Theme management
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
└── assets/                   # Static assets (images, fonts)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Start for Android emulator |
| `npm run ios` | Start for iOS simulator |
| `npm run web` | Start for web browser |
| `npm run lint` | Run ESLint |

## Building for Production

### EAS Build (Recommended)

This project is configured for [Expo Application Services (EAS)](https://docs.expo.dev/build/introduction/):

```bash
# Build for Android
npx eas build --platform android

# Build for iOS
npx eas build --platform ios

# Build for both
npx eas build --platform all
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

---
Preview
![IMG_7695 JPG](https://github.com/user-attachments/assets/7a401951-4739-4198-8f33-48d0a63f596f)
![IMG_7696 JPG](https://github.com/user-attachments/assets/b18739be-674a-41cb-a379-34a1eb96eeef)
![IMG_7698 JPG](https://github.com/user-attachments/assets/e34aa489-ce1f-431d-ae42-38df05e82996)
![IMG_7697 JPG](https://github.com/user-attachments/assets/af3c2e21-af7f-4f75-bb63-6a62d1199a02)


Built with ❤️ using [Expo](https://expo.dev)
