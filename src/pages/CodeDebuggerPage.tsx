import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bug,
  Copy,
  Loader2,
  Menu,
  Settings,
  LogOut,
  Bookmark,
  Terminal
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { callAI, getRemainingUses, addBonusUses } from "@/services/aiService";
import { recordActivity } from "@/services/userService";
import Sidebar from "@/components/layout/Sidebar";
import { toast } from "sonner";

const CodeDebuggerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to debug");
      return;
    }
    if (getRemainingUses() > 0) {
      debugCode();
    } else {
      setShowAd(true);
    }
  };

  const handleReward = () => {
    addBonusUses(10);
    debugCode();
  };

  const debugCode = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const prompt = `Programming Language: ${language}\n\nCode to debug:\n\`\`\`${language}\n${code}\n\`\`\``;
      
      const res = await callAI<string>("debug", prompt);
      setAnalysis(res);
      
      await recordActivity(user?.id, {
        title: "Code Debugged",
        details: `${language} code analysis`,
        type: "code_debugger"
      });
      
      toast.success("Code analysis completed!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to analyze code");
    } finally {
      setLoading(false);
    }
  };

  const copyAnalysis = () => {
    navigator.clipboard.writeText(analysis);
    toast.success("Analysis copied to clipboard!");
  };

  const handleSignOut = async () => {
    await useAuth().signOut();
    navigate('/auth');
  };

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "typescript", label: "TypeScript" },
  ];

  return (
    <Sidebar title="Code Debugger" icon={<Terminal />}>
      <div className="p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Code Debugger</h1>
              <p className="text-muted-foreground mt-1">Analyze and debug your code with AI assistance.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-ai-glow/15 text-ai-glow text-xs font-bold">
              {getRemainingUses()} left
            </span>
          </div>
        </header>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-4 lg:p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Programming Language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 focus:ring-primary focus:border-primary/20 text-foreground"
                {getRemainingUses()} left
              </span>
            </div>
          </header>

          {/* Input Section */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
            <div className="p-4 lg:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="language">Programming Language</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted/50 focus:ring-primary focus:border-primary text-foreground outline-none p-3"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="code">Code to Debug</label>
                  <textarea
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted/50 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground outline-none p-4 font-mono text-sm"
                    placeholder="Paste your code here..."
                    rows={12}
                    spellCheck={false}
                  />
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading || !code.trim()}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
                Analyze Code
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium animate-pulse">Analyzing your code...</p>
            </div>
          )}

          {/* Analysis Output */}
          {analysis && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Bug className="text-primary w-6 h-6" />
                  Code Analysis
                </h3>
                <button 
                  onClick={copyAnalysis}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Analysis
                </button>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 lg:p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="text-foreground whitespace-pre-wrap leading-relaxed font-mono text-sm">
                    {analysis}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CodeDebuggerPage;
