// app/(tabs)/journal/index.tsx
// Journal Screen for displaying user's personal journal entries

import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../../lib/supabase';

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
          {/* Header */}
          <View style={styles.textBgWrapper}>
            <View style={styles.textBgContent}>
              <Text style={styles.title}>My Journal</Text>
            </View>
          </View>

          {/* List of entries */}
          <FlatList
            data={entries}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer with navigation buttons */}
          <View style={styles.footerBox}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(main)/wellmind')}
            >
              <Text style={styles.footerButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(tabs)/journal/new-entry')}
            >
              <Text style={styles.footerButtonText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  textBgWrapper: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 120,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  entryBox: {
    backgroundColor: '#f2e9f4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6a4c93',
    marginBottom: 4,
  },
  entryText: {
    fontSize: 16,
    color: '#333',
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
    fontSize: 16,
  },
});
