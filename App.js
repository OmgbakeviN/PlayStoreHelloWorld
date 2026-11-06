import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [pressCount, setPressCount] = useState(0);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F6FF" />
      <View style={styles.header}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>EXPO + REACT NATIVE</Text>
        </View>
        <Text style={styles.heading}>Hello, World! 👋</Text>
        <Text style={styles.subtitle}>
          Your first Android application for the Google Play Store.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardEmoji}>🚀</Text>
        <Text style={styles.cardTitle}>It works!</Text>
        <Text style={styles.cardBody}>
          This simple application was created for a mobile publishing masterclass.
        </Text>
        <Pressable
          onPress={() => setPressCount((previous) => previous + 1)}
          accessibilityRole="button"
          accessibilityLabel="Tap the demo button"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Tap me</Text>
        </Pressable>
        <Text style={styles.counter}>
          {pressCount === 0
            ? 'Try the button to test the application.'
            : `Button pressed ${pressCount} ${pressCount === 1 ? 'time' : 'times'}.`}
        </Text>
      </View>

      <Text style={styles.footer}>GOOGLE PLAY PUBLISHING MASTERCLASS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F6FF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 82,
    paddingBottom: 42,
  },
  header: { alignItems: 'center' },
  tag: {
    backgroundColor: '#E0E9FF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 30,
  },
  tagText: { color: '#2455B7', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  heading: { color: '#132B59', fontSize: 39, fontWeight: '800', textAlign: 'center' },
  subtitle: {
    color: '#566989',
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 15,
    maxWidth: 320,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 26,
    alignItems: 'center',
    shadowColor: '#12234A',
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  cardEmoji: { fontSize: 45, marginBottom: 10 },
  cardTitle: { color: '#132B59', fontSize: 25, fontWeight: '800' },
  cardBody: {
    color: '#667792',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2459D3',
    alignSelf: 'stretch',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonPressed: { backgroundColor: '#173D9D' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  counter: { color: '#6F7D95', fontSize: 12, marginTop: 18, textAlign: 'center' },
  footer: {
    color: '#8190AC',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    textAlign: 'center',
  },
});
