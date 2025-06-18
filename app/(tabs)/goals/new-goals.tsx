// This file is part of the Daily Goals app, which allows users to set and track daily goals.
// It is built using React Native and Expo, with Supabase as the backend for user authentication/
//app/(tabs)/goals/new-goal.tsx

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../../lib/supabase';

export default function NewGoalScreen() {
  const [goal, setGoal] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    // 🚫 Prevent saving empty goals
    if (!goal.trim()) {
      Alert.alert('Error', 'Goal cannot be empty.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const { error } = await supabase
      .from('daily_goals')
      .insert({ title: goal, user_id: user.id });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push('/goals' as any);
    }
  };

  // ⏪ Navigate back to the previous screen
  const handleBack = () => {
    router.push('/goals' as any);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ImageBackground
        source={require('../../../assets/images/velvet.jpg')}
        style={styles.background}
        resizeMode='cover'
      >
        <View style={styles.container}>
          {/* Enhanced Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleEmoji}>✨</Text>
              <Text style={styles.title}>New Goal</Text>
            </View>
            <Text style={styles.subtitle}>Describe your goal for today</Text>
          </View>

          {/* Content Section */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {/* Input Container */}
            <View style={styles.inputContainer}>
              <TextInput
                value={goal}
                onChangeText={setGoal}
                placeholder='Type your goal here...'
                placeholderTextColor='rgba(255, 255, 255, 0.7)'
                style={styles.input}
                multiline
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>💾 Save Goal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: '#6a66a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d1b69',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(106, 102, 163, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6a4c93',
    textAlign: 'center',
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#6a66a3',
    borderRadius: 16,
    padding: 20,
    minHeight: 160,
    marginBottom: 30,
    shadowColor: '#6a66a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    alignSelf: 'stretch',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 15,
    alignSelf: 'stretch',
  },
  saveButton: {
    backgroundColor: '#6a66a3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#6a66a3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: '#b5838d',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#b5838d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
