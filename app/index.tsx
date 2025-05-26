// app/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace('/(tabs)'); // 🔁 если авторизован — на главную часть
      } else {
        router.replace('/(auth)/login'); // 🔐 иначе — на логин
      }

      setChecking(false);
    };

    checkSession();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Checking session...</Text>
      </View>
    );
  }

  return null;
}
