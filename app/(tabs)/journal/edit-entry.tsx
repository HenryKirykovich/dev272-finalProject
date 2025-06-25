// app/(tabs)/journal/edit-entry.tsx
// Edit Journal Entry Screen

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../../lib/supabase';
import { editEntryStyles as styles } from '../../../styles/tabs/journal.styles';
import { useBackgroundColor } from '../../_layout';

interface Entry {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function EditEntryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { backgroundColor } = useBackgroundColor();

  // 🔄 Fetch the specific journal entry
  const fetchEntry = async () => {
    if (!id) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User not authenticated:', userError);
      router.back();
      return;
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // ✅ Ensure user can only edit their own entries
      .single();

    if (!error && data) {
      setEntry(data);
      setContent(data.content);
    } else {
      console.error('Error fetching journal entry:', error);
      Alert.alert('Error', 'Could not load journal entry.');
      router.back();
    }
  };

  useEffect(() => {
    fetchEntry();
  }, [id]);

  // 💾 Save changes to the journal entry
  const handleSave = async () => {
    if (!entry || !content.trim()) {
      Alert.alert('Error', 'Please enter some content.');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('journal_entries')
      .update({ content: content.trim() })
      .eq('id', entry.id);

    setLoading(false);

    if (!error) {
      Alert.alert('Success', 'Journal entry updated!', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/journal?refresh=true' as any),
        },
      ]);
    } else {
      console.error('Error updating journal entry:', error);
      Alert.alert('Error', 'Could not save changes.');
    }
  };

  // 🗑️ Delete the journal entry
  const handleDelete = async () => {
    if (!entry) return;

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);

            const { error } = await supabase
              .from('journal_entries')
              .delete()
              .eq('id', entry.id);

            setLoading(false);

            if (!error) {
              Alert.alert('Deleted', 'Journal entry deleted successfully.', [
                {
                  text: 'OK',
                  onPress: () =>
                    router.push('/(tabs)/journal?refresh=true' as any),
                },
              ]);
            } else {
              console.error('Error deleting journal entry:', error);
              Alert.alert('Error', 'Could not delete entry.');
            }
          },
        },
      ]
    );
  };

  // 📅 Format entry creation date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!entry) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <View style={[styles.container, { backgroundColor }]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor }]}>
          {/* Header */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>‹ Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Edit Entry</Text>
            <View style={styles.spacer} />
          </View>

          {/* Entry Date */}
          <View style={styles.dateSection}>
            <Text style={styles.entryDate}>{formatDate(entry.created_at)}</Text>
          </View>

          {/* Content Input */}
          <View style={styles.contentSection}>
            <TextInput
              style={styles.textInput}
              value={content}
              onChangeText={setContent}
              placeholder='Write your thoughts...'
              placeholderTextColor='#999'
              multiline
              textAlignVertical='top'
              autoFocus
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, loading && styles.disabledButton]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>Delete Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
