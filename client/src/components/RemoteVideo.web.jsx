import { useEffect, useRef } from 'react';

export function RemoteVideo({ stream, style }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return (
    <video
      autoPlay
      playsInline
      ref={videoRef}
      style={{ ...style, objectFit: 'contain' }}
    />
  );
}
