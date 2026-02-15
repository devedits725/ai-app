import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import PageHeader from '@/components/layout/PageHeader';
import BannerAdPlaceholder from '@/components/layout/BannerAdPlaceholder';
import RewardedAdPlaceholder from '@/components/layout/RewardedAdPlaceholder';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/lib/toast';
import {
  callAI,
  getRemainingUses,
  getCachedResult,
  type TextResult,
} from '@/services/aiService';

export default function AIFormulaSearchScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const setupRemaining = async () => {
      const remaining = await getRemainingUses();
      setRemaining(remaining);
    };
    setupRemaining();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const cached = await getCachedResult<TextResult>('formula', query);
    if (cached) {
      setResult(cached.text);
      return;
    }
    setShowAd(true);
  };

  const doAICall = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const data = await callAI<TextResult>('formula', query);
      setResult(data.text);
      setRemaining(await getRemainingUses());
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (result) {
      await Clipboard.setStringAsync(result);
      toast.success('Copied!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="Smart Formula Search" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text
            style={[styles.headerText, { color: colors.mutedForeground }]}
          >
            Describe what you need in plain English
          </Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: (colors as any).aiGlowLight || (colors as any).primaryLight,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: (colors as any).aiGlow || (colors as any).primary, },
              ]}
            >
              {remaining} left (watch ads for more)
            </Text>
          </View>
        </View>
        <View style={styles.inputRow}>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder='e.g. "how to find the area of a triangle"'
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading || !query.trim()}
            style={[
              styles.searchBtn,
              {
                backgroundColor: colors.primary,
                opacity: loading || !query.trim() ? 0.5 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator
                color={colors.primaryForeground}
                size="small"
              />
            ) : (
              <Text style={styles.searchBtnText}>🔍</Text>
            )}
          </TouchableOpacity>
        </View>
        {result && (
          <View
            style={[
              styles.resultCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.resultHeader}>
              <Text
                style={[
                  styles.resultLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                AI Result
              </Text>
              <TouchableOpacity
                onPress={copyResult}
                style={[styles.copyBtn, { backgroundColor: colors.secondary }]}
              >
                <Text>📋</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.resultText, { color: colors.foreground }]}
            >
              {result}
            </Text>
          </View>
        )}
      </ScrollView>
      <BannerAdPlaceholder />
      <RewardedAdPlaceholder
        show={showAd}
        onReward={doAICall}
        onClose={() => setShowAd(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { fontSize: 12, flex: 1 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { fontSize: 10, fontWeight: '600' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1 },
  searchBtn: {
    width: 48,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: { fontSize: 18 },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: { fontSize: 12, fontWeight: '600' },
  copyBtn: { padding: 4, borderRadius: 4 },
  resultText: { fontSize: 14 },
});
