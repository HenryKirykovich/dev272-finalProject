// app/index.tsx
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  if (isLoggedIn === null) return null;

  return <Redirect href={isLoggedIn ? '/(main)/wellmind' : '/(auth)/login'} />;
}
