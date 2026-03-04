import { supabase } from "@/integrations/supabase/client";
import { type LucideIcon, FileText, HelpCircle, CheckCircle, Calculator, Search, Brain, Layers, ClipboardList } from "lucide-react";

export interface UserActivity {
  id?: string;
  title: string;
  time: string;
  details: string;
  type: string;
  timestamp: number;
}

export interface UserStats {
  focusHours: number;
  focusChange: number;
  cardsMastered: number;
  cardsProgress: number;
  dailyTasksCompleted: number;
  dailyTasksTotal: number;
}

const ACTIVITY_CACHE_KEY = "user-activity-cache";
const STATS_CACHE_KEY = "user-stats-cache";

const DEFAULT_STATS: UserStats = {
  focusHours: 0,
  focusChange: 0,
  cardsMastered: 0,
  cardsProgress: 0,
  dailyTasksCompleted: 0,
  dailyTasksTotal: 5
};

export const getActivityIcon = (type: string): LucideIcon => {
  switch (type) {
    case 'flashcards_generated': return FileText;
    case 'problem_solved': return HelpCircle;
    case 'quiz_completed': return CheckCircle;
    case 'calculator_used': return Calculator;
    case 'formula_searched': return Search;
    case 'ai_helper': return Brain;
    case 'ai_flashcards': return Layers;
    case 'ai_quiz': return ClipboardList;
    default: return FileText;
  }
};

export const getActivityColor = (type: string): string => {
  switch (type) {
    case 'flashcards_generated': return "bg-blue-50 dark:bg-blue-500/10 text-blue-600";
    case 'problem_solved': return "bg-orange-50 dark:bg-orange-500/10 text-orange-600";
    case 'quiz_completed': return "bg-purple-50 dark:bg-purple-500/10 text-purple-600";
    case 'calculator_used': return "bg-green-50 dark:bg-green-500/10 text-green-600";
    case 'formula_searched': return "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600";
    default: return "bg-slate-50 dark:bg-slate-500/10 text-slate-600";
  }
};

export const fetchUserActivity = async (userId: string | undefined): Promise<UserActivity[]> => {
  if (!userId) {
    const cached = localStorage.getItem(ACTIVITY_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  }

  try {
    const { data, error } = await supabase
      .from('user_activity' as any)
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data as UserActivity[];
  } catch (err) {
    console.warn("Table user_activity might not exist, falling back to local storage", err);
    const cached = localStorage.getItem(ACTIVITY_CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  }
};

export const recordActivity = async (userId: string | undefined, activity: Omit<UserActivity, 'time' | 'timestamp'>) => {
  const timestamp = Date.now();
  const newActivity: UserActivity = {
    ...activity,
    time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp
  };

  // Always update local storage as fallback/cache
  const cached = localStorage.getItem(ACTIVITY_CACHE_KEY);
  const activities = cached ? JSON.parse(cached) : [];
  const updatedActivities = [newActivity, ...activities].slice(0, 20);
  localStorage.setItem(ACTIVITY_CACHE_KEY, JSON.stringify(updatedActivities));

  if (userId) {
    try {
      await supabase.from('user_activity' as any).insert([{
        user_id: userId,
        ...newActivity
      }]);
    } catch (err) {
      console.warn("Could not record activity to Supabase", err);
    }
  }
};

export const fetchUserStats = async (userId: string | undefined): Promise<UserStats> => {
  if (!userId) {
    const cached = localStorage.getItem(STATS_CACHE_KEY);
    return cached ? JSON.parse(cached) : DEFAULT_STATS;
  }

  try {
    const { data, error } = await supabase
      .from('user_stats' as any)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as UserStats;
  } catch (err) {
    console.warn("Table user_stats might not exist, falling back to local storage", err);
    const cached = localStorage.getItem(STATS_CACHE_KEY);
    return cached ? JSON.parse(cached) : DEFAULT_STATS;
  }
};

export const updateUserStats = async (userId: string | undefined, statsUpdate: Partial<UserStats>) => {
  const currentStats = await fetchUserStats(userId);
  const updatedStats = { ...currentStats, ...statsUpdate };

  localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(updatedStats));

  if (userId) {
    try {
      await supabase
        .from('user_stats' as any)
        .upsert({ user_id: userId, ...updatedStats });
    } catch (err) {
      console.warn("Could not update stats in Supabase", err);
    }
  }
};
