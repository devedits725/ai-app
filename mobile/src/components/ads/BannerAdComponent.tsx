import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAds } from '@/contexts/AdsContext';
import { Platform } from 'react-native';

// Import native ads only on native platforms
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;
let AdEventType: any = null;

if (Platform.select({ web: true, default: false }) === false) {
  const adsModule = require('react-native-google-mobile-ads');
  BannerAd = adsModule.BannerAd;
  BannerAdSize = adsModule.BannerAdSize;
  TestIds = adsModule.TestIds;
  AdEventType = adsModule.AdEventType;
}

const { width: screenWidth } = Dimensions.get('window');

// Ad Unit IDs - Replace with your actual AdMob ad unit IDs
const AD_UNIT_ID = Platform.select({
  web: null, // No ads on web
  ios: __DEV__
    ? TestIds?.BANNER // Test ad for development
    : 'ca-app-pub-xxxxxxxxxxxxxxxxx/zzzzzzzzzz', // Replace with your iOS banner ad unit ID
  android: __DEV__
    ? TestIds?.BANNER // Test ad for development
    : 'ca-app-pub-xxxxxxxxxxxxxxxxx/yyyyyyyyyy', // Replace with your Android banner ad unit ID
});

export default function BannerAdComponent() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { adsDisabled } = useAds();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  if (adsDisabled || Platform.OS === 'web') return null;

  const handleAdLoaded = () => {
    setAdLoaded(true);
    setAdError(false);
  };

  const handleAdFailedToLoad = (error: Error) => {
    console.log('Banner ad failed to load:', error);
    setAdError(true);
    setAdLoaded(false);
  };

  // On web, show placeholder
  if (Platform.select({ web: true, default: false })) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.muted,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 8) + 64,
        },
      ]}
    >
      {!adLoaded && !adError && (
        <View style={styles.placeholder}>
          <View style={[styles.skeleton, { backgroundColor: colors.border }]} />
        </View>
      )}
      
      {adError && (
        <View style={styles.placeholder}>
          <View style={[styles.errorPlaceholder, { backgroundColor: colors.card }]} />
        </View>
      )}
      
      {BannerAd && (
        <BannerAd
          unitId={AD_UNIT_ID}
          size={BannerAdSize?.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
          onAdOpened={() => console.log('Banner ad opened')}
          onAdClosed={() => console.log('Banner ad closed')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeleton: {
    width: 320,
    height: 50,
    borderRadius: 4,
    opacity: 0.3,
  },
  errorPlaceholder: {
    width: 320,
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerAd: {
    width: 320,
    height: 50,
  },
});
