import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAds } from '@/contexts/AdsContext';
import { addBonusUses } from '@/services/aiService';

interface Props {
  show: boolean;
  onReward: () => void;
  onClose: () => void;
}

export default function RewardedAdPlaceholder({ show, onReward, onClose }: Props) {
  const { colors } = useTheme();
  const { adsDisabled } = useAds();

  const handleWatchAd = async () => {
    await addBonusUses(10);
    onReward();
    onClose();
  };

  useEffect(() => {
    if (show && adsDisabled) {
      handleWatchAd();
    }
  }, [show, adsDisabled]);

  if (!show) return null;
  if (adsDisabled) return null;

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
          <TouchableOpacity
            onPress={handleWatchAd}
            style={[styles.primaryBtn, { backgroundColor: (colors as any).primary }]}
            activeOpacity={0.9}
          >
            <Text style={[styles.primaryBtnText, { color: (colors as any).primaryForeground }]}>
              Watch Ad & Get 10 Uses
            </Text>
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
