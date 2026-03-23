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
  Home,
  Code,
  Terminal
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses } from "@/services/aiService";
import { recordActivity } from "@/services/userService";

const CodeDebuggerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { session, isGuest, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleReward = () => {
    addBonusUses(10);
    debugCode();
  };

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
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r border-border bg-card hidden lg:flex flex-col fixed h-full z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-primary-foreground">
              <Bug className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Student Toolkit</h1>
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors w-full text-left"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            {session && !isGuest && (
              <button 
                onClick={() => navigate("/saved")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors w-full text-left"
              >
                <Bookmark className="w-5 h-5" />
                Saved Items
              </button>
            )}
            <button 
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors w-full text-left"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
            {session && !isGuest && (
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}
          </nav>
        </div>
        <div className="mt-auto p-4 m-4 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isGuest ? 'Guest Mode' : 'Logged In'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {/* Header */}
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
