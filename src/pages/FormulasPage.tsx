import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Menu,
  Settings,
  LogOut,
  Home,
  BookOpen
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, session, isGuest, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

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
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Formula Sheets</h1>
                <p className="text-muted-foreground mt-1">Quick reference for math, physics, and chemistry.</p>
              </div>
            </div>
          </header>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search formulas..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="math" className="flex-1 flex flex-col">
            <div className="mb-6">
              <TabsList className="w-full grid grid-cols-3">
                {subjects.map((s) => <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>)}
              </TabsList>
            </div>
            {subjects.map((subject) => (
              <TabsContent key={subject.key} value={subject.key} className="flex-1 space-y-6">
                {Object.entries(formulasData[subject.key] as Record<string, Array<{ name: string; formula: string; description: string }>>).map(([topic, formulas]) => {
                  const filtered = formulas.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.formula.toLowerCase().includes(search.toLowerCase()));
                  if (filtered.length === 0) return null;
                  return (
                    <div key={topic}>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">{topic}</h3>
                      <div className="space-y-3">
                        {filtered.map((f) => {
                          const id = `${subject.key}-${topic}-${f.name}`;
                          return (
                            <div key={id} className="p-4 rounded-xl bg-card border border-border flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold">{f.name}</p>
                                <p className="text-base font-mono text-primary mt-1">{f.formula}</p>
                                <p className="text-xs text-muted-foreground mt-2">{f.description}</p>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button onClick={() => copyFormula(f.formula)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button onClick={() => toggleBookmark(id)} className="p-2 rounded-lg hover:bg-muted transition-colors">
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

export default FormulasPage;
