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
      style={{
        backgroundColor: '#020617',
        display: 'block',
        height: '100%',
        objectFit: 'contain',
        width: '100%',
        ...style,
      }}
    />
  );
}
