import { useState } from "react";
import { Send, Copy, Loader2, Wifi, WifiOff } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import RewardedAdPlaceholder from "@/components/layout/RewardedAdPlaceholder";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses, getCachedResult, type TextResult } from "@/services/aiService";

const AIHelperPage = () => {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const handleSubmit = () => {
    if (!question.trim()) return;
    const cached = getCachedResult<TextResult>("explain", question);
    if (cached) {
      setResult(cached.text);
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
    setShowAd(false);
    setLoading(true);
    try {
      const data = await callAI<TextResult>("explain", question);
      setResult(data.text);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="AI Homework Helper" />
      <div className="flex-1 p-4 pb-20 space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {navigator.onLine ? <Wifi className="w-3.5 h-3.5 text-success" /> : <WifiOff className="w-3.5 h-3.5 text-destructive" />}
          <span>{navigator.onLine ? "Online" : "Offline"}</span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-ai-glow/15 text-ai-glow text-[10px] font-semibold">
            {getRemainingUses()} uses left today
          </span>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your homework question here..."
          className="w-full h-32 p-3 rounded-xl bg-card border border-border resize-none text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button onClick={handleSubmit} disabled={loading || !question.trim()}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? "Thinking..." : "Get Explanation"}
        </button>
        {result && (
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-muted-foreground">AI Response</p>
              <button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
                className="p-1 rounded hover:bg-secondary"><Copy className="w-4 h-4" /></button>
            </div>
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
      <BannerAdPlaceholder />
      <RewardedAdPlaceholder show={showAd} onReward={handleReward} onClose={() => setShowAd(false)} />
    </div>
  );
};

export default AIHelperPage;
