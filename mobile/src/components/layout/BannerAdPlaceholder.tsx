import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAds } from '@/contexts/AdsContext';

export default function BannerAdPlaceholder() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { adsDisabled } = useAds();

  if (adsDisabled) return null;

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
      <Text style={[styles.label, { color: colors.mutedForeground }]}>Advertisement</Text>
      <Text style={[styles.size, { color: colors.mutedForeground }]}>Ad Space — 320×50</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  size: {
    fontSize: 12,
  },
});
