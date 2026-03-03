import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAds } from '@/contexts/AdsContext';
import { addBonusUses } from '@/services/aiService';
import { Platform } from 'react-native';

// Import native ads only on native platforms
let RewardedAd: any = null;
let RewardedAdEventType: any = null;
let TestIds: any = null;
let AdEventType: any = null;

if (Platform.select({ web: true, default: false }) === false) {
  const adsModule = require('react-native-google-mobile-ads');
  RewardedAd = adsModule.RewardedAd;
  RewardedAdEventType = adsModule.RewardedAdEventType;
  TestIds = adsModule.TestIds;
  AdEventType = adsModule.AdEventType;
}

// Ad Unit IDs - Replace with your actual AdMob ad unit IDs
const AD_UNIT_ID = Platform.select({
  web: null, // No ads on web
  ios: __DEV__
    ? TestIds?.REWARDED // Test ad for development
    : 'ca-app-pub-3790518214135102/4052895539', // Replace with your iOS rewarded ad unit ID
  android: __DEV__
    ? TestIds?.REWARDED // Test ad for development
    : 'ca-app-pub-3790518214135102/8351233199', // Replace with your Android rewarded ad unit ID
});

interface Props {
  show: boolean;
  onClose: () => void;
  onReward: () => void;
}

export default function RewardedAdComponent({ show, onClose, onReward }: Props) {
  const { colors } = useTheme();
  const { adsDisabled } = useAds();
  const [adLoaded, setAdLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewardedAd = RewardedAd?.createForAdRequest?.(AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    if (!rewardedAd || Platform.select({ web: true, default: false })) return;

    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdLoaded(true);
      setError(null);
    });

    const unsubscribeFailed = rewardedAd.addAdEventListener(AdEventType.ERROR, (error: Error) => {
      console.log('Rewarded ad failed to load:', error);
      setError('Failed to load ad. Please try again.');
      setAdLoaded(false);
    });

    const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward:', reward);
      handleReward();
    });

    const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      onClose();
    });

    // Load the ad
    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeFailed();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, []);

  useEffect(() => {
    if (show && adsDisabled) {
      handleReward();
      onClose();
    }
  }, [show, adsDisabled]);

  const handleWatchAd = async () => {
    if (!adLoaded || !rewardedAd) return;
    
    setLoading(true);
    try {
      await rewardedAd.show();
    } catch (error) {
      console.log('Error showing rewarded ad:', error);
      setError('Failed to show ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReward = async () => {
    console.log('Adding 10 bonus uses...');
    await addBonusUses(10);
    console.log('Bonus uses added successfully');
    onReward();
    onClose();
  };

  if (!show) return null;
  if (adsDisabled || Platform.select({ web: true, default: false })) return null;

  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: (colors as any).primaryLight || (colors as any).primary }]}>
            <Text style={styles.icon}>🎁</Text>
          </View>
          <Text style={[styles.adLabel, { color: colors.mutedForeground }]}>Rewarded Ad</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            Watch a short ad to get 10 more AI uses
          </Text>
          
          {error && (
            <Text style={[styles.errorText, { color: (colors as any).destructive }]}>
              {error}
            </Text>
          )}
          
          <TouchableOpacity
            onPress={handleWatchAd}
            disabled={!adLoaded || loading}
            style={[
              styles.primaryBtn,
              { 
                backgroundColor: (colors as any).primary,
                opacity: (!adLoaded || loading) ? 0.5 : 1,
              },
            ]}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color={(colors as any).primaryForeground} size="small" />
            ) : (
              <Text style={[styles.primaryBtnText, { color: (colors as any).primaryForeground }]}>
                {adLoaded ? 'Watch Ad & Get 10 Uses' : 'Loading Ad...'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
            <Text style={[styles.cancel, { color: colors.mutedForeground }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  adLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cancel: {
    fontSize: 12,
  },
});
