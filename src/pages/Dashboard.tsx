import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Book, 
  Calendar, 
  BarChart3, 
  Settings, 
  Search, 
  Brain, 
  Layers, 
  HelpCircle, 
  FileText, 
  CheckCircle, 
  Zap, 
  MoreVertical,
  Menu,
  Calculator,
  BookOpen,
  ArrowLeftRight,
  ClipboardList,
  Sparkles,
  MessageSquare,
  Search as SearchIcon
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const quickTools = [
    {
      title: "Homework Helper",
      subtitle: "AI-powered problem solver",
      icon: Brain,
      color: "bg-orange-100 dark:bg-orange-500/10 text-orange-600",
      path: "/ai-helper"
    },
    {
      title: "Flashcard Gen",
      subtitle: "Create sets in seconds",
      icon: Layers,
      color: "bg-blue-100 dark:bg-blue-500/10 text-blue-600",
      path: "/ai-flashcards"
    },
    {
      title: "Quiz Gen",
      subtitle: "Test your knowledge",
      icon: ClipboardList,
      color: "bg-purple-100 dark:bg-purple-500/10 text-purple-600",
      path: "/ai-quiz"
    },
    {
      title: "Formula Search",
      subtitle: "Instant lookup tool",
      icon: SearchIcon,
      color: "bg-green-100 dark:bg-green-500/10 text-green-600",
      path: "/ai-formula-search"
    }
  ];

  const recentActivity = [
    {
      title: "Molecular Biology Flashcards",
      time: "Generated 2 hours ago",
      details: "45 cards",
      icon: FileText,
      color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
    },
    {
      title: "Advanced Calculus Problem #42",
      time: "Solved 5 hours ago",
      details: "Step-by-step active",
      icon: HelpCircle,
      color: "bg-orange-50 dark:bg-orange-500/10 text-orange-600"
    },
    {
      title: "Ancient History Quiz (Rome)",
      time: "Completed yesterday",
      details: "Score: 92%",
      icon: CheckCircle,
      color: "bg-purple-50 dark:bg-purple-500/10 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r border-primary/10 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
              <Book className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">EduBoost</h1>
          </div>
          <nav className="space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium" href="#">
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">
              <BookOpen className="w-5 h-5" />
              My Library
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">
              <Calendar className="w-5 h-5" />
              Study Plans
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </a>
            <button 
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full text-left"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
        </div>
        <div className="mt-auto p-4 m-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Student User</p>
              <p className="text-xs text-primary font-medium">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen">
        {/* Header / Hero Section */}
        <header className="p-6 lg:p-8 pb-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back! 👋</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Ready to crush your study goals today?</p>
              </div>
              <div className="flex-1 max-w-md">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input 
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm" 
                    placeholder="Search notes, formulas, or flashcards..." 
                    type="text"
                  />
                </div>
              </div>
            </div>

            {/* Stats / Weekly Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">Weekly Focus</span>
                  <span className="text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded text-xs font-bold">+12%</span>
                </div>
                <div className="text-2xl font-bold mb-4">24.5 Hours</div>
                <div className="flex items-end gap-1 h-12">
                  <div className="bg-primary/20 w-full rounded-t-sm h-[40%]"></div>
                  <div className="bg-primary/20 w-full rounded-t-sm h-[60%]"></div>
                  <div className="bg-primary/20 w-full rounded-t-sm h-[30%]"></div>
                  <div className="bg-primary/20 w-full rounded-t-sm h-[80%]"></div>
                  <div className="bg-primary w-full rounded-t-sm h-[95%]"></div>
                  <div className="bg-primary/20 w-full rounded-t-sm h-[50%]"></div>
                  <div className="bg-primary/20 w-full rounded-t-sm h-[70%]"></div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">Cards Mastered</span>
                  <span className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-bold">84%</span>
                </div>
                <div className="text-2xl font-bold mb-2">1,240</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[84%]"></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">150 more to reach next milestone</p>
              </div>
              <div className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary-100 text-sm font-medium opacity-80">Daily Goal</span>
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold mb-2">4 / 5 Tasks</div>
                <p className="text-sm text-white/80">Finish your biology quiz to complete streak!</p>
                <button className="mt-4 w-full py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors">
                  Finish Now
                </button>
              </div>
            </div>

            {/* Quick Tools Grid */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickTools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(tool.path)}
                    className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all text-left"
                  >
                    <div className={`size-12 rounded-xl ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{tool.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tool.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                <button className="text-primary text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className={`size-10 rounded-lg ${activity.color} flex items-center justify-center shrink-0`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                      <p className="text-xs text-slate-500">{activity.time} • {activity.details}</p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-primary">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
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

export default Dashboard;
