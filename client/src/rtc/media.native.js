import { mediaDevices } from 'react-native-webrtc';

export async function startLocalStream(constraints = {}) {
  return mediaDevices.getUserMedia({
    audio: true,
    video: {
      facingMode: 'user',
      width: 1280,
      height: 720,
      frameRate: 30,
    },
    ...constraints,
  });
}

export function stopLocalStream(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function toggleMic(stream, enabled) {
  stream?.getAudioTracks().forEach((track) => {
    track.enabled = enabled;
  });
}

export function toggleCamera(stream, enabled) {
  stream?.getVideoTracks().forEach((track) => {
    track.enabled = enabled;
  });
}

export function switchCamera(stream) {
  const [videoTrack] = stream?.getVideoTracks?.() ?? [];
  videoTrack?._switchCamera?.();
  return videoTrack;
}
