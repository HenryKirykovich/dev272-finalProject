// ✅ Updated navigation and login/logout/profile logic

import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { supabase } from '..//../lib/supabase';
import { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export default function RootLayout() {
  const [fullName, setFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      const { data } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (data) setFullName(data.full_name || '');
    };
    fetchProfile();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerLeft: () =>
          isLoggedIn ? (
            <TouchableOpacity
              onPress={async () => {
                await supabase.auth.signOut();
                setIsLoggedIn(false);
                router.replace('/(auth)/login');
              }}
              style={{ marginLeft: 14 }}
            >
              <Text style={{ color: 'white' }}>Logout</Text>
            </TouchableOpacity>
          ) : null,
        headerRight: () =>
          isLoggedIn ? (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/profile-form')}
              style={{ marginRight: 14 }}
            >
              <Text style={{ color: 'white' }}>Profile {fullName}</Text>
            </TouchableOpacity>
          ) : null,
        headerStyle: { backgroundColor: '#222' },
        headerTintColor: '#fff',
      }}
    />
  );
}
