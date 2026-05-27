import { CALL_EVENTS, CALL_STATUS } from '@rtc-engine/shared';
import { useCallStore } from '../store/callStore';
import {
  acceptAnswer,
  addIceCandidate,
  closeConnection,
  createAnswer,
  createOffer,
  createPeer,
} from './peer';
import {
  startLocalStream,
  stopLocalStream,
  switchCamera,
  toggleCamera,
  toggleMic,
} from './media';
import { connectSocket, disconnectSocket, emitEvent, listenEvent } from './socket';
import {
  answerCall as emitAnswerCall,
  callUser as emitCallUser,
  endCall as emitEndCall,
  rejectCall as emitRejectCall,
  sendIceCandidate,
} from './signaling';

export class CallManager {
  constructor({ socketUrl, userId, token, iceServers } = {}) {
    this.socketUrl = socketUrl;
    this.userId = userId;
    this.token = token;
    this.iceServers = iceServers;
    this.peer = null;
    this.localStream = null;
    this.remoteUserId = null;
    this.unsubscribers = [];
  }

  initialize() {
    const socket = connectSocket({
      socketUrl: this.socketUrl,
      userId: this.userId,
      token: this.token,
    });

    socket.on('connect', () => {
      emitEvent(CALL_EVENTS.REGISTER_USER, { userId: this.userId });
    });

    this.unsubscribers = [
      listenEvent(CALL_EVENTS.INCOMING_CALL, this.handleIncomingCall),
      listenEvent(CALL_EVENTS.CALL_ACCEPTED, this.handleCallAccepted),
      listenEvent(CALL_EVENTS.ICE_CANDIDATE, this.handleIceCandidate),
      listenEvent(CALL_EVENTS.CALL_REJECTED, this.handleCallRejected),
      listenEvent(CALL_EVENTS.CALL_ENDED, this.handleCallEnded),
      listenEvent(CALL_EVENTS.CALL_ERROR, this.handleCallError),
    ];
  }

  startCall = async ({ receiverId, metadata } = {}) => {
    try {
      this.remoteUserId = receiverId;
      const store = useCallStore.getState();
      store.setCallStatus(CALL_STATUS.CONNECTING);
      store.setParticipants({ caller: this.userId, receiver: receiverId });

      this.localStream = await startLocalStream();
      store.setLocalStream(this.localStream);

      this.peer = this.createConfiguredPeer(receiverId);
      const offer = await createOffer(this.peer);

      emitCallUser({
        callerId: this.userId,
        receiverId,
        offer,
        metadata,
      });

      store.setCallStatus(CALL_STATUS.RINGING);
    } catch (error) {
      useCallStore.getState().setError(error.message);
      this.cleanupCall();
    }
  };

  answerCall = async () => {
    try {
      const store = useCallStore.getState();
      const { caller, incomingOffer } = store;
      this.remoteUserId = caller;
      store.setCallStatus(CALL_STATUS.CONNECTING);

      this.localStream = await startLocalStream();
      store.setLocalStream(this.localStream);

      this.peer = this.createConfiguredPeer(caller);
      const answer = await createAnswer(this.peer, incomingOffer);

      emitAnswerCall({
        callerId: caller,
        receiverId: this.userId,
        answer,
      });

      store.setCallStatus(CALL_STATUS.ACTIVE);
    } catch (error) {
      useCallStore.getState().setError(error.message);
      this.cleanupCall();
    }
  };

  rejectCall = () => {
    const { caller } = useCallStore.getState();
    emitRejectCall({
      callerId: caller,
      receiverId: this.userId,
    });
    this.cleanupCall();
  };

  endCall = () => {
    if (this.remoteUserId) {
      emitEndCall({
        fromUserId: this.userId,
        toUserId: this.remoteUserId,
      });
    }

    this.cleanupCall();
  };

  toggleMute = () => {
    const store = useCallStore.getState();
    const nextMuted = !store.isMuted;
    toggleMic(this.localStream, !nextMuted);
    store.setMuted(nextMuted);
  };

  toggleVideo = () => {
    const store = useCallStore.getState();
    const nextCameraOff = !store.isCameraOff;
    toggleCamera(this.localStream, !nextCameraOff);
    store.setCameraOff(nextCameraOff);
  };

  switchCamera = async () => {
    const nextVideoTrack = await switchCamera(this.localStream);
    const sender = this.peer
      ?.getSenders?.()
      .find((candidate) => candidate.track?.kind === 'video');

    if (sender && nextVideoTrack && sender.track !== nextVideoTrack) {
      await sender.replaceTrack(nextVideoTrack);
    }
  };

  cleanupCall = () => {
    closeConnection(this.peer);
    stopLocalStream(this.localStream);
    this.peer = null;
    this.localStream = null;
    this.remoteUserId = null;
    useCallStore.getState().resetCall();
  };

  destroy = () => {
    this.cleanupCall();
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
    disconnectSocket();
  };

  createConfiguredPeer(remoteUserId) {
    return createPeer({
      localStream: this.localStream,
      iceServers: this.iceServers,
      onRemoteStream: (stream) => {
        useCallStore.getState().setRemoteStream(stream);
        useCallStore.getState().setCallStatus(CALL_STATUS.ACTIVE);
      },
      onIceCandidate: (candidate) => {
        sendIceCandidate({
          fromUserId: this.userId,
          toUserId: remoteUserId,
          candidate,
        });
      },
      onConnectionStateChange: (state) => {
        if (state === 'failed' || state === 'disconnected') {
          useCallStore.getState().setCallStatus(CALL_STATUS.CONNECTING);
        }
      },
    });
  }

  handleIncomingCall = ({ callerId, receiverId, offer }) => {
    useCallStore.getState().setIncomingCall({
      caller: callerId,
      receiver: receiverId,
      offer,
    });
  };

  handleCallAccepted = async ({ answer }) => {
    if (!this.peer) {
      return;
    }

    await acceptAnswer(this.peer, answer);
    useCallStore.getState().setCallStatus(CALL_STATUS.ACTIVE);
  };

  handleIceCandidate = async ({ candidate }) => {
    await addIceCandidate(this.peer, candidate);
  };

  handleCallRejected = () => {
    this.cleanupCall();
  };

  handleCallEnded = () => {
    this.cleanupCall();
  };

  handleCallError = ({ message }) => {
    useCallStore.getState().setError(message);
  };
}
