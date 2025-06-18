import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export const unstable_settings = {
  showDebugInfo: false,
};

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    // Listen to future auth state changes to keep login status accurate
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      authSub.unsubscribe();
    };
  }, []);

  // Guard: if not logged in and navigating outside login/register, redirect to login
  useEffect(() => {
    if (isLoggedIn === false) {
      const first = segments[0];
      const second = segments[1];

      // Allowed unauth routes: /(auth)/login or /(auth)/register
      const inAuthGroup = first === '(auth)';
      const isAllowedAuthScreen =
        inAuthGroup && (second === 'login' || second === 'register');

      if (!isAllowedAuthScreen) {
        router.replace('/(auth)/login');
      }
    }
    // If logged in and navigating to login or register, redirect to home
    if (isLoggedIn === true) {
      const first = segments[0];
      const second = segments[1];
      const inAuthGroup = first === '(auth)';
      const isAuthEntry = second === 'login' || second === 'register';
      if (inAuthGroup && isAuthEntry) {
        router.replace('/(tabs)/home');
      }
    }
  }, [segments, isLoggedIn]);

  if (isLoggedIn === null) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
