import { RTCView } from 'react-native-webrtc';

export function LocalVideo({ stream, style }) {
  if (!stream) {
    return null;
  }

  return (
    <RTCView
      mirror
      objectFit="cover"
      streamURL={stream.toURL()}
      style={style}
    />
  );
}
