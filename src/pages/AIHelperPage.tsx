import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Copy, 
  Sparkles, 
  Loader2, 
  Search, 
  Bell, 
  Settings, 
  ImageIcon, 
  Mic, 
  Bookmark, 
  Share2, 
  Lightbulb,
  Menu,
  LogOut,
  Home,
  MessageSquare
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import RewardedAdPlaceholder from "@/components/layout/RewardedAdPlaceholder";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses } from "@/services/aiService";
import { recordActivity } from "@/services/userService";

const AIHelperPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { session, isGuest, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showAd, setShowAd] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleReward = () => {
    addBonusUses(10);
    doAICall();
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    if (getRemainingUses() > 0) {
      doAICall();
    } else {
      setShowAd(true);
    }
  };

  const doAICall = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const res = await callAI<string>("explain", question);
      setResult(res);
      await recordActivity(user?.id, {
        title: "Homework Helped",
        details: question.slice(0, 50) + "...",
        type: "ai_helper"
      });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
              <MessageSquare className="w-5 h-5" />
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
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">AI Homework Helper</h1>
                <p className="text-muted-foreground mt-1">Get step-by-step help with your questions.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-ai-glow/15 text-ai-glow text-xs font-bold">
                {getRemainingUses()} left
              </span>
            </div>
          </header>

          {/* Question Input */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
            <div className="p-4 lg:p-6">
              <label className="block text-sm font-semibold text-foreground mb-3" htmlFor="question">Your Question</label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/50 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground outline-none p-4"
                placeholder="Type or paste your question here..."
                rows={5}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    Image
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                    <Mic className="w-4 h-4" />
                    Voice
                  </button>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !question.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Generate Answer
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium animate-pulse">Analyzing your question...</p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Lightbulb className="text-primary w-6 h-6" />
                  Solution
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }} className="p-2 text-muted-foreground hover:text-primary bg-card border border-border rounded-lg"><Copy className="w-4 h-4" /></button>
                  <button className="p-2 text-muted-foreground hover:text-primary bg-card border border-border rounded-lg"><Bookmark className="w-4 h-4" /></button>
                  <button className="p-2 text-muted-foreground hover:text-primary bg-card border border-border rounded-lg"><Share2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 lg:p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">{result}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Questions */}
          <div className="pt-8 pb-12">
            <h3 className="font-bold text-foreground mb-4">Recent Questions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold rounded uppercase tracking-wider">Math</span>
                  <span className="text-[10px] text-muted-foreground font-medium">2h ago</span>
                </div>
                <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">Pythagorean theorem application examples...</p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">Science</span>
                  <span className="text-[10px] text-muted-foreground font-medium">1d ago</span>
                </div>
                <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">Explain photosynthesis in simple terms...</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <RewardedAdPlaceholder show={showAd} onReward={handleReward} onClose={() => setShowAd(false)} />
    </div>
  );
};

export default AIHelperPage;
