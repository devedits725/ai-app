import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

const modules = [
  { title: 'Calculator Tools', subtitle: 'Math made easy', emoji: '🧮', path: 'Calculator', color: 'blue' },
  { title: 'Formula Sheets', subtitle: 'Quick reference', emoji: '📖', path: 'Formulas', color: 'emerald' },
  { title: 'Unit Converter', subtitle: 'Instant convert', emoji: '↔️', path: 'Converter', color: 'orange' },
  { title: 'Flashcards', subtitle: 'Study & revise', emoji: '📇', path: 'Flashcards', color: 'pink' },
  { title: 'Practice Quiz', subtitle: 'Test yourself', emoji: '📋', path: 'Quiz', color: 'cyan' },
  { title: 'AI Homework Helper', subtitle: 'Step-by-step help', emoji: '💬', path: 'AIHelper', color: 'purple', ai: true },
  { title: 'AI Flashcard Gen', subtitle: 'Generate cards', emoji: '✨', path: 'AIFlashcards', color: 'violet', ai: true },
  { title: 'AI Quiz Gen', subtitle: 'Custom quizzes', emoji: '🧠', path: 'AIQuiz', color: 'fuchsia', ai: true },
  { title: 'Smart Formula Search', subtitle: 'Ask in plain English', emoji: '🔍', path: 'AIFormulaSearch', color: 'indigo', ai: true },
];

export default function HomeScreen() {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingBottom: insets.bottom }]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>📚 Student Toolkit</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Your pocket study companion
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={[styles.settingsBtn, { backgroundColor: colors.secondary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {modules.map((mod) => (
          <TouchableOpacity
            key={mod.path}
            onPress={() => navigation.navigate(mod.path as keyof RootStackParamList)}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            activeOpacity={0.9}
          >
            {mod.ai && (
              <View style={[styles.aiBadge, { backgroundColor: colors.aiGlowLight ?? colors.primaryLight }]}>
                <Text style={[styles.aiBadgeText, { color: colors.aiGlow ?? colors.primary }]}>AI</Text>
              </View>
            )}
            <Text style={styles.cardEmoji}>{mod.emoji}</Text>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{mod.title}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
              {mod.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  settingsBtn: {
    padding: 8,
    borderRadius: 12,
  },
  settingsIcon: { fontSize: 20 },
  scroll: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    position: 'relative',
  },
  aiBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  aiBadgeText: { fontSize: 10, fontWeight: '600' },
  cardEmoji: { fontSize: 24 },
  cardTitle: { fontSize: 14, fontWeight: '600' },
  cardSubtitle: { fontSize: 11 },
});
