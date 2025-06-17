// app/index.tsx
// This is the entry point of the app. It redirects the user based on authentication status.

import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Index() {
  // Track login state: null = loading, true/false = determined
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if a user is currently authenticated with Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user); // Set true if user exists, false otherwise
    });
  }, []);

  // Wait until login status is determined
  if (isLoggedIn === null) return null;

  // Redirect based on login status:
  // - If logged in, go to main app screen
  // - If not, go to login screen
  return <Redirect href={isLoggedIn ? '/(main)/wellmind' : '/(auth)/login'} />;
}
