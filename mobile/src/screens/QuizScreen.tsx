import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import PageHeader from '@/components/layout/PageHeader';
import BannerAdPlaceholder from '@/components/layout/BannerAdPlaceholder';
import { useTheme } from '@/contexts/ThemeContext';
import quizData from '@/data/quizzes.json';

const subjects = Object.keys(quizData) as Array<keyof typeof quizData>;

export default function QuizScreen() {
  const { colors } = useTheme();
  const [subject, setSubject] = useState(subjects[0]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const questions = useMemo(
    () => (quizData[subject] as any[]).slice(0, 10),
    [subject]
  );
  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers((a) => [...a, idx]);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const retry = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="Practice Quiz" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjectRow}
      >
        {subjects.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => { setSubject(s); retry(); }}
            style={[
              styles.subjectBtn,
              subject === s
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.secondary },
            ]}
          >
            <Text
              style={[
                styles.subjectBtnText,
                {
                  color:
                    subject === s
                      ? colors.primaryForeground
                      : colors.foreground,
                },
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {finished ? (
          <View style={styles.finished}>
            <Text style={[styles.scoreBig, { color: colors.primary }]}>
              {score}/{questions.length}
            </Text>
            <Text style={[styles.message, { color: colors.foreground }]}>
              {score >= 8
                ? 'Excellent! 🎉'
                : score >= 5
                  ? 'Good job! 👍'
                  : 'Keep practicing! 💪'}
            </Text>
            <TouchableOpacity
              onPress={retry}
              style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[
                  styles.retryBtnText,
                  { color: colors.primaryForeground },
                ]}
              >
                🔄 Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.questions}>
            <View
              style={[
                styles.meta,
              ]}
            >
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                Q{current + 1}/{questions.length}
              </Text>
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                Score: {score}
              </Text>
            </View>
            <Text style={[styles.questionText, { color: colors.foreground }]}>
              {q?.question}
            </Text>
            <View style={styles.options}>
              {q?.options.map((opt: string, idx: number) => {
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
                    style={[
                      styles.optionBtn,
                      { backgroundColor: bg, borderColor },
                    ]}
                  >
                    <Text
                      style={[styles.optionText, { color: colors.foreground }]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {selected !== null && (
              <>
                <View
                  style={[
                    styles.explanation,
                    { backgroundColor: colors.muted },
                  ]}
                >
                  <Text
                    style={[
                      styles.explanationText,
                      { color: colors.foreground },
                    ]}
                  >
                    {q?.explanation}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={next}
                  style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                >
                  <Text
                    style={[
                      styles.nextBtnText,
                      { color: colors.primaryForeground },
                    ]}
                  >
                    {current + 1 >= questions.length
                      ? 'See Results'
                      : 'Next Question'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
      <BannerAdPlaceholder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subjectRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  subjectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectBtnText: { fontSize: 12, fontWeight: '500' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  finished: {
    alignItems: 'center',
    marginTop: 32,
    gap: 16,
  },
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
  optionBtn: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: { fontSize: 14 },
  explanation: {
    padding: 12,
    borderRadius: 12,
  },
  explanationText: { fontSize: 14 },
  nextBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnText: { fontSize: 16, fontWeight: '500' },
});
