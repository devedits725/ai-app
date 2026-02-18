import { useNavigate } from "react-router-dom";
import { Settings, Calculator, BookOpen, ArrowLeftRight, Brain, ClipboardList, Sparkles, MessageSquare, Layers, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";

const modules = [
  { title: "Calculator Tools", subtitle: "Math made easy", icon: Calculator, path: "/calculator", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { title: "Formula Sheets", subtitle: "Quick reference", icon: BookOpen, path: "/formulas", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { title: "Unit Converter", subtitle: "Instant convert", icon: ArrowLeftRight, path: "/converter", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { title: "Flashcards", subtitle: "Study & revise", icon: Layers, path: "/flashcards", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  { title: "Practice Quiz", subtitle: "Test yourself", icon: ClipboardList, path: "/quiz", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  { title: "AI Homework Helper", subtitle: "Step-by-step help", icon: MessageSquare, path: "/ai-helper", color: "bg-purple-500/10 text-purple-500", ai: true },
  { title: "AI Flashcard Gen", subtitle: "Generate cards", icon: Sparkles, path: "/ai-flashcards", color: "bg-violet-500/10 text-violet-500", ai: true },
  { title: "AI Quiz Gen", subtitle: "Custom quizzes", icon: Brain, path: "/ai-quiz", color: "bg-fuchsia-500/10 text-fuchsia-500", ai: true },
  { title: "Smart Formula Search", subtitle: "Ask in plain English", icon: Search, path: "/ai-formula-search", color: "bg-indigo-500/10 text-indigo-500", ai: true },
];

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between safe-top">
        <div>
          <h1 className="text-xl font-bold">📚 Student Toolkit</h1>
          <p className="text-xs text-muted-foreground">Your pocket study companion</p>
        </div>
        <button onClick={() => navigate("/settings")} className="p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Module Grid */}
      <main className="px-4 pb-20 pt-2 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {modules.map((mod) => (
            <button
              key={mod.path}
              onClick={() => navigate(mod.path)}
              className="relative flex flex-col items-start gap-2 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md active:animate-card-press transition-all text-left"
            >
              {mod.ai && (
                <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-ai-glow/15 text-ai-glow">
                  AI
                </span>
              )}
              <div className={`p-2 rounded-xl ${mod.color}`}>
                <mod.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{mod.title}</p>
                <p className="text-[11px] text-muted-foreground">{mod.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      <BannerAdPlaceholder />
    </div>
  );
};

export default Index;
