import { useState } from "react";

const ExamScoreCalculator = () => {
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");

  const pct = obtained && total && parseFloat(total) > 0 ? (parseFloat(obtained) / parseFloat(total)) * 100 : null;

  const getGrade = (p: number) => {
    if (p >= 90) return { label: "A+", color: "text-green-500", bg: "bg-green-500/5", border: "border-green-500/10" };
    if (p >= 80) return { label: "A", color: "text-green-500", bg: "bg-green-500/5", border: "border-green-500/10" };
    if (p >= 70) return { label: "B", color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/10" };
    if (p >= 60) return { label: "C", color: "text-yellow-500", bg: "bg-yellow-500/5", border: "border-yellow-500/10" };
    if (p >= 50) return { label: "D", color: "text-orange-500", bg: "bg-orange-500/5", border: "border-orange-500/10" };
    return { label: "F", color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/10" };
  };

  const grade = pct !== null ? getGrade(pct) : null;

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Marks Obtained</label>
          <input
            type="number"
            placeholder="e.g. 85"
            value={obtained}
            onChange={(e) => setObtained(e.target.value)}
            className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold px-6 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Total Marks</label>
          <input
            type="number"
            placeholder="e.g. 100"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold px-6 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {pct !== null && grade && (
        <div className="space-y-4 animate-in fade-in zoom-in-95">
          <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Your Percentage</p>
            <p className="text-5xl font-black text-slate-900 dark:text-white">{pct.toFixed(1)}%</p>
          </div>
          <div className={`p-6 rounded-2xl ${grade.bg} ${grade.border} border text-center`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Final Grade</p>
            <p className={`text-4xl font-black ${grade.color}`}>{grade.label}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamScoreCalculator;
