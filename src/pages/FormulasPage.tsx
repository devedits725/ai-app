import { useState, useMemo } from "react";
import { Search, Bookmark, BookmarkCheck, Copy } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import formulasData from "@/data/formulas.json";

const subjects = [
  { key: "math", label: "Math" },
  { key: "physics", label: "Physics" },
  { key: "chemistry", label: "Chemistry" },
] as const;

const FormulasPage = () => {
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("formula-bookmarks") || "[]"); } catch { return []; }
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      localStorage.setItem("formula-bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const copyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    toast.success("Formula copied!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Formula Sheets" />
      <div className="px-4 pt-2 relative">
        <Search className="absolute left-7 top-5 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search formulas..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <Tabs defaultValue="math" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-3">
            {subjects.map((s) => <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>)}
          </TabsList>
        </div>
        {subjects.map((subject) => (
          <TabsContent key={subject.key} value={subject.key} className="flex-1 p-4 space-y-4">
            {Object.entries(formulasData[subject.key] as Record<string, Array<{ name: string; formula: string; description: string }>>).map(([topic, formulas]) => {
              const filtered = formulas.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.formula.toLowerCase().includes(search.toLowerCase()));
              if (filtered.length === 0) return null;
              return (
                <div key={topic}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">{topic}</h3>
                  <div className="space-y-2">
                    {filtered.map((f) => {
                      const id = `${subject.key}-${topic}-${f.name}`;
                      return (
                        <div key={id} className="p-3 rounded-xl bg-card border border-border flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{f.name}</p>
                            <p className="text-base font-mono text-primary mt-0.5">{f.formula}</p>
                            <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => copyFormula(f.formula)} className="p-1.5 rounded-lg hover:bg-secondary"><Copy className="w-4 h-4" /></button>
                            <button onClick={() => toggleBookmark(id)} className="p-1.5 rounded-lg hover:bg-secondary">
                              {bookmarks.includes(id) ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
      <BannerAdPlaceholder />
    </div>
  );
};

export default FormulasPage;
