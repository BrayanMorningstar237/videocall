export async function startLocalStream(constraints = {}) {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      facingMode: 'user',
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
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

export async function switchCamera(stream) {
  const [currentVideoTrack] = stream?.getVideoTracks?.() ?? [];
  const currentFacingMode = currentVideoTrack?.getSettings?.().facingMode;
  const nextFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
  const nextStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: nextFacingMode },
  });
  const [nextVideoTrack] = nextStream.getVideoTracks();

  if (currentVideoTrack && nextVideoTrack) {
    stream.removeTrack(currentVideoTrack);
    currentVideoTrack.stop();
    stream.addTrack(nextVideoTrack);
  }

  return nextVideoTrack;
}
