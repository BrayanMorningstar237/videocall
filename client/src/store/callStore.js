import { create } from 'zustand';
import { CALL_STATUS } from '@rtc-engine/shared';

const initialState = {
  callStatus: CALL_STATUS.IDLE,
  localStream: null,
  remoteStream: null,
  caller: null,
  receiver: null,
  incomingOffer: null,
  isMuted: false,
  isCameraOff: false,
  error: null,
};

export const useCallStore = create((set) => ({
  ...initialState,
  setCallStatus: (callStatus) => set({ callStatus }),
  setLocalStream: (localStream) => set({ localStream }),
  setRemoteStream: (remoteStream) => set({ remoteStream }),
  setIncomingCall: ({ caller, receiver, offer }) =>
    set({
      callStatus: CALL_STATUS.INCOMING,
      caller,
      receiver,
      incomingOffer: offer,
    }),
  setParticipants: ({ caller, receiver }) => set({ caller, receiver }),
  setMuted: (isMuted) => set({ isMuted }),
  setCameraOff: (isCameraOff) => set({ isCameraOff }),
  setError: (error) => set({ error, callStatus: CALL_STATUS.ERROR }),
  resetCall: () => set(initialState),
}));
