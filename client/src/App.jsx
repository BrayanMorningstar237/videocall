import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { CALL_STATUS } from '@rtc-engine/shared';
import { useCall } from './hooks/useCall';
import { CallScreen } from './screens/CallScreen';
import { HomeScreen } from './screens/HomeScreen';
import { IncomingCallModal } from './components/IncomingCallModal';

const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';

export default function App() {
  const [userId, setUserId] = useState('user-a');
  const [receiverId, setReceiverId] = useState('user-b');

  const call = useCall({
    socketUrl,
    userId,
  });

  const inCall = [
    CALL_STATUS.CONNECTING,
    CALL_STATUS.RINGING,
    CALL_STATUS.ACTIVE,
  ].includes(call.callStatus);

  return (
    <SafeAreaView style={styles.root}>
      {inCall ? (
        <CallScreen call={call} />
      ) : (
        <HomeScreen
          callStatus={call.callStatus}
          error={call.error}
          receiverId={receiverId}
          setReceiverId={setReceiverId}
          setUserId={setUserId}
          startCall={() => call.startCall?.({ receiverId })}
          userId={userId}
        />
      )}

      <IncomingCallModal
        caller={call.caller}
        onAccept={call.answerCall}
        onReject={call.rejectCall}
        visible={call.callStatus === CALL_STATUS.INCOMING}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#0f172a',
    flex: 1,
  },
});
