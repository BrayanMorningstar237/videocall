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
    this.userId = userId?.trim();
    this.token = token;
    this.iceServers = iceServers;
    this.peer = null;
    this.localStream = null;
    this.remoteUserId = null;
    this.pendingIceCandidates = [];
    this.unsubscribers = [];
  }

  initialize() {
    const socket = connectSocket({
      socketUrl: this.socketUrl,
      userId: this.userId,
      token: this.token,
    });

    const registerCurrentUser = () => {
      console.log('rtc socket registered', {
        socketId: socket.id,
        userId: this.userId,
      });
      emitEvent(CALL_EVENTS.REGISTER_USER, { userId: this.userId });
    };

    socket.on('connect', registerCurrentUser);

    if (socket.connected) {
      registerCurrentUser();
    }

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
      let store = useCallStore.getState();
      const normalizedReceiverId = receiverId?.trim();

      if (store.callStatus === CALL_STATUS.ERROR) {
        this.cleanupCall();
        store = useCallStore.getState();
      }

      if (!normalizedReceiverId || normalizedReceiverId === this.userId) {
        store.setError('Choose a different receiver user ID.');
        return;
      }

      if (store.callStatus !== CALL_STATUS.IDLE) {
        console.log('rtc startCall ignored: call already in progress', store.callStatus);
        return;
      }

      this.remoteUserId = normalizedReceiverId;
      store.setCallStatus(CALL_STATUS.CONNECTING);
      store.setParticipants({ caller: this.userId, receiver: normalizedReceiverId });

      this.localStream = await startLocalStream();
      store.setLocalStream(this.localStream);

      this.peer = this.createConfiguredPeer(normalizedReceiverId);
      const offer = await createOffer(this.peer);
      console.log('rtc offer created', { from: this.userId, to: normalizedReceiverId });

      emitCallUser({
        callerId: this.userId,
        receiverId: normalizedReceiverId,
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

      if (!caller || !incomingOffer) {
        return;
      }

      this.remoteUserId = caller;
      store.setCallStatus(CALL_STATUS.CONNECTING);

      this.localStream = await startLocalStream();
      store.setLocalStream(this.localStream);

      this.peer = this.createConfiguredPeer(caller);
      const answer = await createAnswer(this.peer, incomingOffer);
      await this.flushPendingIceCandidates();
      console.log('rtc answer created', { from: this.userId, to: caller });

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
    this.pendingIceCandidates = [];
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
        console.log('rtc remote stream received', {
          audioTracks: stream?.getAudioTracks?.().length ?? 0,
          videoTracks: stream?.getVideoTracks?.().length ?? 0,
        });
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
        console.log('rtc peer connection state', state);
        if (state === 'failed' || state === 'disconnected') {
          useCallStore.getState().setCallStatus(CALL_STATUS.CONNECTING);
        }
      },
    });
  }

  handleIncomingCall = ({ callerId, receiverId, offer }) => {
    let { callStatus } = useCallStore.getState();

    if (callStatus === CALL_STATUS.ERROR) {
      this.cleanupCall();
      callStatus = useCallStore.getState().callStatus;
    }

    if (callStatus !== CALL_STATUS.IDLE) {
      console.log('rtc incoming call rejected: already busy', {
        callerId,
        callStatus,
      });
      emitRejectCall({
        callerId,
        receiverId: this.userId,
      });
      return;
    }

    console.log('rtc incoming call', { from: callerId, to: receiverId });
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
    await this.flushPendingIceCandidates();
    console.log('rtc call accepted');
    useCallStore.getState().setCallStatus(CALL_STATUS.ACTIVE);
  };

  handleIceCandidate = async ({ candidate }) => {
    if (!candidate) {
      return;
    }

    if (!this.peer || !this.peer.remoteDescription) {
      this.pendingIceCandidates.push(candidate);
      console.log('rtc ice candidate queued', this.pendingIceCandidates.length);
      return;
    }

    await addIceCandidate(this.peer, candidate);
  };

  flushPendingIceCandidates = async () => {
    if (!this.peer || !this.pendingIceCandidates.length) {
      return;
    }

    const candidates = [...this.pendingIceCandidates];
    this.pendingIceCandidates = [];

    await Promise.all(candidates.map((candidate) => addIceCandidate(this.peer, candidate)));
    console.log('rtc ice candidates flushed', candidates.length);
  };

  handleCallRejected = () => {
    this.cleanupCall();
  };

  handleCallEnded = () => {
    this.cleanupCall();
  };

  handleCallError = ({ message }) => {
    console.log('rtc call error', message);
    this.cleanupCall();
    useCallStore.getState().setError(message);
  };
}
