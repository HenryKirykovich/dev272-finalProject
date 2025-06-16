import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ActivityIndicator } from 'react-native';

// 👇 Добавь эту строку ПЕРЕД экспортом компонента
export const unstable_settings = {
  showDebugInfo: false,
};

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  if (isLoggedIn === null) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isLoggedIn && <Stack.Screen name="(auth)" options={{ headerShown: false }} />}
      {isLoggedIn && <Stack.Screen name="(main)" options={{ headerShown: false }} />}
      {isLoggedIn && <Stack.Screen name="(tabs)" options={{ headerShown: false }} />}
    </Stack>
  );
}
