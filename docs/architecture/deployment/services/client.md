# React Native Client

## Overview

The client is an Expo-based React Native application that provides the user-facing camera capture, interactive UI, and network layer for communicating with the backend. A single codebase targets iOS, Android and the web (via Expo for web), which keeps development and testing fast while allowing the app to access native APIs like the camera and WebSockets.

## Core technologies & references

The app is built on Expo and React Native: Expo reduces native build complexity during iterative development and includes local tooling (Metro) and optional services (EAS), while React Native provides the UI primitives in JavaScript/TypeScript. When used, file-based routing (Expo Router) organizes navigation by filesystem conventions.

References: Expo (<https://docs.expo.dev/>) · React Native (<https://reactnative.dev/>)

## Why Expo + React Native here?

Using Expo with React Native lets the team maintain one codebase for iOS, Android and the web which shortens iteration loops and simplifies testing. Expo's managed workflow reduces native build friction while still allowing access to camera APIs and WebSockets for streaming and real-time interactions.

## Key modules in this repo

Important implementation points live under the `client/` folder. The camera view and hooks are implemented in `client/app/camera.tsx` and are responsible for capturing frames and preparing keypoints or landmark sequences; `client/lib/api.ts` contains helpers for REST and WebSocket calls; and `client/components` holds UI primitives such as overlays and the prediction UI.

## Local development

You can run the client in a container with Docker Compose for a quick development environment, or use the native Expo workflow locally when iterating on UI and platform-specific behavior.

Container (dev):

```bash
docker compose up --build client
```

Native Expo (recommended for device testing):

```bash
cd client
npm install
npm start
# open on web or scan the QR to run on a device
```

## Performance and camera capture

Because camera capture and model inference are bandwidth- and CPU-sensitive, the client should limit capture cadence (a sensible range is 10–20 FPS) and downscale frames before upload. Pre-processing can happen on-device (extracting keypoints) or on the server (sending raw frames); for LSTM predictions the client assembles fixed-length sequences (e.g., 40 frames/landmark snapshots) and submits them as a single request to simplify server-side state and keep latency predictable.

## Security & best practices

All network traffic should use HTTPS in production; during development local Docker networking or port forwarding is acceptable. Validate server certificates in production and avoid wide-open CORS policies that are sometimes used only in dev.

## Testing & debugging

Quick prototypes can be trialed with Expo Snack (<https://snack.expo.dev/>). For debugging, rely on Expo DevTools, React Native Debugger, and the browser console when working with the web target.

## References

- Expo docs: <https://docs.expo.dev/>
- React Native docs: <https://reactnative.dev/>
- Expo Camera API: <https://docs.expo.dev/versions/latest/sdk/camera/>

## Deployment notes

When built for the web, the client can be deployed as a static site behind the cluster ingress; native builds are distributed through app stores and can be produced with EAS. Kubernetes manifests for serving the web build are found under `k8s/client.*.yaml`.
