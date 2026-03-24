import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu,
  Settings,
  LogOut,
  Bookmark,
  Home,
  Wrench
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
}

const Sidebar = ({ children, icon, title }: SidebarProps) => {
  const { user, session, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <aside className={`w-64 border-r border-border bg-card hidden lg:flex flex-col fixed h-full z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-primary-foreground">
            {icon || <Wrench className="w-5 h-5" />}
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Student Toolkit</h1>
        </div>
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
    </div>

    {/* Mobile Menu Button */}
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border"
    >
      <Menu className="w-5 h-5" />
    </button>

    {/* Mobile overlay */}
    {sidebarOpen && (
      <div 
        className="lg:hidden fixed inset-0 bg-black/50 z-30"
        onClick={() => setSidebarOpen(false)}
      />
    )}
  </aside>
);

export default Sidebar;
