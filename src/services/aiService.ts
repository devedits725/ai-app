import { supabase } from "@/integrations/supabase/client";

const DAILY_LIMIT = 15;
const CACHE_PREFIX = "ai-cache-";
const COUNTER_KEY = "ai-daily-counter";

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

function getDailyCounter(): { count: number; date: string } {
  try {
    const stored = JSON.parse(localStorage.getItem(COUNTER_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    if (stored.date !== today) return { count: 0, date: today };
    return stored;
  } catch {
    return { count: 0, date: new Date().toISOString().slice(0, 10) };
  }
}

function incrementCounter(): void {
  const counter = getDailyCounter();
  counter.count++;
  localStorage.setItem(COUNTER_KEY, JSON.stringify(counter));
}

export function getRemainingUses(): number {
  return Math.max(0, DAILY_LIMIT - getDailyCounter().count);
}

export function getCachedResult<T>(type: string, prompt: string): T | null {
  try {
    const key = hashPrompt(type, prompt);
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore */ }
  return null;
}

function setCachedResult(type: string, prompt: string, data: any): void {
  try {
    const key = hashPrompt(type, prompt);
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* storage full, ignore */ }
}

export type AIType = "explain" | "flashcards" | "quiz" | "formula";

export async function callAI<T = any>(type: AIType, prompt: string): Promise<T> {
  // Check offline
  if (!navigator.onLine) {
    const cached = getCachedResult<T>(type, prompt);
    if (cached) return cached;
    throw new Error("You're offline. Please connect to the internet for AI features.");
  }

  // Check cache first
  const cached = getCachedResult<T>(type, prompt);
  if (cached) return cached;

  // Check daily limit
  if (getRemainingUses() <= 0) {
    throw new Error("Daily AI limit reached. Come back tomorrow for more!");
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
  setCachedResult(type, prompt, data);
  incrementCounter();

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
