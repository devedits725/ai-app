import { useState, useMemo } from "react";
import { Shuffle, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import flashcardsData from "@/data/flashcards.json";

const categories = Object.keys(flashcardsData) as Array<keyof typeof flashcardsData>;

const FlashcardsPage = () => {
  const [category, setCategory] = useState(categories[0]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [known, setKnown] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("flashcard-progress") || "{}"); } catch { return {}; }
  });

  const cards = useMemo(() => {
    const base = [...flashcardsData[category]];
    return shuffled ? base.sort(() => Math.random() - 0.5) : base;
  }, [category, shuffled]);

  const card = cards[index];
  const cardId = `${category}-${card?.front}`;

  const markKnown = (isKnown: boolean) => {
    const next = { ...known, [cardId]: isKnown };
    setKnown(next);
    localStorage.setItem("flashcard-progress", JSON.stringify(next));
    goNext();
  };

  const goNext = () => { setFlipped(false); setIndex((i) => (i + 1) % cards.length); };
  const goPrev = () => { setFlipped(false); setIndex((i) => (i - 1 + cards.length) % cards.length); };

  const knownCount = cards.filter((c) => known[`${category}-${c.front}`] === true).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Flashcards" />
      <div className="px-4 pt-2 flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => { setCategory(cat); setIndex(0); setFlipped(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${category === cat ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        <div className="text-xs text-muted-foreground">{index + 1} / {cards.length} · {knownCount} known</div>

        <button onClick={() => setFlipped(!flipped)}
          className="w-full max-w-sm aspect-[3/2] rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center p-6 active:scale-[0.98] transition-all"
          style={{ perspective: "1000px" }}>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">{flipped ? "Answer" : "Question"}</p>
            <p className="text-lg font-semibold">{flipped ? card?.back : card?.front}</p>
          </div>
        </button>
        <p className="text-xs text-muted-foreground">Tap card to flip</p>

        <div className="flex items-center gap-4">
          <button onClick={goPrev} className="p-2 rounded-xl bg-secondary active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => markKnown(false)} className="p-2 rounded-xl bg-destructive/10 text-destructive active:scale-95"><X className="w-5 h-5" /></button>
          <button onClick={() => markKnown(true)} className="p-2 rounded-xl bg-success/10 text-success active:scale-95"><Check className="w-5 h-5" /></button>
          <button onClick={goNext} className="p-2 rounded-xl bg-secondary active:scale-95"><ChevronRight className="w-5 h-5" /></button>
        </div>

        <button onClick={() => { setShuffled(!shuffled); setIndex(0); setFlipped(false); }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Shuffle className="w-3.5 h-3.5" /> {shuffled ? "Unshuffle" : "Shuffle"}
        </button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
