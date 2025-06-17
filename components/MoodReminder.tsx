// components/MoodReminder.tsx
// This component schedules a local push notification reminding the user about their current mood

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Schedules a push notification based on the most recent mood entry
export async function scheduleMoodReminder() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from('mood_logs')
    .select('mood')
    .eq('user_id', user.id)
    .order('logged_at', { ascending: false })
    .limit(1)
    .single();

  if (!data?.mood) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'WellMind Mood Reminder',
      body: `You are still feeling ${data.mood}. Take a moment to reflect.`,
    },
    trigger: { seconds: 15 }, // Adjust this to schedule daily, if needed
  });
}

// React component that initializes push notification setup and scheduling
export default function MoodReminder() {
  useEffect(() => {
    const init = async () => {
      // Android-specific notification channel setup
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      // Schedule notification
      await scheduleMoodReminder();
    };

    init();
  }, []);

  return null;
}
