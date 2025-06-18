// app/(tabs)/journal/index.tsx
// Journal Screen for displaying user's personal journal entries

import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../../lib/supabase';
import { journalScreenStyles as styles } from './styles';

interface Entry {
  id: string;
  content: string;
  created_at: string;
}

export default function JournalScreen() {
  const router = useRouter();
  const { refresh } = useLocalSearchParams();
  const [entries, setEntries] = useState<Entry[]>([]);

  // 🔄 Fetch journal entries for the authenticated user
  const fetchEntries = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User not authenticated:', userError);
      return;
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id) // ✅ Filter by current user
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
    } else {
      console.error('Error fetching journal entries:', error);
    }
  };

  // 🔁 Refetch on focus or if "refresh" param is passed
  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [refresh])
  );

  // 📅 Format entry creation date and time
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    // Format date (e.g., "05 Jun")
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
    });

    // Format time (e.g., "14:23:08")
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  // 📝 Render each journal entry
  const renderItem = ({ item }: { item: Entry }) => (
    <View style={styles.entryBox}>
      <Text style={styles.entryDate}>{formatDate(item.created_at)}</Text>
      <Text style={styles.entryText}>{item.content}</Text>
    </View>
  );

  // 🧱 UI Layout
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              <Text style={styles.titleEmoji}>📖</Text>
              <Text style={styles.title}>My Journal</Text>
            </View>
          </View>

          {/* Entries Content */}
          <View
            style={[
              styles.contentSection,
              entries.length === 0 && {
                justifyContent: 'center',
                flexGrow: 1,
              },
            ]}
          >
            {entries.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyStateBox}>
                  <Text style={styles.emptyStateText}>No entries yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Tap the + button to create your first journal entry.
                  </Text>
                </View>
              </View>
            ) : (
              <FlatList
                data={entries}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* Floating plus button */}
          <TouchableOpacity
            style={styles.floatingAddButton}
            onPress={() => router.push('/(tabs)/journal/new-entry' as any)}
          >
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
