import { useState } from "react";
import { Search, Loader2, Copy } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AIFormulaSearchPage = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    if (!navigator.onLine) { toast.error("No internet connection"); return; }
    setLoading(true);
    // TODO: Connect to Lovable AI
    setTimeout(() => {
      setResult(`AI formula search coming soon! This will find the best formula for "${query}" and explain each variable.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Smart Formula Search" />
      <div className="flex-1 p-4 space-y-4">
        <p className="text-xs text-muted-foreground">Describe what you need in plain English</p>
        <div className="flex gap-2">
          <Input placeholder='e.g. "how to find the area of a triangle"' value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
          <button onClick={search} disabled={loading || !query.trim()}
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
            <p className="text-sm">{result}</p>
          </div>
        )}
      </div>
      <BannerAdPlaceholder />
    </div>
  );
};

export default AIFormulaSearchPage;
