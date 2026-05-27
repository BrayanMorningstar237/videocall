const usersToSockets = new Map();
const socketsToUsers = new Map();

function registerUser(userId, socketId) {
  usersToSockets.set(userId, socketId);
  socketsToUsers.set(socketId, userId);
}

function unregisterSocket(socketId) {
  const userId = socketsToUsers.get(socketId);

  if (userId) {
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

module.exports = {
  getSocketId,
  getUserId,
  registerUser,
  unregisterSocket,
};
