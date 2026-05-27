const CALL_EVENTS = {
  REGISTER_USER: 'register-user',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  CALL_USER: 'call-user',
  INCOMING_CALL: 'incoming-call',
  ANSWER_CALL: 'answer-call',
  CALL_ACCEPTED: 'call-accepted',
  REJECT_CALL: 'reject-call',
  CALL_REJECTED: 'call-rejected',
  ICE_CANDIDATE: 'ice-candidate',
  END_CALL: 'end-call',
  CALL_ENDED: 'call-ended',
  CALL_ERROR: 'call-error',
};

const CALL_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  RINGING: 'ringing',
  INCOMING: 'incoming',
  ACTIVE: 'active',
  ENDED: 'ended',
  ERROR: 'error',
};

module.exports = {
  CALL_EVENTS,
  CALL_STATUS,
};
