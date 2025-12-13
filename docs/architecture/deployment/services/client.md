# Client (Expo / React Native web dev)

## Overview

The client is built using Expo (a framework on top of React Native) and provides the user-facing camera capture, UI, and network interactions with the backend. It targets mobile and web (Expo for web) using a single codebase.

## Core technologies & references

- Expo (<https://docs.expo.dev/>): simplifies development of React Native apps by bundling native modules, providing local dev tooling (Metro), and offering optional services (EAS) for building and deployment.
- React Native (<https://reactnative.dev/>): the underlying UI framework for building native-like UIs using JavaScript/TypeScript.
- Expo Router / File-based routing (if used): organizes screens and navigation using filesystem conventions (see Expo docs).

## Why Expo + React Native here?

- Single codebase for iOS, Android and web which accelerates development and testing.
- Expo provides a managed workflow that reduces native build complexity during iterative development.
- The app can access camera APIs and web sockets for streaming and realtime interactions.

## Key modules in this repo

- `client/app/camera.tsx`: Camera view and hooks — captures frames and orchestrates uploads to `/keypoints` or builds landmark sequences for LSTM predictions.
- `client/lib/api.ts`: API helpers for REST/WebSocket calls and error handling.
- `client/components`: UI primitives and overlays (landmarks overlay, prediction UI).

## Local development

Quick start using Docker Compose (dev):

```bash
docker compose up --build client
```

Or using the standard Expo workflow locally:

```bash
cd client
npm install
npm start
# then open on web or scan the QR for native device
```

## Performance and camera capture

- Capture cadence: choose a sensible frame rate (e.g., 10–20 FPS) and downscale frames before sending to reduce bandwidth and latency.
- Local pre-processing: the app can extract camera-native keypoints (if using a client-side model) or send frames to the backend for server-side MediaPipe extraction.
- Sequence building: for LSTM prediction, the client is responsible for collecting 40 sequential frames/landmark snapshots and sending them as one request to reduce server-side state management.

## Security & best practices

- Use HTTPS for all network traffic (in dev, rely on local docker networking or port forwards; in production use TLS via ingress).
- Validate server certificates in production and disable permissive dev CORS.

## Testing & debugging

- Use Expo Snack for quick prototype demos: <https://snack.expo.dev/>.
- Debugging: use React Native Debugger, Expo devtools, and browser console (for web).

## References

- Expo docs: <https://docs.expo.dev/>
- React Native docs: <https://reactnative.dev/>
- Expo Camera API: <https://docs.expo.dev/versions/latest/sdk/camera/>

## Deployment notes

- In k8s, the client may be deployed as a static web app (if using web build) behind the ingress, or the native app is distributed via stores built with EAS (Expo Application Services).
- K8s manifests: `k8s/client.*.yaml`.
