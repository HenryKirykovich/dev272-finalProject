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
        options={{
          title: 'Login',
          headerLeft: () => null, // killed the back button
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
          
        }}
      />
      <Stack.Screen
        name="profile-form"
        options={{
          title: 'My Profile',
          // still no back button
        }}
      />
    </Stack>
  );
}
