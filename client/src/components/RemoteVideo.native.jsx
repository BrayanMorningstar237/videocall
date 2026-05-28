import { RTCView } from 'react-native-webrtc';

export function RemoteVideo({ stream, style }) {
  if (!stream) {
    return null;
  }

  return (
    <RTCView
      objectFit="contain"
      streamURL={stream.toURL()}
      style={style}
    />
  );
}
