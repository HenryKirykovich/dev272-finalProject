// This file is part of the Journal App, a React Native application for journaling.
//app/(tabs)/journal/new-entry.tsx

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
import { newEntryStyles as styles } from './styles';

export default function NewEntryScreen() {
  const [text, setText] = useState('');
  const router = useRouter();
  const { backgroundColor } = useBackgroundColor();

  const handleSave = async () => {
    // 🚫 Prevent saving empty entries
    if (!text.trim()) {
      Alert.alert('Error', 'Journal entry cannot be empty.');
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
      .from('journal_entries')
      .insert({ content: text, user_id: user.id });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.push('/journal' as any);
    }
  };

  // ⏪ Navigate back to the previous screen
  const handleBack = () => {
    router.push('/journal' as any);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0} //adjecting GAP between keyboard and typing text
    >
      <View style={[styles.container, { backgroundColor }]}>
        {/* Enhanced Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleEmoji}>✍️</Text>
            <Text style={styles.title}>New Entry</Text>
          </View>
          <Text style={styles.subtitle}>What&apos;s on your mind?</Text>
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
              value={text}
              onChangeText={setText}
              placeholder='Type your thoughts here...'
              placeholderTextColor='rgba(255, 255, 255, 0.7)'
              style={styles.input}
              multiline
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>💾 Save Entry</Text>
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
