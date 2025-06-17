// NotFoundScreen.tsx
// This screen is shown when a user navigates to a route that does not exist.

import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      {/* Configure the screen title in the navigation stack */}
      <Stack.Screen options={{ title: 'Oops!' }} />

      {/* Main content of the 404 screen */}
      <ThemedView style={styles.container}>
        <ThemedText type='title'>This screen does not exist.</ThemedText>

        {/* Link to return the user to the home screen */}
        <Link href='/' style={styles.link}>
          <ThemedText type='link'>Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

// Styles for the NotFound screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
