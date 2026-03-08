import { useState } from "react";
import { differenceInYears, differenceInMonths, differenceInDays, isValid } from "date-fns";

const AgeCalculator = () => {
  const [dob, setDob] = useState("");
  const today = new Date();
  const birthDate = dob ? new Date(dob) : null;
  const valid = birthDate && isValid(birthDate) && birthDate < today;

  const years = valid ? differenceInYears(today, birthDate) : 0;
  const months = valid ? differenceInMonths(today, birthDate) % 12 : 0;
  const days = valid ? differenceInDays(today, new Date(today.getFullYear(), today.getMonth() - (differenceInMonths(today, birthDate)), birthDate.getDate())) : 0;

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold px-6 outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {valid && (
        <div className="space-y-4 animate-in fade-in zoom-in-95">
          <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Your Current Age</p>
            <p className="text-5xl font-black text-slate-900 dark:text-white">{years} Years</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Months</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{months}</p>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Days</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{Math.max(0, days)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
