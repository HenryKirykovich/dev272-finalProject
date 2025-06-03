import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // важно для Expo (получает fetch, URL и др.)

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
