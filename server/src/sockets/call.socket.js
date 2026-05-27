const { CALL_EVENTS } = require('@rtc-engine/shared');
const {
  getSocketId,
  registerUser,
  unregisterSocket,
} = require('../services/socketRegistry');
const {
  createCallLog,
  updateLatestCall,
  updateLatestCallBetween,
} = require('../services/callLogService');

function emitToUser(io, userId, eventName, payload) {
  const socketId = getSocketId(userId);

  if (!socketId) {
    return false;
  }

  io.to(socketId).emit(eventName, payload);
  return true;
}

function registerCallSocketHandlers(io, socket) {
  socket.on(CALL_EVENTS.REGISTER_USER, ({ userId }) => {
    registerUser(userId, socket.id);
    socket.data.userId = userId;
    io.emit(CALL_EVENTS.USER_ONLINE, { userId });
  });

  socket.on(CALL_EVENTS.CALL_USER, async (payload) => {
    const delivered = emitToUser(io, payload.receiverId, CALL_EVENTS.INCOMING_CALL, payload);

    if (!delivered) {
      socket.emit(CALL_EVENTS.CALL_ERROR, {
        message: 'Receiver is not online.',
        receiverId: payload.receiverId,
      });
      return;
    }

    await createCallLog(payload);
  });

  socket.on(CALL_EVENTS.ANSWER_CALL, async (payload) => {
    emitToUser(io, payload.callerId, CALL_EVENTS.CALL_ACCEPTED, payload);
    await updateLatestCall({
      callerId: payload.callerId,
      receiverId: payload.receiverId,
      status: 'accepted',
    });
  });

  socket.on(CALL_EVENTS.REJECT_CALL, async (payload) => {
    emitToUser(io, payload.callerId, CALL_EVENTS.CALL_REJECTED, payload);
    await updateLatestCall({
      callerId: payload.callerId,
      receiverId: payload.receiverId,
      status: 'rejected',
    });
  });

  socket.on(CALL_EVENTS.ICE_CANDIDATE, (payload) => {
    emitToUser(io, payload.toUserId, CALL_EVENTS.ICE_CANDIDATE, payload);
  });

  socket.on(CALL_EVENTS.END_CALL, async (payload) => {
    emitToUser(io, payload.toUserId, CALL_EVENTS.CALL_ENDED, payload);
    await updateLatestCallBetween({
      userAId: payload.fromUserId,
      userBId: payload.toUserId,
      status: 'ended',
    });
  });

  socket.on('disconnect', () => {
    const userId = unregisterSocket(socket.id);

    if (userId) {
      io.emit(CALL_EVENTS.USER_OFFLINE, { userId });
    }
  });
}

module.exports = { registerCallSocketHandlers };
