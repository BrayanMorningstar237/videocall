import { RTCView } from 'react-native-webrtc';

export function RemoteVideo({ stream, style }) {
  if (!stream) {
    return null;
  }

  return (
    <RTCView
      objectFit="cover"
      streamURL={stream.toURL()}
      style={style}
    />
  );
}
