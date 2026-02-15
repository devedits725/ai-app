import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
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
  type FlashcardData,
} from '@/services/aiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_KEY = 'ai-flashcards-saved';

export default function AIFlashcardsScreen() {
  const { colors } = useTheme();
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedIdx, setFlippedIdx] = useState<number | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const setupRemaining = async () => {
      const remaining = await getRemainingUses();
      setRemaining(remaining);
    };
    setupRemaining();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    const cached = await getCachedResult<FlashcardData>('flashcards', topic);
    if (cached) {
      setCards(cached.cards || []);
      return;
    }
    setShowAd(true);
  };

  const doAICall = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const data = await callAI<FlashcardData>(
        'flashcards',
        `Generate 8 flashcards about: ${topic}`
      );
      const list = data.cards || [];
      setCards(list);
      const savedRaw = await AsyncStorage.getItem(SAVED_KEY);
      const saved = savedRaw ? JSON.parse(savedRaw) : {};
      saved[topic] = list;
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(saved));
      setRemaining(await getRemainingUses());
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="AI Flashcard Generator" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text
            style={[styles.headerText, { color: colors.mutedForeground }]}
          >
            Enter a topic to generate study flashcards with AI
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
            value={topic}
            onChangeText={setTopic}
            placeholder="e.g. Photosynthesis"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={loading || !topic.trim()}
            style={[
              styles.genBtn,
              {
                backgroundColor: colors.primary,
                opacity: loading || !topic.trim() ? 0.5 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} size="small" />
            ) : (
              <Text style={styles.genBtnText}>✨</Text>
            )}
          </TouchableOpacity>
        </View>
        {cards.length > 0 && (
          <View style={styles.cards}>
            {cards.map((c, i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  setFlippedIdx(flippedIdx === i ? null : i)
                }
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {flippedIdx === i ? 'Answer' : 'Question'}
                </Text>
                <Text
                  style={[styles.cardText, { color: colors.foreground }]}
                >
                  {flippedIdx === i ? c.back : c.front}
                </Text>
              </TouchableOpacity>
            ))}
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
  genBtn: {
    width: 48,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genBtnText: { fontSize: 18 },
  cards: { gap: 8 },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardLabel: { fontSize: 12 },
  cardText: { fontSize: 14, fontWeight: '500', marginTop: 4 },
});
