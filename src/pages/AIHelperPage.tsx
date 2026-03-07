import { useState } from "react";
import { Copy, Sparkles, Loader2, Search, Bell, Settings, ImageIcon, Mic, Bookmark, Share2, Lightbulb } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import RewardedAdPlaceholder from "@/components/layout/RewardedAdPlaceholder";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses } from "@/services/aiService";
import { recordActivity } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

const AIHelperPage = () => {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showAd, setShowAd] = useState(false);

  const handleReward = () => {
    addBonusUses(10);
    doAICall();
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    if (getRemainingUses() > 0) {
      doAICall();
    } else {
      setShowAd(true);
    }
  };

  const doAICall = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const res = await callAI("helper", question);
      setResult(res);
      await recordActivity(user?.id, {
        title: "Homework Helped",
        details: question.slice(0, 50) + "...",
        type: "ai_helper"
      });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Homework Helper">
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Got a tough question?</h1>
            <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 mt-2">Paste your math problem, history essay prompt, or science question below.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-ai-glow/15 text-ai-glow text-xs font-bold shrink-0">
            {getRemainingUses()} left
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 lg:p-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3" htmlFor="question">Your Question</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 outline-none p-4"
              placeholder="Type or paste your question here..."
              rows={5}
            />
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <ImageIcon className="w-4 h-4" />
                  Image
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Mic className="w-4 h-4" />
                  Voice
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || !question.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Generate Answer
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-slate-500 font-medium animate-pulse">Analyzing your question...</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="text-primary w-6 h-6" />
                Solution
              </h3>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }} className="p-2 text-slate-500 hover:text-primary bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"><Copy className="w-4 h-4" /></button>
                <button className="p-2 text-slate-500 hover:text-primary bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"><Bookmark className="w-4 h-4" /></button>
                <button className="p-2 text-slate-500 hover:text-primary bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"><Share2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{result}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-8 pb-12">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold rounded uppercase tracking-wider">Math</span>
                <span className="text-[10px] text-slate-400 font-medium">2h ago</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-primary transition-colors">Pythagorean theorem application examples...</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">Science</span>
                <span className="text-[10px] text-slate-400 font-medium">1d ago</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-primary transition-colors">Explain photosynthesis in simple terms...</p>
            </div>
          </div>
        </div>
      </div>
      <RewardedAdPlaceholder show={showAd} onReward={handleReward} onClose={() => setShowAd(false)} />
    </MainLayout>
  );
};

export default AIHelperPage;
