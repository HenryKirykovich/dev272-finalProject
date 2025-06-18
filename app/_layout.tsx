import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../lib/supabase';

// --- Start of BackgroundColor Context ---
type BackgroundColorContextType = {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
};

const BackgroundColorContext = createContext<
  BackgroundColorContextType | undefined
>(undefined);

const BackgroundColorProvider = ({ children }: { children: ReactNode }) => {
  const [backgroundColor, setBackgroundColor] = useState('#00FF00'); // Bright green for testing

  useEffect(() => {
    const loadBackgroundColor = async () => {
      // Temporarily disable loading from storage for testing
      // const storedColor = await AsyncStorage.getItem('backgroundColor');
      // if (storedColor) {
      //   setBackgroundColor(storedColor);
      // }
    };
    loadBackgroundColor();
  }, []);

  const handleSetBackgroundColor = (color: string) => {
    console.log('Setting background color to:', color);
    setBackgroundColor(color);
    AsyncStorage.setItem('backgroundColor', color);
  };

  return (
    <BackgroundColorContext.Provider
      value={{ backgroundColor, setBackgroundColor: handleSetBackgroundColor }}
    >
      {children}
    </BackgroundColorContext.Provider>
  );
};

export const useBackgroundColor = () => {
  const context = useContext(BackgroundColorContext);
  if (context === undefined) {
    throw new Error(
      'useBackgroundColor must be used within a BackgroundColorProvider'
    );
  }
  return context;
};
// --- End of BackgroundColor Context ---

export const unstable_settings = {
  showDebugInfo: false,
};

function RootLayoutNav() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const { backgroundColor } = useBackgroundColor();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      authSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      const first = segments[0];
      const second = segments[1];

      const inAuthGroup = first === '(auth)';
      const isAllowedAuthScreen =
        inAuthGroup && (second === 'login' || second === 'register');

      if (!isAllowedAuthScreen) {
        router.replace('/(auth)/login');
      }
    }
    if (isLoggedIn === true) {
      const first = segments[0];
      const second = segments[1];
      const inAuthGroup = first === '(auth)';
      const isAuthEntry = second === 'login' || second === 'register';
      if (inAuthGroup && isAuthEntry) {
        router.replace('/(tabs)/home');
      }
    }
  }, [segments, isLoggedIn]);

  if (isLoggedIn === null) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        )}
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <BackgroundColorProvider>
      <RootLayoutNav />
    </BackgroundColorProvider>
  );
}
