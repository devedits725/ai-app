import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const hasConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Real client when env is set; otherwise a no-op so the app loads and AI shows a friendly error. */
export const supabase: SupabaseClient<Database> = hasConfig
  ? createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        storage: AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : ({
      functions: {
        invoke: () =>
          Promise.resolve({
            data: null,
            error: { message: 'Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.' },
          }),
      },
    } as unknown as SupabaseClient<Database>);
