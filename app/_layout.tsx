import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
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

    registerForPushNotificationsAsync().then(token => {
      console.log('Expo push token:', token);
      // 💡 Optionally save to Supabase here
    });

    // Optional: handle notification received while app is in foreground
    const subscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification Received:', notification);
      }
    );

    return () => subscription.remove();
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
  }, [segments, isLoggedIn]);

  if (isLoggedIn === null) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isLoggedIn && (
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      )}
      {isLoggedIn && (
        <Stack.Screen name='(main)' options={{ headerShown: false }} />
      )}
      {isLoggedIn && (
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

// 📦 Helper: register device for push notifications
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push token for push notification!');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
