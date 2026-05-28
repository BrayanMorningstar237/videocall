import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export function HomeScreen({
  callStatus,
  error,
  receiverId,
  setReceiverId,
  setUserId,
  startCall,
  userId,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>RTC Engine</Text>
      <Text style={styles.status}>Status: {callStatus}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.form}>
        <Text style={styles.label}>Your user ID</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setUserId}
          placeholder="user-a"
          style={styles.input}
          value={userId}
        />

        <Text style={styles.label}>Receiver user ID</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setReceiverId}
          placeholder="user-b"
          style={styles.input}
          value={receiverId}
        />

        <Pressable onPress={startCall} style={styles.button}>
          <Text style={styles.buttonText}>Start Call</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  heading: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
  },
  status: {
    color: '#cbd5e1',
    marginTop: 8,
  },
  error: {
    color: '#fecaca',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  form: {
    gap: 10,
    marginTop: 28,
  },
  label: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    color: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 6,
    marginTop: 10,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
