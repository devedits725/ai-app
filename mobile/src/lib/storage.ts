import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage wrapper to mirror web localStorage API for migration.
 * Preserves keys and usage patterns.
 */
export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};

/** Synchronous get is not available in RN; callers that need sync must use async or preload. */
export async function getItemSync(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}
