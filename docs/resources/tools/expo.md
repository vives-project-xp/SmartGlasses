!!! warning
	This file serves as a reference for understanding expo. For installation or setup, see the [Getting Started](../Getting%20Started/README.md) folder.

# Expo Reference Guide

![expo logo](../assets/logo-wordmark.png)

## What is Expo?

Expo is a framework and toolchain built on top of React Native.
It lets you build mobile apps for iOS, Android, and Web using one JavaScript or TypeScript codebase.
It provides a preconfigured native runtime, access to native APIs, fast development through Expo Go, and cloud builds using EAS (Expo Application Services).

---

## Why use Expo?

- Create mobile apps without Xcode or Android Studio.
- Cross-platform: iOS, Android, and web from one codebase.
- Instant reload and rapid iteration with Expo Go.
- Access to Camera, Haptics, Sensors, FileSystem, Notifications, and more.
- Production-ready builds with EAS.
- Strong TypeScript support.
- Excellent developer experience.

---

## Project Structure

Create a new Expo project:

```bash
npx create-expo-app my-app
```

Typical structure:

- `app/` — screens and routes (Expo Router)
- `app.json` or `app.config.js` — configuration
- `package.json` — dependencies and scripts
- `assets/` — images, fonts, icons
- `metro.config.js` — bundler config (optional)

Example `app.json`:

```json
{
  "expo": {
    "name": "my-expo-app",
    "slug": "my-expo-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "android": {
      "package": "com.example.myexpoapp"
    }
  }
}
```

---

## Running Expo Apps

Start the development server:

```bash
npx expo start
```

Options when running:

- Scan the QR code with Expo Go
- Run in an Android emulator
- Run in an iOS simulator
- Open the web preview

---

## Expo Modules & Native APIs

Use built-in native modules:

```javascript
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import * as Battery from "expo-battery";
```

Example:

```javascript
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
```

Install a new module the Expo way:

```bash
npx expo install expo-camera
```

Expo will choose compatible native versions for your SDK.

---

## Expo Router

Expo Router uses the filesystem as navigation.

Example structure:

```
app/
 ├── index.js
 ├── profile.js
 ├── settings.js
 └── (more routes...)
```

Each file becomes a route:

- `/` -> `index.js`
- `/profile` -> `profile.js`
- `/settings` -> `settings.js`

Basic screen example:

```javascript
import { View, Text } from "react-native";

export default function Screen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Hello from Expo!</Text>
    </View>
  );
}
```

---

## EAS (Expo Application Services)

EAS provides cloud-based building, submitting, and over-the-air updates.

Install the EAS CLI:

```bash
npm install -g eas-cli
```

Initial configuration:

```bash
eas build:configure
```

Build binaries for platforms:

```bash
eas build -p android
eas build -p ios
```

Submit to stores:

```bash
eas submit -p android
eas submit -p ios
```

Use `eas update` for OTA updates to JavaScript and assets.

---

## Environment Variables

Manage environment and configuration via `app.config.js` or `app.json` `extra` fields.

Example `app.config.js`:

```javascript
export default ({ config }) => ({
  ...config,
  extra: {
    apiUrl: process.env.API_URL,
  },
});
```

Start with variables:

```bash
API_URL="https://api.example.com" npx expo start
```

Access them in app code:

```javascript
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;
console.log(apiUrl);
```

For secrets in production, use a secure environment (CI secrets, EAS secrets).

---

## Prebuilding and Bare Workflow

If you need custom native code or modules, use prebuild:

```bash
npx expo prebuild
```

This generates native `ios/` and `android/` folders so you can edit native code. If you choose this path, you move from managed Expo workflow toward a "bare" React Native project with Expo tooling still available.

---

## Debugging and Development Tools

- Expo DevTools: browser UI that comes up with `npx expo start`.
- React Native Debugger and Flipper for deeper inspection.
- Use `console.log`, breakpoints in VS Code, and React DevTools.
- `npx expo start --tunnel` to debug across networks.

---

## Useful Expo Commands — Reference

### General

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npx expo start`       | Start development server           |
| `npx expo install`     | Install Expo-compatible packages   |
| `npx expo prebuild`    | Generate native Android/iOS code   |
| `npx expo run:android` | Run on Android device/emulator     |
| `npx expo run:ios`     | Run on iOS simulator/device        |
| `npx expo export`      | Export a static web build          |
| `npx expo doctor`      | Diagnose project issues            |
| `npx expo upgrade`     | Upgrade Expo SDK version           |
| `npx expo publish`    | Publish an OTA update              |

### Flags
| Flag                   | Description                        |
| ---------------------- | ---------------------------------- |
| `--clear`              | Clear Metro bundler cache          |
| `--tunnel`             | Use tunnel connection for devices  |	
| `--lan`                | Use LAN connection for devices     |
| `--localhost`          | Use localhost connection for devices|

- `--tunnel`, `--lan`, and `--localhost` specify how devices connect to the dev server.
  - `--tunnel` works when your testing device is on a different network.
  - `--lan` is faster but requires devices to be on the same network.
  - `--localhost` is for local development on the same machine.

- `--clear` helps resolve caching issues.

💡 Use `npx expo --help` to see all available commands and options.
the terminal shows the different options available and shorthands.


### EAS Tools

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `eas build`             | Build Android/iOS binaries         |
| `eas submit`            | Submit to app stores               |
| `eas update`            | Push OTA updates                   |
| `eas build:configure`   | Configure project for EAS builds   |

---

## Example: Creating a Basic Expo App

1. Create the project:

```bash
npx create-expo-app my-app
cd my-app
```

2. Start development:

```bash
npx expo start
```

3. Create a simple screen at `app/index.js`:

```javascript
import { View, Text } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Expo app running!</Text>
    </View>
  );
}
```

4. Open the app:

- Scan QR code with Expo Go
- Or run in emulator/simulator

---

## Best Practices

- Use `expo install` to preserve compatibility with your SDK.
- Prefer EAS builds for production and store submissions.
- Keep your Expo SDK version updated; follow upgrade guides.
- Store secrets outside the repository; use CI or EAS secret stores.
- Use TypeScript for larger projects to catch errors early.
- Modularize code: separate screens, components, hooks, and services.
- Add tests for critical flows (unit and integration).

---

## Troubleshooting Tips

- If a module fails, run `expo doctor` to diagnose version mismatches.
- Clear caches: `npx expo start -c`.
- If native build fails in EAS, check build logs in the EAS dashboard.
- Use `expo diagnostics` to collect environment info for bug reports.

---

## Comparison: Expo vs Bare React Native

**Expo (Managed)**
- Fast iteration, fewer native worries
- Easier access to many native APIs
- Best for most apps and rapid prototyping

**Bare React Native**
- Full native control and custom native modules
- Required for some advanced native features
- Slightly more complex setup and maintenance

---

## Additional Resources

- [docs.expo.dev](https://docs.expo.dev/)
- [reactnative.dev](https://reactnative.dev/)
- [github.com/expo/expo](https://github.com/expo/expo)
---

