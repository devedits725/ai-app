import { supabase } from "@/integrations/supabase/client";

const DAILY_LIMIT = 7;
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

function getDailyCounter(): { count: number; bonus: number; date: string } {
  try {
    const stored = JSON.parse(localStorage.getItem(COUNTER_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    if (stored.date !== today) return { count: 0, bonus: 0, date: today };
    return {
      count: stored.count || 0,
      bonus: stored.bonus || 0,
      date: today
    };
  } catch {
    return { count: 0, bonus: 0, date: new Date().toISOString().slice(0, 10) };
  }
}

function incrementCounter(): void {
  const counter = getDailyCounter();
  counter.count++;
  localStorage.setItem(COUNTER_KEY, JSON.stringify(counter));
}

export function addBonusUses(amount: number): void {
  const counter = getDailyCounter();
  counter.bonus += amount;
  localStorage.setItem(COUNTER_KEY, JSON.stringify(counter));
}

export function getRemainingUses(): number {
  const counter = getDailyCounter();
  return Math.max(0, (DAILY_LIMIT + counter.bonus) - counter.count);
}

export function getCachedResult<T>(type: string, prompt: string): T | null {
  try {
    const key = hashPrompt(type, prompt);
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore */ }
  return null;
}

function setCachedResult(type: string, prompt: string, data: unknown): void {
  try {
    const key = hashPrompt(type, prompt);
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* storage full, ignore */ }
}

export type AIType = "explain" | "flashcards" | "quiz" | "formula" | "essay" | "debug";

export async function callAI<T = unknown>(type: AIType, prompt: string): Promise<T> {
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

  // Enhanced prompt engineering for better results
  let enhancedPrompt = prompt;
  
  switch (type) {
    case "explain":
      enhancedPrompt = `As an expert tutor, provide a clear, step-by-step explanation for: ${prompt}. 
      Include:
      - A simple explanation
      - Step-by-step breakdown
      - Key concepts or formulas
      - A practical example
      Format in a way that's easy to read and understand.`;
      break;
      
    case "flashcards":
      enhancedPrompt = `Create comprehensive flashcards for: ${prompt}. 
      Generate 10-15 high-quality flashcards with:
      - Clear, concise front questions
      - Detailed back answers
      - Cover key concepts, definitions, and examples
      Format as JSON: { cards: [{ front: "...", back: "..." }] }`;
      break;
      
    case "quiz":
      enhancedPrompt = `Generate a comprehensive quiz on: ${prompt}. 
      Create 10 multiple-choice questions with:
      - Clear questions
      - 4 plausible options (A, B, C, D)
      - Correct answer number
      - Detailed explanations
      Format as JSON: { questions: [{ question: "...", options: [...], answer: 0, explanation: "..." }] }`;
      break;
      
    case "formula":
      enhancedPrompt = `As a mathematics and science expert, provide detailed information about: ${prompt}. 
      Include:
      - The formula itself
      - What each variable represents
      - Units of measurement
      - When to use it
      - A worked example
      Format clearly with proper mathematical notation.`;
      break;
      
    case "essay":
      enhancedPrompt = `As an expert academic writer, create a well-structured essay based on: ${prompt}. 
      The essay should include:
      - Clear introduction with thesis statement
      - Well-organized body paragraphs with topic sentences
      - Proper transitions between paragraphs
      - Strong conclusion that summarizes key points
      - Proper formatting with paragraphs
      Write in an academic style that is clear and engaging.`;
      break;
      
    case "debug":
      enhancedPrompt = `As an expert software developer and debugger, analyze the following code: ${prompt}. 
      Provide:
      - Identification of any errors or bugs
      - Line-by-line analysis of issues
      - Corrected code with fixes
      - Explanation of what was wrong and why
      - Best practices recommendations
      Format the response clearly with sections for errors, corrections, and explanations.`;
      break;
  }

  const { data, error } = await supabase.functions.invoke("ai-study", {
    body: { type, prompt: enhancedPrompt },
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
