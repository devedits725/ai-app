import { useState } from "react";

const PercentageCalculator = () => {
  const [number, setNumber] = useState("");
  const [percent, setPercent] = useState("");

  const result = number && percent ? (parseFloat(number) * parseFloat(percent)) / 100 : null;

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Number</label>
          <input
            type="number"
            placeholder="e.g. 500"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold px-6 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Percentage (%)</label>
          <input
            type="number"
            placeholder="e.g. 20"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold px-6 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {result !== null && (
        <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center animate-in fade-in zoom-in-95">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">{percent}% of {number} is</p>
          <p className="text-5xl font-black text-slate-900 dark:text-white">
            {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      )}
    </div>
  );
};

export default PercentageCalculator;
