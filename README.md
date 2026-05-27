# Reusable RTC Engine

A modular WebRTC video/audio calling foundation for React, React Native, and app-specific products such as teaching, consultation, telemedicine, support, marketplace, and social apps.

This repository is intentionally structured as infrastructure first:

- `client/` contains the reusable frontend RTC SDK, hooks, and example screens.
- `server/` contains the Socket.IO signaling backend and call persistence layer.
- `shared/` contains event names and shared call constants.
- `docs/` contains architecture and operational notes.

## Architecture

```text
Apps
  -> Reusable RTC Engine
    -> Media Handling
    -> Peer Connections
    -> Signaling
    -> Call State
    -> Device Controls
    -> Reconnection Logic
      -> RTC Backend
        -> Socket.IO
        -> TURN/STUN
        -> Call Events
        -> Authentication
```

## Quick Start

Install dependencies separately in `client` and `server`:

```bash
cd client
npm install

cd ../server
npm install
```

Copy the environment examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Start the signaling server:

```bash
cd server
npm run dev
```

Start the Expo client:

```bash
cd client
npm start
```

## Current Scope

This scaffold provides:

- Socket.IO signaling client
- WebRTC peer connection wrapper
- Local media controls
- Call lifecycle manager
- Zustand call store
- React hook API
- Example React Native screens/components
- Express + Socket.IO backend
- User-to-socket registry
- MongoDB call model

Advanced features such as push notifications, recording, screen sharing, SFU group calls, and mediasoup integration should be added as separate modules.
