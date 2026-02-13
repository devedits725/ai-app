import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AIQuizPage = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    if (!navigator.onLine) { toast.error("No internet connection"); return; }
    setLoading(true);
    // TODO: Connect to Lovable AI
    setTimeout(() => { setGenerated(true); setLoading(false); }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="AI Quiz Generator" />
      <div className="flex-1 p-4 space-y-4">
        <p className="text-xs text-muted-foreground">Generate custom quizzes on any topic using AI</p>
        <div className="flex gap-2">
          <Input placeholder="e.g. World War II" value={topic} onChange={(e) => setTopic(e.target.value)} className="flex-1" />
          <button onClick={generate} disabled={loading || !topic.trim()}
            className="px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          </button>
        </div>
        {generated && (
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <p className="text-sm text-muted-foreground">AI quiz generation coming soon! This will create custom MCQ quizzes on "{topic}".</p>
          </div>
        )}
      </div>
      <BannerAdPlaceholder />
    </div>
  );
};

export default AIQuizPage;
