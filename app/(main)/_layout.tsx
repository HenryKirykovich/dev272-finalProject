import { useFocusEffect } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MainLayout() {
  const router = useRouter();
  const [fullName, setFullName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
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
      setUserId(user.id);

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

  // Subscribe to real-time changes for this user's profile so the header updates immediately
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`,
        },
        payload => {
          const newName = (payload.new as any)?.full_name;
          if (newName && newName.trim() !== '') {
            setFullName(newName);
          } else {
            setFullName(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Refresh the full name every time the (main) stack regains focus
  useFocusEffect(
    useCallback(() => {
      const refreshName = async () => {
        if (!userId) return;
        const { data, error } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', userId)
          .single();
        if (!error && data && data.full_name && data.full_name.trim() !== '') {
          setFullName(data.full_name);
        }
      };
      refreshName();
    }, [userId])
  );

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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 14,
            }}
          >
            {fullName && (
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  marginRight: 8,
                }}
              >
                {fullName}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/profile-form')}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: '#6a66a3',
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Profile</Text>
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
}
