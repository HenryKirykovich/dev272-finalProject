import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen
        name="login"
        options={{ title: 'Login', headerLeft: () => null }}
      />
      <Stack.Screen
        name="register"
        options={{ title: 'Register', headerLeft: () => null }}
      />
      <Stack.Screen
        name="profile-form"
        options={{ title: 'My Profile' }}
      />
    </Stack>
  );
}
