import { useEffect, useMemo } from 'react';
import { CallManager } from '../rtc/callManager';
import { useCallStore } from '../store/callStore';

export function useCall(config) {
  const callState = useCallStore();

  const manager = useMemo(() => {
    if (!config?.socketUrl || !config?.userId) {
      return null;
    }

    return new CallManager(config);
  }, [config?.socketUrl, config?.userId, config?.token, config?.iceServers]);

  useEffect(() => {
    if (!manager) {
      return undefined;
    }

    manager.initialize();
    return () => manager.destroy();
  }, [manager]);

  return {
    ...callState,
    startCall: manager?.startCall,
    answerCall: manager?.answerCall,
    rejectCall: manager?.rejectCall,
    endCall: manager?.endCall,
    toggleMute: manager?.toggleMute,
    toggleVideo: manager?.toggleVideo,
    switchCamera: manager?.switchCamera,
  };
}
