// This file is part of the Daily Goals app, which allows users to set and track daily goals.
// It is built using React Native and Expo, with Supabase as the backend for user authentication/
//app/(tabs)/goals/new-goal.tsx

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useBackgroundColor } from '../../_layout';
import { newGoalStyles as styles } from './styles';

export default function NewGoalScreen() {
  const [goal, setGoal] = useState('');
  const router = useRouter();
  const { backgroundColor } = useBackgroundColor();

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
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { backgroundColor }]}>
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
    </KeyboardAvoidingView>
  );
}
