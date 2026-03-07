import { useState } from "react";
import { Brain, Loader2, RotateCcw, Sparkles, School, CheckCircle2, XCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import RewardedAdPlaceholder from "@/components/layout/RewardedAdPlaceholder";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses, getCachedResult, type QuizData } from "@/services/aiService";
import { recordActivity, updateUserStats, fetchUserStats } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const AIQuizPage = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [questions, setQuestions] = useState<QuizData["questions"]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const prompt = `Generate 5 MCQ questions about: ${topic}`;
    const cached = getCachedResult<QuizData>("quiz", prompt);
    if (cached) {
      setQuestions(cached.questions);
      setCurrent(0); setScore(0); setSelected(null); setFinished(false);
      return;
    }

    if (getRemainingUses() > 0) {
      doAICall();
    } else {
      setShowAd(true);
    }
  };

  const handleReward = () => {
    addBonusUses(10);
    doAICall();
  };

  const doAICall = async () => {
    const prompt = `Generate 5 MCQ questions about: ${topic}`;
    setShowAd(false);
    setLoading(true);
    try {
      const res = await callAI("quiz", topic);
      setQuestions(res.questions);
      setCurrent(0); setScore(0); setSelected(null); setFinished(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].answer) setScore(s => s + 1);
  };

  const next = async () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      await recordActivity(user?.id, {
        title: `${topic} Quiz`,
        details: `Scored ${score}/${questions.length}`,
        type: 'ai_quiz'
      });
      const currentStats = await fetchUserStats(user?.id);
      await updateUserStats(user?.id, {
        dailyTasksCompleted: Math.min(currentStats.dailyTasksTotal, currentStats.dailyTasksCompleted + 1)
      });
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  const q = questions[current];

  return (
    <MainLayout title="Quiz Generator">
      <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full pb-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quiz Topic</label>
                <span className="px-2 py-0.5 rounded-full bg-ai-glow/15 text-ai-glow text-[10px] font-semibold">{getRemainingUses()} left</span>
              </div>
              <input
                className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary px-4 outline-none font-medium"
                placeholder="e.g. Photosynthesis, Calculus..."
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="mt-6 w-full md:w-auto px-8 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate Quiz
          </button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {finished ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-8 lg:p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
                <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary"><School className="w-10 h-10" /></div>
                <div><h3 className="text-3xl font-bold mb-2">Completed!</h3><p className="text-slate-500">You scored {score} out of {questions.length}</p></div>
                <div className="text-5xl font-black text-primary">{Math.round((score / questions.length) * 100)}%</div>
                <button onClick={() => { setQuestions([]); setFinished(false); setTopic(""); }} className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"><RotateCcw className="w-5 h-5" /> Try Another</button>
              </div>
            ) : q && (
              <>
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold flex items-center gap-2 truncate">
                    Practice: <span className="text-primary truncate">{topic}</span>
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-medium text-slate-500 hidden sm:inline">Answers</span>
                    <button onClick={() => setShowAnswers(!showAnswers)} className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", showAnswers ? "bg-primary" : "bg-slate-200 dark:bg-slate-700")}><span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition", showAnswers ? "translate-x-6" : "translate-x-1")}></span></button>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex gap-4">
                    <span className="shrink-0 flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm">{current + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-medium mb-6 leading-relaxed">{q.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((option, idx) => {
                          const isSelected = selected === idx;
                          const isCorrect = idx === q.answer;
                          const showResult = selected !== null || showAnswers;
                          return (
                            <button key={idx} onClick={() => handleSelect(idx)} disabled={selected !== null} className={cn("flex items-center p-4 border rounded-lg transition-all text-left", !showResult && "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50", showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-500/10", showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-500/10", showResult && !isSelected && !isCorrect && "opacity-50 border-slate-100 dark:border-slate-800")}>
                              <div className={cn("size-4 rounded-full border flex items-center justify-center mr-3 shrink-0", !showResult && "border-slate-300 dark:border-slate-600", showResult && isCorrect && "border-green-500 bg-green-500 text-white", showResult && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white")}>
                                {showResult && isCorrect && <CheckCircle2 className="w-3 h-3" />}
                                {showResult && isSelected && !isCorrect && <XCircle className="w-3 h-3" />}
                              </div>
                              <span className={cn("text-sm font-medium", showResult && isCorrect && "font-bold text-green-700 dark:text-green-400", showResult && isSelected && !isCorrect && "font-bold text-red-700 dark:text-red-400")}>{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                {selected !== null && (
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 animate-in fade-in slide-in-from-top-4"><h4 className="font-bold text-primary mb-2">Explanation</h4><p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{q.explanation}</p></div>
                )}
                <div className="pt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 mt-12"><div className="text-sm font-medium text-slate-500">Question {current + 1} of {questions.length}</div><button onClick={next} disabled={selected === null} className="px-10 py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-100 disabled:opacity-50">{current + 1 >= questions.length ? "Finish" : "Next"}</button></div>
              </>
            )}
          </div>
        )}
      </div>
      <RewardedAdPlaceholder show={showAd} onReward={handleReward} onClose={() => setShowAd(false)} />
    </MainLayout>
  );
};

export default AIQuizPage;
