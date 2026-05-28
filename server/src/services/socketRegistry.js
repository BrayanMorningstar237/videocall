const usersToSockets = new Map();
const socketsToUsers = new Map();

function registerUser(userId, socketId) {
  const previousSocketId = usersToSockets.get(userId);

  if (previousSocketId && previousSocketId !== socketId) {
    socketsToUsers.delete(previousSocketId);
  }

  usersToSockets.set(userId, socketId);
  socketsToUsers.set(socketId, userId);
}

function unregisterSocket(socketId) {
  const userId = socketsToUsers.get(socketId);

  if (userId && usersToSockets.get(userId) === socketId) {
    usersToSockets.delete(userId);
  }

  socketsToUsers.delete(socketId);
  return userId;
}

function getSocketId(userId) {
  return usersToSockets.get(userId);
}

function getUserId(socketId) {
  return socketsToUsers.get(socketId);
}

function getOnlineUsers() {
  return Array.from(usersToSockets.entries()).map(([userId, socketId]) => ({
    socketId,
    userId,
  }));
}

module.exports = {
  getOnlineUsers,
  getSocketId,
  getUserId,
  registerUser,
  unregisterSocket,
};
