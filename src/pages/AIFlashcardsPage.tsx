import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import RewardedAdPlaceholder from "@/components/layout/RewardedAdPlaceholder";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses, getCachedResult, type FlashcardData } from "@/services/aiService";

const AIFlashcardsPage = () => {
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedIdx, setFlippedIdx] = useState<number | null>(null);
  const [showAd, setShowAd] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const prompt = `Generate 8 flashcards about: ${topic}`;
    const cached = getCachedResult<FlashcardData>("flashcards", prompt);
    if (cached) {
      setCards(cached.cards);
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
    const prompt = `Generate 8 flashcards about: ${topic}`;
    setShowAd(false);
    setLoading(true);
    try {
      const data = await callAI<FlashcardData>("flashcards", prompt);
      setCards(data.cards || []);
      // Save to localStorage for offline
      const saved = JSON.parse(localStorage.getItem("ai-flashcards-saved") || "{}");
      saved[topic] = data.cards;
      localStorage.setItem("ai-flashcards-saved", JSON.stringify(saved));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="AI Flashcard Generator" />
      <div className="flex-1 p-4 pb-20 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Enter a topic to generate study flashcards with AI</p>
          <span className="px-2 py-0.5 rounded-full bg-ai-glow/15 text-ai-glow text-[10px] font-semibold">{getRemainingUses()} left</span>
        </div>
        <div className="flex gap-2">
          <Input placeholder="e.g. Photosynthesis" value={topic} onChange={(e) => setTopic(e.target.value)} className="flex-1" />
          <button onClick={handleGenerate} disabled={loading || !topic.trim()}
            className="px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>
        {cards.length > 0 && (
          <div className="space-y-2">
            {cards.map((c, i) => (
              <button key={i} onClick={() => setFlippedIdx(flippedIdx === i ? null : i)}
                className="w-full p-4 rounded-xl bg-card border border-border text-left active:scale-[0.99] transition-all">
                <p className="text-xs text-muted-foreground">{flippedIdx === i ? "Answer" : "Question"}</p>
                <p className="text-sm font-medium mt-1">{flippedIdx === i ? c.back : c.front}</p>
              </button>
            ))}
          </div>
        )}
      </div>
      <BannerAdPlaceholder />
      <RewardedAdPlaceholder show={showAd} onReward={handleReward} onClose={() => setShowAd(false)} />
    </div>
  );
};

export default AIFlashcardsPage;
