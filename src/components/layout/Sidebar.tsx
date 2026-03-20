import { Link, useLocation } from "react-router-dom";
import {
  Book,
  Edit3,
  Layers,
  ClipboardList,
  ArrowLeftRight,
  Calculator
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const location = useLocation();
  const { user, isGuest } = useAuth();

  const navItems = [
    {
      title: "Homework Helper",
      path: "/ai-helper",
      icon: Edit3,
    },
    {
      title: "Flashcard Generator",
      path: "/ai-flashcards",
      icon: Layers,
    },
    {
      title: "Quiz Generator",
      path: "/ai-quiz",
      icon: ClipboardList,
    },
    {
      title: "Unit Converter",
      path: "/converter",
      icon: ArrowLeftRight,
    },
    {
      title: "Calculator",
      path: "/calculator",
      icon: Calculator,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
          <Book className="w-6 h-6" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none truncate">StudentPro</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">Your Assistant</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student User'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{isGuest ? 'Guest Mode' : 'Premium Member'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
