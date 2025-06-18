import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#2d1b69',
        headerShown: false, // Hide header completely to avoid any background issues
      }}
    >
      <Stack.Screen
        name='login'
        options={{ title: 'Login', headerLeft: () => null }}
      />
      <Stack.Screen
        name='register'
        options={{ title: 'Register', headerLeft: () => null }}
      />
      <Stack.Screen name='profile-form' options={{ title: 'My Profile' }} />
    </Stack>
  );
}
