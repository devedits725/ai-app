import { supabase } from "@/integrations/supabase/client";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAILY_LIMIT = 15;
const CACHE_PREFIX = "ai-cache-";
const COUNTER_KEY = "ai-daily-counter";
const BONUS_KEY = "ai-bonus-uses";

// Simple hash for cache keys
function hashPrompt(type: string, prompt: string): string {
  const str = `${type}:${prompt.toLowerCase().trim()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `${CACHE_PREFIX}${hash}`;
}

async function getDailyCounter(): Promise<{ count: number; date: string }> {
  try {
    const stored = JSON.parse(await AsyncStorage.getItem(COUNTER_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    if (stored.date !== today) return { count: 0, date: today };
    return stored;
  } catch {
    return { count: 0, date: new Date().toISOString().slice(0, 10) };
  }
}

async function incrementCounter(): Promise<void> {
  const counter = await getDailyCounter();
  counter.count++;
  await AsyncStorage.setItem(COUNTER_KEY, JSON.stringify(counter));
}

export async function getRemainingUses(): Promise<number> {
  const counter = await getDailyCounter();
  const bonusUses = await getBonusUses();
  const dailyRemaining = Math.max(0, DAILY_LIMIT - counter.count);
  return dailyRemaining + bonusUses;
}

export async function getUsageBreakdown(): Promise<{ daily: number; bonus: number; total: number }> {
  const counter = await getDailyCounter();
  const bonusUses = await getBonusUses();
  const dailyRemaining = Math.max(0, DAILY_LIMIT - counter.count);
  return {
    daily: dailyRemaining,
    bonus: bonusUses,
    total: dailyRemaining + bonusUses
  };
}

async function getBonusUses(): Promise<number> {
  try {
    const stored = JSON.parse(await AsyncStorage.getItem(BONUS_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    if (stored.date !== today) return 0;
    return stored.bonus || 0;
  } catch {
    return 0;
  }
}

export async function addBonusUses(amount: number): Promise<void> {
  const stored = JSON.parse(await AsyncStorage.getItem(BONUS_KEY) || "{}");
  const today = new Date().toISOString().slice(0, 10);
  const currentBonus = stored.date === today ? stored.bonus : 0;
  const newBonus = currentBonus + amount;
  await AsyncStorage.setItem(BONUS_KEY, JSON.stringify({
    date: today,
    bonus: newBonus
  }));
  console.log(`Added ${amount} bonus uses. Total bonus: ${newBonus}`);
}

export async function useBonusUse(): Promise<void> {
  const stored = JSON.parse(await AsyncStorage.getItem(BONUS_KEY) || "{}");
  const today = new Date().toISOString().slice(0, 10);
  if (stored.date === today && stored.bonus > 0) {
    const newBonus = stored.bonus - 1;
    await AsyncStorage.setItem(BONUS_KEY, JSON.stringify({
      date: today,
      bonus: newBonus
    }));
    console.log(`Used 1 bonus use. Remaining bonus: ${newBonus}`);
  }
}

export async function getCachedResult<T>(type: string, prompt: string): Promise<T | null> {
  try {
    const key = hashPrompt(type, prompt);
    const cached = await AsyncStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore */ }
  return null;
}

async function setCachedResult(type: string, prompt: string, data: unknown): Promise<void> {
  try {
    const key = hashPrompt(type, prompt);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch { /* storage full, ignore */ }
}

export type AIType = "explain" | "flashcards" | "quiz" | "formula";

export async function callAI<T = unknown>(type: AIType, prompt: string): Promise<T> {
  // Check offline
  if (!navigator.onLine) {
    const cached = await getCachedResult<T>(type, prompt);
    if (cached) return cached;
    throw new Error("You're offline. Please connect to internet for AI features.");
  }

  // Check cache first
  const cached = await getCachedResult<T>(type, prompt);
  if (cached) return cached;

  // Check daily limit
  const remaining = await getRemainingUses();
  if (remaining <= 0) {
    throw new Error("Daily AI limit reached. Watch ads to get more uses!");
  }

  const { data, error } = await supabase.functions.invoke("ai-study", {
    body: { type, prompt },
  });

  if (error) {
    throw new Error(error.message || "AI request failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  // Cache and count
  await setCachedResult(type, prompt, data);
  
  // Use bonus uses first, then daily uses
  const bonusUses = await getBonusUses();
  if (bonusUses > 0) {
    await useBonusUse();
    console.log(`Used bonus use. Bonus remaining: ${bonusUses - 1}`);
  } else {
    await incrementCounter();
    console.log(`Used daily use.`);
  }

  return data as T;
}

export interface FlashcardData {
  cards: Array<{ front: string; back: string }>;
}

export interface QuizData {
  questions: Array<{
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }>;
}

export interface TextResult {
  text: string;
}