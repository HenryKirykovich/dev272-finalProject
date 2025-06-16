// components/MoodReminder.tsx
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

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
      title: 'WellMind Check-In 💭',
      body: `You're still feeling ${data.mood}? Take a moment to reflect.`,
    },
    trigger: { seconds: 15 }, // или daily время ниже
  });
}

export default function MoodReminder() {
  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      await scheduleMoodReminder(); // 👈 запускаем уведомление
    };

    init();
  }, []);

  return null;
}
