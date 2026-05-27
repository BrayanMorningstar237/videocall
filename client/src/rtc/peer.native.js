import {
  mediaDevices,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';

const DEFAULT_ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
];

export function createPeer({
  localStream,
  onRemoteStream,
  onIceCandidate,
  onConnectionStateChange,
  iceServers = DEFAULT_ICE_SERVERS,
} = {}) {
  const peer = new RTCPeerConnection({ iceServers });

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });
  }

  peer.ontrack = (event) => {
    const [remoteStream] = event.streams;
    if (remoteStream) {
      onRemoteStream?.(remoteStream);
    }
  };

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate?.(event.candidate);
    }
  };

  peer.onconnectionstatechange = () => {
    onConnectionStateChange?.(peer.connectionState);
  };

  return peer;
}

export async function createOffer(peer) {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  return offer;
}

export async function createAnswer(peer, offer) {
  await peer.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  return answer;
}

export async function acceptAnswer(peer, answer) {
  await peer.setRemoteDescription(new RTCSessionDescription(answer));
}

export async function addIceCandidate(peer, candidate) {
  if (!peer || !candidate) {
    return;
  }

  await peer.addIceCandidate(new RTCIceCandidate(candidate));
}

export function closeConnection(peer) {
  if (!peer) {
    return;
  }

  peer.getSenders?.().forEach((sender) => {
    peer.removeTrack?.(sender);
  });

  peer.close();
}

export { mediaDevices };
