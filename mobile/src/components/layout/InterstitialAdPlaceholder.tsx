import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAds } from '@/contexts/AdsContext';

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function InterstitialAdPlaceholder({ show, onClose }: Props) {
  const { colors } = useTheme();
  const { adsDisabled } = useAds();

  useEffect(() => {
    if (show && adsDisabled) onClose();
  }, [show, adsDisabled]);

  if (!show) return null;
  if (adsDisabled) return null;

  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={[styles.iconWrap, { backgroundColor: colors.muted }]}>
            <Text style={styles.icon}>📢</Text>
          </View>
          <Text style={[styles.adLabel, { color: colors.mutedForeground }]}>Interstitial Ad</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            Full-screen ad placeholder — will show AdMob interstitial in production
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.9}
          >
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
              Continue
            </Text>
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
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
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
});
