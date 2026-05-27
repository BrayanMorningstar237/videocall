import { Pressable, StyleSheet, Text, View } from 'react-native';

export function CallControls({
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleVideo,
  onSwitchCamera,
  onEndCall,
}) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onToggleMute} style={styles.button}>
        <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
      </Pressable>
      <Pressable onPress={onToggleVideo} style={styles.button}>
        <Text style={styles.buttonText}>{isCameraOff ? 'Camera On' : 'Camera Off'}</Text>
      </Pressable>
      <Pressable onPress={onSwitchCamera} style={styles.button}>
        <Text style={styles.buttonText}>Switch</Text>
      </Pressable>
      <Pressable onPress={onEndCall} style={[styles.button, styles.endButton]}>
        <Text style={styles.buttonText}>End</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 6,
    minWidth: 76,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  endButton: {
    backgroundColor: '#b91c1c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
