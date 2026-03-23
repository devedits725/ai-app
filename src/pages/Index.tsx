import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Calculator, 
  BookOpen, 
  ArrowLeftRight, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Search, 
  Menu,
  Settings,
  LogOut,
  Bookmark,
  Home,
  Wrench
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const modules = [
  { title: "Calculator Tools", subtitle: "Math made easy", icon: Calculator, path: "/calculator", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { title: "Formula Sheets", subtitle: "Quick reference", icon: BookOpen, path: "/formulas", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { title: "Unit Converter", subtitle: "Instant convert", icon: ArrowLeftRight, path: "/converter", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { title: "AI Homework Helper", subtitle: "Step-by-step help", icon: MessageSquare, path: "/ai-helper", color: "bg-purple-500/10 text-purple-500", ai: true },
  { title: "AI Flashcard Gen", subtitle: "Generate cards", icon: Sparkles, path: "/ai-flashcards", color: "bg-violet-500/10 text-violet-500", ai: true },
  { title: "AI Quiz Gen", subtitle: "Custom quizzes", icon: Brain, path: "/ai-quiz", color: "bg-fuchsia-500/10 text-fuchsia-500", ai: true },
  { title: "Smart Formula Search", subtitle: "Ask in plain English", icon: Search, path: "/ai-formula-search", color: "bg-indigo-500/10 text-indigo-500", ai: true },
];

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, session, isGuest, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Student Toolkit</h1>
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium w-full text-left"
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
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isGuest ? 'Browse our tools or sign up to track progress' : 'Choose a tool to get started'}
                </p>
              </div>
            </div>
          </header>

          {/* Module Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => (
              <button
                key={mod.path}
                onClick={() => navigate(mod.path)}
                className="relative flex flex-col items-start gap-3 p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md active:scale-95 transition-all text-left group"
              >
                {mod.ai && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-ai-glow/15 text-ai-glow">
                    AI
                  </span>
                )}
                <div className={`p-3 rounded-xl ${mod.color} group-hover:scale-110 transition-transform`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-semibold leading-tight">{mod.title}</p>
                  <p className="text-sm text-muted-foreground">{mod.subtitle}</p>
                </div>
              </button>
            ))}
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
    </div>
  );
};

export default Index;
