import React, { useState, useMemo, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import flashcardsData from '@/data/flashcards.json';

const categories = Object.keys(flashcardsData) as Array<keyof typeof flashcardsData>;
const PROGRESS_KEY = 'flashcard-progress';

export default function FlashcardsScreen() {
  const { colors } = useTheme();
  const [category, setCategory] = useState(categories[0]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [known, setKnown] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PROGRESS_KEY);
        setKnown(stored ? JSON.parse(stored) : {});
      } catch {
        setKnown({});
      }
    })();
  }, []);

  const cards = useMemo(() => {
    const base = [...(flashcardsData[category] as { front: string; back: string }[])];
    return shuffled ? base.sort(() => Math.random() - 0.5) : base;
  }, [category, shuffled]);

  const card = cards[index];
  const cardId = card ? `${category}-${card.front}` : '';

  const markKnown = (isKnown: boolean) => {
    const next = { ...known, [cardId]: isKnown };
    setKnown(next);
    AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    goNext();
  };

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };
  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  const knownCount = cards.filter(
    (c) => known[`${category}-${c.front}`] === true
  ).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <PageHeader title="Flashcards" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => {
              setCategory(cat);
              setIndex(0);
              setFlipped(false);
            }}
            style={[
              styles.catBtn,
              category === cat
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.secondary },
            ]}
          >
            <Text
              style={[
                styles.catBtnText,
                {
                  color:
                    category === cat
                      ? colors.primaryForeground
                      : colors.foreground,
                },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.main}>
        <Text
          style={[styles.counter, { color: colors.mutedForeground }]}
        >
          {index + 1} / {cards.length} · {knownCount} known
        </Text>
        <TouchableOpacity
          onPress={() => setFlipped(!flipped)}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          activeOpacity={0.98}
        >
          <Text
            style={[styles.cardLabel, { color: colors.mutedForeground }]}
          >
            {flipped ? 'Answer' : 'Question'}
          </Text>
          <Text
            style={[styles.cardText, { color: colors.foreground }]}
          >
            {flipped ? card?.back : card?.front}
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.tapHint, { color: colors.mutedForeground }]}
        >
          Tap card to flip
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={goPrev}
            style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.actionIcon}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => markKnown(false)}
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.destructiveLight ?? colors.destructive,
              },
            ]}
          >
            <Text style={[styles.actionIcon, { color: colors.destructive }]}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => markKnown(true)}
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.successLight ?? colors.success,
              },
            ]}
          >
            <Text style={[styles.actionIcon, { color: colors.success }]}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goNext}
            style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.actionIcon}>→</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            setShuffled(!shuffled);
            setIndex(0);
            setFlipped(false);
          }}
        >
          <Text
            style={[styles.shuffleText, { color: colors.mutedForeground }]}
          >
            🔀 {shuffled ? 'Unshuffle' : 'Shuffle'}
          </Text>
        </TouchableOpacity>
      </View>
      <BannerAdPlaceholder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  catRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  catBtnText: { fontSize: 12, fontWeight: '500' },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  counter: { fontSize: 12 },
  card: {
    width: '100%',
    maxWidth: 340,
    aspectRatio: 3 / 2,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: { fontSize: 12, marginBottom: 8 },
  cardText: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  tapHint: { fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionBtn: {
    padding: 8,
    borderRadius: 12,
  },
  actionIcon: { fontSize: 20, fontWeight: '600' },
  shuffleText: { fontSize: 12 },
});
