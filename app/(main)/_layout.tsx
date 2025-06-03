import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import React, { useEffect, useState } from 'react';

export default function MainLayout() {
  const router = useRouter();
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
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
    fetchFullName();
  }, []);

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