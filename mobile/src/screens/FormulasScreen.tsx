import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import PageHeader from '@/components/layout/PageHeader';
import BannerAdPlaceholder from '@/components/layout/BannerAdPlaceholder';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/lib/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formulasData from '@/data/formulas.json';

const subjects = [
  { key: 'math', label: 'Math' },
  { key: 'physics', label: 'Physics' },
  { key: 'chemistry', label: 'Chemistry' },
] as const;

const FORMULA_BOOKMARKS_KEY = 'formula-bookmarks';

export default function FormulasScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState('math');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(FORMULA_BOOKMARKS_KEY);
        setBookmarks(stored ? JSON.parse(stored) : []);
      } catch {
        setBookmarks([]);
      }
    })();
  }, []);

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    AsyncStorage.setItem(FORMULA_BOOKMARKS_KEY, JSON.stringify(next));
  };

  const copyFormula = async (formula: string) => {
    await Clipboard.setStringAsync(formula);
    toast.success('Formula copied!');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="Formula Sheets" />
      <View style={styles.searchWrap}>
        <Text style={[styles.searchIcon, { color: colors.mutedForeground }]}>🔍</Text>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search formulas..."
          style={styles.searchInput}
        />
      </View>
      <Tabs value={activeSubject} onValueChange={setActiveSubject}>
        <View style={styles.tabsListWrap}>
          <TabsList>
            {subjects.map((s) => (
              <TabsTrigger
                key={s.key}
                value={s.key}
                activeValue={activeSubject}
                onPress={setActiveSubject}
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </View>
        {subjects.map((subject) => (
          <TabsContent
            key={subject.key}
            value={subject.key}
            activeValue={activeSubject}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {Object.entries(
                formulasData[subject.key] as Record<
                  string,
                  Array<{ name: string; formula: string; description: string }>
                >
              ).map(([topic, formulas]) => {
                const filtered = formulas.filter(
                  (f) =>
                    !search ||
                    f.name.toLowerCase().includes(search.toLowerCase()) ||
                    f.formula.toLowerCase().includes(search.toLowerCase())
                );
                if (filtered.length === 0) return null;
                return (
                  <View key={topic} style={styles.topicSection}>
                    <Text
                      style={[
                        styles.topicTitle,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {topic}
                    </Text>
                    {filtered.map((f) => {
                      const id = `${subject.key}-${topic}-${f.name}`;
                      return (
                        <View
                          key={id}
                          style={[
                            styles.formulaCard,
                            {
                              backgroundColor: colors.card,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <View style={styles.formulaBody}>
                            <Text
                              style={[
                                styles.formulaName,
                                { color: colors.foreground },
                              ]}
                            >
                              {f.name}
                            </Text>
                            <Text
                              style={[
                                styles.formulaFormula,
                                { color: colors.primary },
                              ]}
                            >
                              {f.formula}
                            </Text>
                            <Text
                              style={[
                                styles.formulaDesc,
                                { color: colors.mutedForeground },
                              ]}
                            >
                              {f.description}
                            </Text>
                          </View>
                          <View style={styles.formulaActions}>
                            <TouchableOpacity
                              onPress={() => copyFormula(f.formula)}
                              style={[
                                styles.iconBtn,
                                { backgroundColor: colors.secondary },
                              ]}
                            >
                              <Text>📋</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => toggleBookmark(id)}
                              style={[
                                styles.iconBtn,
                                { backgroundColor: colors.secondary },
                              ]}
                            >
                              <Text>
                                {bookmarks.includes(id) ? '✅' : '🔖'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
          </TabsContent>
        ))}
      </Tabs>
      <BannerAdPlaceholder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1 },
  tabsListWrap: { paddingHorizontal: 16, paddingTop: 8 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  topicSection: { gap: 8 },
  topicTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  formulaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  formulaBody: { flex: 1, minWidth: 0 },
  formulaName: { fontSize: 14, fontWeight: '600' },
  formulaFormula: { fontSize: 16, fontVariant: ['tabular-nums'], marginTop: 4 },
  formulaDesc: { fontSize: 12, marginTop: 4 },
  formulaActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 6, borderRadius: 8 },
});
