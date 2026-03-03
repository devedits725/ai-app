import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import PageHeader from '@/components/layout/PageHeader';
import BannerAdPlaceholder from '@/components/layout/BannerAdPlaceholder';
import RewardedAdPlaceholder from '@/components/layout/RewardedAdPlaceholder';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/lib/toast';
import {
  callAI,
  getRemainingUses,
  getUsageBreakdown,
  getCachedResult,
  type TextResult,
} from '@/services/aiService';
import NetInfo from '@react-native-community/netinfo';

export default function AIHelperScreen() {
  const { colors } = useTheme();
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [usage, setUsage] = useState({ daily: 0, bonus: 0, total: 0 });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const setupRemaining = async () => {
      const remaining = await getRemainingUses();
      const breakdown = await getUsageBreakdown();
      setRemaining(remaining);
      setUsage(breakdown);
    };
    setupRemaining();

    if (Platform.OS === 'web') {
      const update = () => setIsOnline(typeof navigator !== 'undefined' && navigator.onLine);
      update();
      window.addEventListener('online', update);
      window.addEventListener('offline', update);
      return () => {
        window.removeEventListener('online', update);
        window.removeEventListener('offline', update);
      };
    }

    const unsub = NetInfo.addEventListener((s: { isConnected: boolean | null }) =>
      setIsOnline(s.isConnected ?? false)
    );
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    const cached = await getCachedResult<TextResult>('explain', question);
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
      const data = await callAI<TextResult>('explain', question);
      setResult(data.text);
      const r = await getRemainingUses();
      const breakdown = await getUsageBreakdown();
      setRemaining(r);
      setUsage(breakdown);
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
      <PageHeader title="AI Homework Helper" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.meta}>
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: (colors as any).aiGlowLight || (colors as any).primaryLight },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: (colors as any).aiGlow || (colors as any).primary },
              ]}
            >
              {usage.total} left ({usage.daily} daily + {usage.bonus} bonus)
            </Text>
          </View>
        </View>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Type your homework question here..."
          placeholderTextColor={colors.mutedForeground}
          style={[
            styles.textarea,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.foreground,
            },
          ]}
          multiline
          numberOfLines={5}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || !question.trim()}
          style={[
            styles.submitBtn,
            {
              backgroundColor: colors.primary,
              opacity: loading || !question.trim() ? 0.5 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text
              style={[
                styles.submitBtnText,
                { color: colors.primaryForeground },
              ]}
            >
              Get Explanation
            </Text>
          )}
        </TouchableOpacity>
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
                AI Response
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
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: { fontSize: 12 },
  badge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { fontSize: 10, fontWeight: '600' },
  textarea: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  submitBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  submitBtnText: { fontSize: 16, fontWeight: '500' },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultLabel: { fontSize: 12, fontWeight: '600' },
  copyBtn: { padding: 4, borderRadius: 4 },
  resultText: { fontSize: 14 },
});
