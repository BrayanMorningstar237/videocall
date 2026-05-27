import { StyleSheet, View } from 'react-native';
import { IncomingCallModal } from '../components/IncomingCallModal';

export function IncomingCallScreen({ caller, onAccept, onReject }) {
  return (
    <View style={styles.container}>
      <IncomingCallModal
        caller={caller}
        onAccept={onAccept}
        onReject={onReject}
        visible
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
