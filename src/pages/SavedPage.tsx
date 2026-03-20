import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bookmark, 
  Trash2, 
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
  Home,
  Wrench,
  Clock
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SavedItem {
  id: string;
  title: string;
  type: 'formula' | 'calculation' | 'conversion' | 'ai-response' | 'flashcard' | 'quiz';
  content: string;
  createdAt: string;
  category?: string;
}

const SavedPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, session, isGuest, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || isGuest) {
      navigate('/');
      return;
    }

    // Load saved items from localStorage (in production, this would be from Supabase)
    const loadSavedItems = () => {
      try {
        const stored = localStorage.getItem(`saved-items-${user?.id}`);
        const items = stored ? JSON.parse(stored) : [];
        setSavedItems(items);
      } catch (error) {
        console.error('Error loading saved items:', error);
        toast.error('Failed to load saved items');
      } finally {
        setLoading(false);
      }
    };

    loadSavedItems();
  }, [user, session, isGuest, navigate]);

  const handleDelete = (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem(`saved-items-${user?.id}`, JSON.stringify(updated));
    toast.success('Item removed from saved');
  };

  const getItemIcon = (type: SavedItem['type']) => {
    switch (type) {
      case 'formula': return BookOpen;
      case 'calculation': return Calculator;
      case 'conversion': return ArrowLeftRight;
      case 'ai-response': return MessageSquare;
      case 'flashcard': return Sparkles;
      case 'quiz': return Brain;
      default: return Bookmark;
    }
  };

  const getItemColor = (type: SavedItem['type']) => {
    switch (type) {
      case 'formula': return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case 'calculation': return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case 'conversion': return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case 'ai-response': return "bg-purple-500/10 text-purple-500";
      case 'flashcard': return "bg-violet-500/10 text-violet-500";
      case 'quiz': return "bg-fuchsia-500/10 text-fuchsia-500";
      default: return "bg-slate-500/10 text-slate-600";
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors w-full text-left"
            >
              <Wrench className="w-5 h-5" />
              Tools
            </button>
            <button 
              onClick={() => navigate("/saved")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium w-full text-left"
            >
              <Bookmark className="w-5 h-5" />
              Saved Items
            </button>
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
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Saved Items</h1>
                <p className="text-muted-foreground mt-1">
                  {savedItems.length === 0 ? 'No saved items yet' : `${savedItems.length} saved items`}
                </p>
              </div>
            </div>
          </header>

          {/* Saved Items Grid */}
          {savedItems.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No saved items</h3>
              <p className="text-muted-foreground mb-6">
                Save formulas, calculations, and AI responses to access them quickly later.
              </p>
              <button 
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Tools
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedItems.map((item) => {
                const Icon = getItemIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col gap-3 p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${getItemColor(item.type)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-base font-semibold leading-tight text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
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

export default SavedPage;
