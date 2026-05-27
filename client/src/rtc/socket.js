import { io } from 'socket.io-client';

let socket = null;

export function connectSocket({ socketUrl, userId, token, options = {} }) {
  if (socket?.connected) {
    return socket;
  }

  socket = io(socketUrl, {
    transports: ['websocket'],
    auth: { token, userId },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
    ...options,
  });

  return socket;
}

export function getSocket() {
  if (!socket) {
    throw new Error('Socket has not been connected. Call connectSocket first.');
  }

  return socket;
}

export function disconnectSocket() {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export function emitEvent(eventName, payload, ack) {
  getSocket().emit(eventName, payload, ack);
}

export function listenEvent(eventName, handler) {
  const activeSocket = getSocket();
  activeSocket.on(eventName, handler);

  return () => activeSocket.off(eventName, handler);
}
