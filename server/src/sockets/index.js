const { Server } = require('socket.io');
const { env } = require('../config/env');
const { registerCallSocketHandlers } = require('./call.socket');

function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    registerCallSocketHandlers(io, socket);
  });

  return io;
}

module.exports = { createSocketServer };
