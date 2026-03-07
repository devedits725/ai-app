import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Calculator, Percent, Tag, Calendar, GraduationCap } from "lucide-react";
import BasicCalculator from "@/components/calculators/BasicCalculator";
import PercentageCalculator from "@/components/calculators/PercentageCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import ExamScoreCalculator from "@/components/calculators/ExamScoreCalculator";

const CalculatorPage = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    { id: "basic", label: "Basic", icon: Calculator },
    { id: "percent", label: "Percentage", icon: Percent },
    { id: "discount", label: "Discount", icon: Tag },
    { id: "age", label: "Age", icon: Calendar },
    { id: "exam", label: "Exam Score", icon: GraduationCap },
  ];

  return (
    <MainLayout title="Calculators">
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 pb-20">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Calculators</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Specialized tools for all your needs.</p>
        </div>

        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
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
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-6 lg:p-8">
          {activeTab === "basic" && <BasicCalculator />}
          {activeTab === "percent" && <PercentageCalculator />}
          {activeTab === "discount" && <DiscountCalculator />}
          {activeTab === "age" && <AgeCalculator />}
          {activeTab === "exam" && <ExamScoreCalculator />}
        </div>
      </div>
    </MainLayout>
  );
};

export default CalculatorPage;
