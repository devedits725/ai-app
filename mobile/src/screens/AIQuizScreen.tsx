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
import InterstitialAdPlaceholder from '@/components/layout/InterstitialAdPlaceholder';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/lib/toast';
import {
  callAI,
  getRemainingUses,
  getCachedResult,
  type QuizData,
} from '@/services/aiService';

export default function AIQuizScreen() {
  const { colors } = useTheme();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [questions, setQuestions] = useState<QuizData['questions']>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
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
    const cached = await getCachedResult<QuizData>('quiz', topic);
    if (cached) {
      setQuestions(cached.questions || []);
      setCurrent(0);
      setScore(0);
      setSelected(null);
      setFinished(false);
      return;
    }
    setShowAd(true);
  };

  const doAICall = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const data = await callAI<QuizData>(
        'quiz',
        `Generate 5 MCQ questions about: ${topic}`
      );
      setQuestions(data.questions || []);
      setCurrent(0);
      setScore(0);
      setSelected(null);
      setFinished(false);
      const remaining = await getRemainingUses();
      setRemaining(remaining);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current]?.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      setShowInterstitial(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const q = questions[current];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="AI Quiz Generator" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {questions.length === 0 ? (
          <>
            <View style={styles.header}>
              <Text style={[styles.headerText, { color: colors.mutedForeground }]}>
                Generate custom quizzes on any topic using AI
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
                  {remaining} left (watch ads for more)
                </Text>
              </View>
            </View>
            <View style={styles.inputRow}>
              <Input
                value={topic}
                onChangeText={setTopic}
                placeholder="e.g. World War II"
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
                  <Text style={styles.genBtnText}>🧠</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : finished ? (
          <View style={styles.finished}>
            <Text style={[styles.scoreBig, { color: colors.primary }]}>
              {score}/{questions.length}
            </Text>
            <Text style={[styles.message, { color: colors.foreground }]}>
              {score >= 4 ? 'Excellent! 🎉' : score >= 3 ? 'Good job! 👍' : 'Keep practicing! 💪'}
            </Text>
            <TouchableOpacity
              onPress={() => { setQuestions([]); setFinished(false); }}
              style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.retryBtnText, { color: colors.primaryForeground }]}>
                🔄 New Quiz
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          q && (
            <View style={styles.questions}>
              <View style={styles.meta}>
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  Q{current + 1}/{questions.length}
                </Text>
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  Score: {score}
                </Text>
              </View>
              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {q.question}
              </Text>
              <View style={styles.options}>
                {q.options.map((opt, idx) => {
                  let bg = colors.card;
                  let borderColor = colors.border;
                  if (selected !== null) {
                    if (idx === q.answer) {
                      bg = (colors as any).successLight || (colors as any).success;
                      borderColor = (colors as any).success;
                    } else if (idx === selected) {
                      bg = (colors as any).destructiveLight || (colors as any).destructive;
                      borderColor = (colors as any).destructive;
                    }
                  }
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSelect(idx)}
                      style={[styles.optionBtn, { backgroundColor: bg, borderColor }]}
                    >
                      <Text style={[styles.optionText, { color: colors.foreground }]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selected !== null && (
                <>
                  <View style={[styles.explanation, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.explanationText, { color: colors.foreground }]}>
                      {q.explanation}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={next}
                    style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.nextBtnText, { color: colors.primaryForeground }]}>
                      {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )
        )}
      </ScrollView>
      <BannerAdPlaceholder />
      <RewardedAdPlaceholder
        show={showAd}
        onReward={doAICall}
        onClose={() => setShowAd(false)}
      />
      <InterstitialAdPlaceholder
        show={showInterstitial}
        onClose={() => setShowInterstitial(false)}
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
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
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
  finished: { alignItems: 'center', marginTop: 32, gap: 16 },
  scoreBig: { fontSize: 48, fontWeight: '700' },
  message: { fontSize: 18, fontWeight: '600' },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: { fontSize: 16, fontWeight: '500' },
  questions: { gap: 16 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 14 },
  questionText: { fontSize: 16, fontWeight: '600' },
  options: { gap: 8 },
  optionBtn: { width: '100%', padding: 12, borderRadius: 12, borderWidth: 1 },
  optionText: { fontSize: 14 },
  explanation: { padding: 12, borderRadius: 12 },
  explanationText: { fontSize: 14 },
  nextBtn: { width: '100%', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: '500' },
});