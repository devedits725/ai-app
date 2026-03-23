import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText,
  Copy,
  Loader2,
  Menu,
  Settings,
  LogOut,
  Bookmark,
  Home,
  Sparkles
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { callAI, getRemainingUses, addBonusUses } from "@/services/aiService";
import { recordActivity } from "@/services/userService";

const EssayWriterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { session, isGuest, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState("500");
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleReward = () => {
    addBonusUses(10);
    generateEssay();
  };

  const handleSubmit = async () => {
    if (!topic.trim()) {
      toast.error("Please enter an essay topic");
      return;
    }
    if (getRemainingUses() > 0) {
      generateEssay();
    } else {
      setShowAd(true);
    }
  };

  const generateEssay = async () => {
    setShowAd(false);
    setLoading(true);
    try {
      const prompt = `Write a ${wordCount}-word essay on the topic: "${topic}". 
      The essay should be well-structured with an introduction, body paragraphs, and conclusion.
      Use clear language and proper formatting with paragraphs.`;
      
      const res = await callAI<string>("essay", prompt);
      setEssay(res);
      
      await recordActivity(user?.id, {
        title: "Essay Generated",
        details: topic.slice(0, 50) + "...",
        type: "essay_writer"
      });
      
      toast.success("Essay generated successfully!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to generate essay");
    } finally {
      setLoading(false);
    }
  };

  const copyEssay = () => {
    navigator.clipboard.writeText(essay);
    toast.success("Essay copied to clipboard!");
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
              <FileText className="w-5 h-5" />
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
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Essay Writer</h1>
                <p className="text-muted-foreground mt-1">Generate structured essays on any topic.</p>
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
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="topic">Essay Topic</label>
                  <textarea
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted/50 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground outline-none p-4"
                    placeholder="Enter your essay topic here..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="wordCount">Word Count</label>
                  <select
                    id="wordCount"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    className="w-full rounded-xl border border-border bg-muted/50 focus:ring-primary focus:border-primary text-foreground outline-none p-3"
                  >
                    <option value="300">300 words</option>
                    <option value="500">500 words</option>
                    <option value="750">750 words</option>
                    <option value="1000">1000 words</option>
                    <option value="1500">1500 words</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading || !topic.trim()}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Generate Essay
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium animate-pulse">Generating your essay...</p>
            </div>
          )}

          {/* Essay Output */}
          {essay && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Generated Essay</h3>
                <button 
                  onClick={copyEssay}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Essay
                </button>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 lg:p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {essay}
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

export default EssayWriterPage;
