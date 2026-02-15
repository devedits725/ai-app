import { Alert } from 'react-native';

/**
 * Simple toast replacement for React Native.
 * Uses Alert for errors; for success/info we could use a toast library or in-app banner.
 */
export const toast = {
  success: (message: string) => {
    Alert.alert('Success', message);
  },
  error: (message: string) => {
    Alert.alert('Error', message);
  },
  info: (message: string) => {
    Alert.alert('Info', message);
  },
};
