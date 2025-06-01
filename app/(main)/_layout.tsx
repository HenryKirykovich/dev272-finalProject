import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function MainLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#222' },
        headerTintColor: '#fff',
        headerTitle: '', // 👈 Убирает название "(main)"
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
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Profile</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
}
