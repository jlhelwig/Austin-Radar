import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

/**
 * Supabase Client Initialization
 * 
 * Uses environment variables from expo-constants (extra) or process.env.
 * Falls back to a no-op mock client in DEV when credentials are absent.
 */

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
} else {
  console.warn('[Supabase] URL or Anon Key missing — using offline-only mode.');
  // Mock client that returns empty results, allowing seed data to load
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => ({ select: () => Promise.resolve({ data: [], error: { message: 'Offline mode' } }) }),
    }),
  };
}

export { supabase };

