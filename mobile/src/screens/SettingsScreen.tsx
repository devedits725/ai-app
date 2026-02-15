import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Linking } from 'react-native';
import PageHeader from '@/components/layout/PageHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { useAds } from '@/contexts/AdsContext';
import { toast } from '@/lib/toast';

function SettingRow({
  icon,
  label,
  onPress,
  badge,
  colors,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  badge?: string;
  colors: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.9}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      {badge && (
        <View style={[styles.badge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const { adsDisabled, adsDisabledUntil, disableAdsForDays, enableAds } = useAds();

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'AI Student Pocket Toolkit',
        message: 'Check out this awesome study app!',
        url: 'https://studenttoolkit.app',
      });
    } catch {
      toast.info('Share not supported on this device');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="Settings" />
      <View style={styles.list}>
        <SettingRow
          icon={theme === 'dark' ? '☀️' : '🌙'}
          label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          onPress={toggleTheme}
          colors={colors}
        />
        <SettingRow
          icon="📤"
          label="Share App"
          onPress={handleShare}
          colors={colors}
        />
        <SettingRow
          icon="⭐"
          label="Rate App"
          onPress={() => toast.info('Rating coming soon!')}
          colors={colors}
        />
        <SettingRow
          icon="✉️"
          label="Send Feedback"
          onPress={() =>
            Linking.openURL(
              'mailto:feedback@studenttoolkit.app?subject=App%20Feedback'
            )
          }
          colors={colors}
        />
        {adsDisabled && adsDisabledUntil ? (
          <SettingRow
            icon="✅"
            label={`Ads off until ${new Date(adsDisabledUntil).toLocaleDateString()}`}
            onPress={async () => {
              await enableAds();
              toast.success('Ads re-enabled');
            }}
            badge="Tap to re-enable"
            colors={colors}
          />
        ) : (
          <SettingRow
            icon="🔇"
            label="Disable ads for 7 days"
            onPress={async () => {
              await disableAdsForDays(7);
              toast.success('Ads disabled for 7 days');
            }}
            colors={colors}
          />
        )}
      </View>
      <Text
        style={[
          styles.footer,
          { color: colors.mutedForeground },
        ]}
      >
        AI Student Pocket Toolkit v1.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  rowIcon: { fontSize: 20 },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '500', textAlign: 'left' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: { fontSize: 10 },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 32,
  },
});
