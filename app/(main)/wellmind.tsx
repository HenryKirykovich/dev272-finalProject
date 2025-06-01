import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function WellMindScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/images/velvet.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.textBgWrapper}>
              <ImageBackground
                source={require('../../assets/images/velvet3.png')}
                style={StyleSheet.absoluteFillObject}
                imageStyle={{ opacity: 0.5, borderRadius: 16 }}
                resizeMode="cover"
              />
              <View style={styles.textBgContent}>
                <Text style={styles.title}>WellMind</Text>
                <Text style={styles.subtitle}>Your mental wellness center</Text>
              </View>
            </View>

            {/* GOAL */}
            <View style={styles.goalBox}>
              <Text style={styles.goalText}>🎯 Today's Goal: Take 3 mindful breaths</Text>
            </View>

            {/* MOODS */}
            <Text style={styles.moodPrompt}>How are you feeling today?</Text>
            <View style={styles.emojiRow}>
              <TouchableOpacity onPress={() => setSelectedMood('😐')}>
                <Text style={styles.emoji}>😐</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedMood('🙂')}>
                <Text style={styles.emoji}>🙂</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedMood('😔')}>
                <Text style={styles.emoji}>😔</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footerBox}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(tabs)/journal')}
            >
              <Text style={styles.footerButtonText}>Journal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(tabs)/moods')}
            >
              <Text style={styles.footerButtonText}>Moods</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  textBgWrapper: {
    position: 'relative',
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'center',
    width: '100%',
  },
  textBgContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
  },
  goalBox: {
    backgroundColor: '#cdb4db',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
  },
  goalText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  moodPrompt: {
    fontSize: 18,
    marginBottom: 12,
    color: '#000',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 36,
  },
  footerBox: {
    flexDirection: 'row',
    backgroundColor: '#b5838d',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 1,
    backgroundColor: '#6a66a3',
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
