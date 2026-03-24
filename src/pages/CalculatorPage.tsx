import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calculator, 
  Percent, 
  Tag, 
  Calendar, 
  GraduationCap
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import BasicCalculator from "@/components/calculators/BasicCalculator";
import PercentageCalculator from "@/components/calculators/PercentageCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import ExamScoreCalculator from "@/components/calculators/ExamScoreCalculator";
import Sidebar from "@/components/layout/Sidebar";

const CalculatorPage = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, session, isGuest, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const tabs = [
    { id: "basic", label: "Basic", icon: Calculator },
    { id: "percent", label: "Percentage", icon: Percent },
    { id: "discount", label: "Discount", icon: Tag },
    { id: "age", label: "Age", icon: Calendar },
    { id: "exam", label: "Exam Score", icon: GraduationCap },
  ];

  return (
    <Sidebar title="Calculators" icon={<Calculator />}>
      <div className="p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Calculators</h1>
              <p className="text-muted-foreground mt-1">Specialized tools for all your needs.</p>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          </header>

          {/* Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:border-primary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Calculator Content */}
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden p-6 lg:p-8">
            {activeTab === "basic" && <BasicCalculator />}
            {activeTab === "percent" && <PercentageCalculator />}
            {activeTab === "discount" && <DiscountCalculator />}
            {activeTab === "age" && <AgeCalculator />}
            {activeTab === "exam" && <ExamScoreCalculator />}
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

export default CalculatorPage;
