import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MainLayout() {
  const router = useRouter();
  const [fullName, setFullName] = useState<string | null>(null);
  // Track authentication state: null = loading, true = logged in, false = not logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // Check current authentication status
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If no user is found, redirect to login page
      if (!user) {
        setIsLoggedIn(false);
        router.replace('/(auth)/login');
        return;
      }

      // User is logged in
      setIsLoggedIn(true);

      // Fetch the user's full name for header display
      const { data, error } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (!error && data && data.full_name && data.full_name.trim() !== '') {
        setFullName(data.full_name);
      } else {
        setFullName(null);
      }
    };

    checkAuthAndFetch();

    // Listen for auth state changes (e.g., sign-out from another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/(auth)/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // While auth state is loading, render nothing
  if (isLoggedIn === null) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#222' },
        headerTintColor: '#fff',
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity
            onPress={async () => {
              await supabase.auth.signOut();
              router.replace('/(auth)/login');
            }}
            style={{
              marginLeft: 14,
              paddingVertical: 6,
              paddingHorizontal: 12,
              backgroundColor: '#6a66a3',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/(auth)/profile-form')}
            style={{
              marginRight: 14,
              paddingVertical: 6,
              paddingHorizontal: 12,
              backgroundColor: '#6a66a3',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {fullName ? fullName : 'Profile'}
            </Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
}
