import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleGoalPress = () => {
    router.push('/goals');
  };

  const handleMoodSelect = (mood: string) => {
    console.log(`Selected mood: ${mood}`);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/velvet.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.textBgWrapper}>
            <ImageBackground
              source={require('../../assets/images/velvet3.png')}
              style={StyleSheet.absoluteFillObject}
              imageStyle={{ opacity: 0.5, borderRadius: 16 }}
              resizeMode="cover"
            />
            <View style={styles.textBgContent}>
              <Text style={styles.title}>WellMind</Text>
              <Text style={styles.subtitle}>Daily Wellness</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.goalButton} onPress={handleGoalPress}>
            <Text style={styles.goalButtonText}>Set some daily goals.</Text>
          </TouchableOpacity>

          <Text style={styles.prompt}>How are you feeling today?</Text>

          <View style={styles.emojiRow}>
            <TouchableOpacity onPress={() => handleMoodSelect('neutral')}>
              <Text style={styles.emoji}>😐</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoodSelect('happy')}>
              <Text style={styles.emoji}>🙂</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoodSelect('upset')}>
              <Text style={styles.emoji}>😔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 18,
    margin: 20,
    padding: 24,
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
    color: '#000', // changed from #c9a6c4 to black
  },
  subtitle: {
    fontSize: 18,
    color: '#a18fa4',
  },
  goalButton: {
    backgroundColor: '#6a66a3',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginBottom: 30,
  },
  goalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  prompt: {
    fontSize: 18,
    color: '#000',
    marginBottom: 12,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginTop: 8,
  },
  emoji: {
    fontSize: 36,
    marginHorizontal: 12,
  },
});
