import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export function IncomingCallModal({ visible, caller, onAccept, onReject }) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <Text style={styles.title}>Incoming call</Text>
          <Text style={styles.subtitle}>{caller}</Text>
          <View style={styles.actions}>
            <Pressable onPress={onReject} style={[styles.button, styles.reject]}>
              <Text style={styles.buttonText}>Reject</Text>
            </Pressable>
            <Pressable onPress={onAccept} style={[styles.button, styles.accept]}>
              <Text style={styles.buttonText}>Accept</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    width: '100%',
  },
  title: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4b5563',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  accept: {
    backgroundColor: '#047857',
  },
  reject: {
    backgroundColor: '#b91c1c',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
