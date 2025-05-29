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
          headerLeft: () => null, // убирает стрелку назад
        }}
      />
      <Stack.Screen
        name="profile-form"
        options={{
          title: 'My Profile',
          headerLeft: undefined, // стрелка назад появится, если есть куда возвращаться
        }}
      />
    </Stack>
  );
}
