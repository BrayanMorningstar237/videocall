# RTC Engine Architecture

The RTC engine is separated into a small set of modules with stable responsibilities.

## Client Modules

- `rtc/socket.js`: Socket.IO connection, registration, event helpers, and cleanup.
- `rtc/peer.js`: RTCPeerConnection creation, SDP offer/answer handling, ICE handling, and stream events.
- `rtc/media.js`: Camera/microphone stream lifecycle and local device controls.
- `rtc/signaling.js`: High-level call signaling commands.
- `rtc/callManager.js`: Orchestrates media, peer, socket, call state, and cleanup.
- `hooks/useCall.js`: App-facing API for screens and product modules.
- `store/callStore.js`: Global call state.

## Backend Modules

- `sockets/call.socket.js`: Socket.IO call signaling event handlers.
- `services/socketRegistry.js`: Maps stable user IDs to changing socket IDs.
- `models/Call.js`: Call history persistence.
- `config/env.js`: Runtime configuration.

## Lifecycle

```text
User opens app
Socket connects
User registers online
Caller starts local media
Caller creates offer
Caller emits call-user
Receiver accepts
Receiver creates answer
Both exchange ICE candidates
Peer connection becomes active
Streams render
Either user ends call
Peer, media, and socket listeners clean up
```

## Reuse Contract

Application code should depend on `useCall()` and shared event constants, not directly on `RTCPeerConnection` or Socket.IO internals. That keeps this layer portable across products.
