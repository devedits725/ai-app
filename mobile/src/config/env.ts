/**
 * Environment config for React Native.
 * Set in app.json "extra" or .env: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
 * or VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY for parity with web.
 */
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;
const env = process.env;

export const SUPABASE_URL =
  extra?.VITE_SUPABASE_URL ??
  extra?.EXPO_PUBLIC_SUPABASE_URL ??
  env.EXPO_PUBLIC_SUPABASE_URL ??
  '';
export const SUPABASE_ANON_KEY =
  extra?.VITE_SUPABASE_PUBLISHABLE_KEY ??
  extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  '';
