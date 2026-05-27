import { CALL_EVENTS } from '@rtc-engine/shared';
import { emitEvent } from './socket';

export function callUser(payload) {
  emitEvent(CALL_EVENTS.CALL_USER, payload);
}

export function answerCall(payload) {
  emitEvent(CALL_EVENTS.ANSWER_CALL, payload);
}

export function rejectCall(payload) {
  emitEvent(CALL_EVENTS.REJECT_CALL, payload);
}

export function sendIceCandidate(payload) {
  emitEvent(CALL_EVENTS.ICE_CANDIDATE, payload);
}

export function endCall(payload) {
  emitEvent(CALL_EVENTS.END_CALL, payload);
}
