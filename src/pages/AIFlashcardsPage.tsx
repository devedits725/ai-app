import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AIFlashcardsPage = () => {
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedIdx, setFlippedIdx] = useState<number | null>(null);

  const generate = async () => {
    if (!topic.trim()) return;
    if (!navigator.onLine) { toast.error("No internet connection"); return; }
    setLoading(true);
    // TODO: Connect to Lovable AI
    setTimeout(() => {
      setCards([
        { front: `What is ${topic}?`, back: `AI-generated answer about ${topic} coming soon.` },
        { front: `Key concept of ${topic}`, back: "AI integration pending." },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="AI Flashcard Generator" />
      <div className="flex-1 p-4 space-y-4">
        <p className="text-xs text-muted-foreground">Enter a topic to generate study flashcards with AI</p>
        <div className="flex gap-2">
          <Input placeholder="e.g. Photosynthesis" value={topic} onChange={(e) => setTopic(e.target.value)} className="flex-1" />
          <button onClick={generate} disabled={loading || !topic.trim()}
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
    </div>
  );
};

export default AIFlashcardsPage;
