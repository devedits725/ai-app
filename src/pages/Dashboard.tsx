import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Zap, 
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Brain,
  Calculator,
  ArrowLeftRight,
  Loader2
} from "lucide-react";
import { fetchUserStats, fetchUserActivity } from "@/services/userService";

const Dashboard = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    focusHours: 12.4,
    focusChange: 15,
    cardsMastered: 1240,
    cardsProgress: 82,
    dailyTasksCompleted: 4,
    dailyTasksTotal: 5
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await fetchUserStats(user?.id);
        if (stats) {
          setWeeklyStats(prev => ({
            ...prev,
            dailyTasksCompleted: stats.dailyTasksCompleted ?? 0,
            dailyTasksTotal: stats.dailyTasksTotal ?? 5
          }));
        }
        const activity = await fetchUserActivity(user?.id);
        setRecentActivity(activity || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const quickTools = [
    { title: "AI Helper", subtitle: "Homework assistant", icon: Brain, path: "/ai-helper", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
    { title: "Quiz Gen", subtitle: "Custom practice", icon: Target, path: "/ai-quiz", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { title: "Calculator", subtitle: "Math tools", icon: Calculator, path: "/calculator", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
    { title: "Converter", subtitle: "Unit conversion", icon: ArrowLeftRight, path: "/converter", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" }
  ];

  return (
    <MainLayout title="Student Dashboard">
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-12 pb-20">
        <header>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}! 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isGuest ? 'Browse our tools or sign up to track progress' : 'Ready to crush your study goals today?'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm font-medium">Weekly Focus</span>
              <span className="text-sm font-bold px-2 py-1 rounded text-green-500 bg-green-50 dark:bg-green-500/10">+15%</span>
            </div>
            <div className="text-2xl font-bold mb-4">12.4 Hours</div>
            <div className="flex items-end gap-1 h-12">
              {[40, 60, 30, 80, 95, 50, 70].map((h, i) => (
                <div key={i} className={`w-full rounded-t-sm ${i === 4 ? 'bg-primary' : 'bg-primary/20'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm font-medium">Cards Mastered</span>
              <span className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-bold">82%</span>
            </div>
            <div className="text-2xl font-bold mb-2">1,240</div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[82%]"></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">260 more to reach next milestone</p>
          </div>
          <div className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-primary/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary-100 text-sm font-medium opacity-80">Daily Goal</span>
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-2">{weeklyStats.dailyTasksCompleted} / {weeklyStats.dailyTasksTotal} Tasks</div>
            <p className="text-sm text-white/80">
              {weeklyStats.dailyTasksCompleted < weeklyStats.dailyTasksTotal ? 'Complete your streak!' : 'Great job today!'}
            </p>
            <button onClick={() => navigate('/ai-quiz')} className="mt-4 w-full py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors">Practice Now</button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTools.map((tool, index) => (
              <button key={index} onClick={() => navigate(tool.path)} className="group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all text-left">
                <div className={`size-12 rounded-xl ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><tool.icon className="w-6 h-6" /></div>
                <h4 className="font-bold text-slate-900 dark:text-white">{tool.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{tool.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <button onClick={() => navigate('/settings')} className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400"><Loader2 className="w-8 h-8 animate-spin mb-2" /><p className="text-sm">Loading...</p></div>
            ) : recentActivity.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm italic">No recent activity.</div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.details}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
