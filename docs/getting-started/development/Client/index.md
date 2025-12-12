# Expo React Native - Setup & Run

This document covers installing client dependencies and running the Expo development server.

Prerequisites:

- Node.js ([v22](https://nodejs.org/dist/v22.20.0/node-v22.20.0-x64.msi) recommended)
- npm or yarn
- Expo CLI (optional; `npm install -g expo-cli`)

Install dependencies:

!!! Note
    Development is done in the `client/` directory. Ensure you are in this directory before running commands:
    ```sh
    cd client
    ```

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Expo will present options to run the app on:

- Web browser
- Android emulator
- iOS simulator (Mac only)
- Physical device via Expo Go app

Notes:

- If you plan to work on Android, ensure Android Studio and an emulator or device are available on the host machine.
- For iOS development, use a Mac with Xcode and a simulator or device.
