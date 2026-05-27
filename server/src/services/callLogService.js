const mongoose = require('mongoose');
const Call = require('../models/Call');

function persistenceEnabled() {
  return mongoose.connection.readyState === 1;
}

async function createCallLog({ callerId, receiverId, metadata }) {
  if (!persistenceEnabled()) {
    return null;
  }

  return Call.create({
    callerId,
    receiverId,
    metadata,
    status: 'ringing',
  });
}

async function updateLatestCall({ callerId, receiverId, status }) {
  if (!persistenceEnabled()) {
    return null;
  }

  return Call.findOneAndUpdate(
    {
      callerId,
      receiverId,
      endedAt: null,
    },
    {
      $set: {
        status,
        endedAt: ['rejected', 'ended', 'failed', 'missed'].includes(status)
          ? new Date()
          : null,
      },
    },
    {
      new: true,
      sort: { startedAt: -1 },
    }
  );
}

async function updateLatestCallBetween({ userAId, userBId, status }) {
  if (!persistenceEnabled()) {
    return null;
  }

  return Call.findOneAndUpdate(
    {
      endedAt: null,
      $or: [
        { callerId: userAId, receiverId: userBId },
        { callerId: userBId, receiverId: userAId },
      ],
    },
    {
      $set: {
        status,
        endedAt: new Date(),
      },
    },
    {
      new: true,
      sort: { startedAt: -1 },
    }
  );
}

module.exports = {
  createCallLog,
  updateLatestCall,
  updateLatestCallBetween,
};
