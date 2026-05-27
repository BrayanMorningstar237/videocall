import { StyleSheet, Text, View } from 'react-native';
import { CallControls } from '../components/CallControls';
import { LocalVideo } from '../components/LocalVideo';
import { RemoteVideo } from '../components/RemoteVideo';

export function CallScreen({ call }) {
  return (
    <View style={styles.container}>
      <RemoteVideo stream={call.remoteStream} style={styles.remoteVideo} />
      {!call.remoteStream && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{call.callStatus}</Text>
        </View>
      )}

      <LocalVideo stream={call.localStream} style={styles.localVideo} />

      <View style={styles.controls}>
        <CallControls
          isCameraOff={call.isCameraOff}
          isMuted={call.isMuted}
          onEndCall={call.endCall}
          onSwitchCamera={call.switchCamera}
          onToggleMute={call.toggleMute}
          onToggleVideo={call.toggleVideo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#020617',
    flex: 1,
  },
  remoteVideo: {
    flex: 1,
  },
  placeholder: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  placeholderText: {
    color: '#cbd5e1',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  localVideo: {
    backgroundColor: '#111827',
    borderRadius: 8,
    height: 172,
    position: 'absolute',
    right: 16,
    top: 16,
    width: 116,
  },
  controls: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
});
