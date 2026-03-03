import { MobileAds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// Initialize AdMob only on native platforms
export const initializeAds = () => {
  if (Platform.select({ web: true, default: false })) {
    console.log('AdMob disabled on web platform');
    return;
  }

  MobileAds()
    .initialize()
    .then(() => {
      console.log('AdMob initialized successfully');
    })
    .catch((error) => {
      console.error('AdMob initialization failed:', error);
    });
};
