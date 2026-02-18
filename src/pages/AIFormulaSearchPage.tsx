import { useState } from "react";
import { Search, Loader2, Copy } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import RewardedAdPlaceholder from "@/components/layout/RewardedAdPlaceholder";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses, getCachedResult, type TextResult } from "@/services/aiService";

const AIFormulaSearchPage = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    const cached = getCachedResult<TextResult>("formula", query);
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
      const data = await callAI<TextResult>("formula", query);
      setResult(data.text);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Smart Formula Search" />
      <div className="flex-1 p-4 pb-20 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Describe what you need in plain English</p>
          <span className="px-2 py-0.5 rounded-full bg-ai-glow/15 text-ai-glow text-[10px] font-semibold">{getRemainingUses()} left</span>
        </div>
        <div className="flex gap-2">
          <Input placeholder='e.g. "how to find the area of a triangle"' value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
          <button onClick={handleSearch} disabled={loading || !query.trim()}
            className="px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
        {result && (
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-semibold text-muted-foreground">AI Result</span>
              <button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }} className="p-1 rounded hover:bg-secondary">
                <Copy className="w-4 h-4" />
              </button>
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

export default AIFormulaSearchPage;
