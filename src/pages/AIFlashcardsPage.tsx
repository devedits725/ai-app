import { useState } from "react";
import { Sparkles, Loader2, Search, Bell, HelpCircle, LayoutGrid, Rows, RotateCw, CheckCircle, Download, Play, PlusCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import RewardedAdPlaceholder from "@/components/layout/RewardedAdPlaceholder";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses, type FlashcardData } from "@/services/aiService";
import { recordActivity } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const AIFlashcardsPage = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<FlashcardData["cards"]>([]);
  const [showAd, setShowAd] = useState(false);
  const [flippedIdx, setFlippedIdx] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
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
      const res = await callAI("flashcards", topic);
      setCards(res.cards);
      await recordActivity(user?.id, {
        title: "Flashcards Generated",
        details: `Created ${res.cards.length} cards for ${topic}`,
        type: "ai_flashcards"
      });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Flashcard Creator">
      <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full pb-24">
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">What are we studying today?</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg mb-8">Enter any topic and our AI will generate study cards for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-800">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="text-slate-400 w-5 h-5" />
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-lg py-4 placeholder:text-slate-400 outline-none"
                placeholder="e.g. Molecular Biology, French Revolution..."
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate
            </button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-xs font-bold text-slate-400 px-2 flex items-center shrink-0">Popular:</span>
            {["Cell Structure", "Linear Algebra", "Macroeconomics"].map(t => (
              <button key={t} onClick={() => setTopic(t)} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap">{t}</button>
            ))}
          </div>
        </div>

        {cards.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold flex items-center gap-2">
                Generated Cards <span className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full">{cards.length} Cards</span>
              </h4>
              <div className="flex gap-2 text-slate-400">
                <span className="px-2 py-0.5 rounded-full bg-ai-glow/15 text-ai-glow text-[10px] font-semibold">{getRemainingUses()} left</span>
                <button className="p-1 hover:text-primary transition-colors"><LayoutGrid className="w-5 h-5" /></button>
                <button className="p-1 hover:text-primary transition-colors"><Rows className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, i) => (
                <div key={i} className="h-64 [perspective:1000px] group cursor-pointer" onClick={() => setFlippedIdx(flippedIdx === i ? null : i)}>
                  <div className={cn(
                    "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
                    flippedIdx === i && "[transform:rotateY(180deg)]"
                  )}>
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center justify-center text-center">
                      <span className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {i + 1}</span>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{card.front}</p>
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold uppercase">Flip</span>
                        <RotateCw className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-primary p-8 shadow-xl shadow-primary/20 flex flex-col items-center justify-center text-center">
                      <span className="absolute top-4 left-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">Answer</span>
                      <p className="text-xl font-bold text-white mb-2">{card.back}</p>
                      <div className="absolute bottom-4 right-4 text-white/60"><CheckCircle className="w-4 h-4" /></div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50">
                <PlusCircle className="w-10 h-10 mb-2" />
                <span className="font-bold">Add Manual Card</span>
              </div>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:left-[calc(50%+128px)] z-20">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 flex gap-4 items-center">
                <button className="flex items-center gap-2 px-4 py-2 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><Download className="w-4 h-4" /> PDF</button>
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                <button className="flex items-center gap-2 px-4 py-2 font-bold text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md"><Play className="w-4 h-4" /> Practice</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <RewardedAdPlaceholder show={showAd} onReward={handleReward} onClose={() => setShowAd(false)} />
    </MainLayout>
  );
};

export default AIFlashcardsPage;
