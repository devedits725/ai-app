import { useState } from "react";
import { Brain, Loader2, RotateCcw } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import RewardedAdPlaceholder from "@/components/layout/RewardedAdPlaceholder";
import InterstitialAdPlaceholder from "@/components/layout/InterstitialAdPlaceholder";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { callAI, getRemainingUses, getCachedResult, type QuizData } from "@/services/aiService";

const AIQuizPage = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [questions, setQuestions] = useState<QuizData["questions"]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const prompt = `Generate 5 MCQ questions about: ${topic}`;
    const cached = getCachedResult<QuizData>("quiz", prompt);
    if (cached) {
      setQuestions(cached.questions);
      setCurrent(0); setScore(0); setSelected(null); setFinished(false);
      return;
    }
    setShowAd(true);
  };

  const doAICall = async () => {
    const prompt = `Generate 5 MCQ questions about: ${topic}`;
    setShowAd(false);
    setLoading(true);
    try {
      const data = await callAI<QuizData>("quiz", prompt);
      setQuestions(data.questions || []);
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
    if (idx === questions[current]?.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      setShowInterstitial(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const q = questions[current];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="AI Quiz Generator" />
      <div className="flex-1 p-4 space-y-4">
        {questions.length === 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Generate custom quizzes on any topic using AI</p>
              <span className="px-2 py-0.5 rounded-full bg-ai-glow/15 text-ai-glow text-[10px] font-semibold">{getRemainingUses()} left</span>
            </div>
            <div className="flex gap-2">
              <Input placeholder="e.g. World War II" value={topic} onChange={(e) => setTopic(e.target.value)} className="flex-1" />
              <button onClick={handleGenerate} disabled={loading || !topic.trim()}
                className="px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              </button>
            </div>
          </>
        ) : finished ? (
          <div className="text-center space-y-4 mt-8">
            <p className="text-5xl font-bold text-primary">{score}/{questions.length}</p>
            <p className="text-lg font-semibold">{score >= 4 ? "Excellent! 🎉" : score >= 3 ? "Good job! 👍" : "Keep practicing! 💪"}</p>
            <button onClick={() => { setQuestions([]); setFinished(false); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium active:scale-95 transition-all">
              <RotateCcw className="w-4 h-4" /> New Quiz
            </button>
          </div>
        ) : q && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Q{current + 1}/{questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <p className="text-base font-semibold">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                let style = "bg-card border-border";
                if (selected !== null) {
                  if (idx === q.answer) style = "bg-success/10 border-success";
                  else if (idx === selected) style = "bg-destructive/10 border-destructive";
                }
                return (
                  <button key={idx} onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${style}`}>
                    <span className="text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <div className="space-y-3">
                <p className="text-sm bg-muted p-3 rounded-xl">{q.explanation}</p>
                <button onClick={next} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium active:scale-95 transition-all">
                  {current + 1 >= questions.length ? "See Results" : "Next Question"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <BannerAdPlaceholder />
      <RewardedAdPlaceholder show={showAd} onReward={doAICall} onClose={() => setShowAd(false)} />
      <InterstitialAdPlaceholder show={showInterstitial} onClose={() => setShowInterstitial(false)} />
    </div>
  );
};

export default AIQuizPage;
