import { useState } from "react";
import { Delete } from "lucide-react";
import { recordActivity } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

const BasicCalculator = () => {
  const { user } = useAuth();
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const input = (val: string) => {
    if (fresh) { setDisplay(val); setFresh(false); }
    else setDisplay((d) => (d === "0" ? val : d + val));
  };

  const decimal = () => { if (!display.includes(".")) setDisplay(display + "."); setFresh(false); };

  const clear = () => { setDisplay("0"); setPrevVal(null); setOp(null); setFresh(true); };

  const operate = (nextOp: string) => {
    const cur = parseFloat(display);
    if (prevVal !== null && op) {
      const result = calc(prevVal, cur, op);
      setHistory((h) => [...h.slice(-4), `${prevVal} ${op} ${cur} = ${result}`]);
      setDisplay(String(result));
      setPrevVal(result);
    } else {
      setPrevVal(cur);
    }
    setOp(nextOp);
    setFresh(true);
  };

  const equals = () => {
    if (prevVal === null || !op) return;
    const cur = parseFloat(display);
    const result = calc(prevVal, cur, op);
    const expression = `${prevVal} ${op} ${cur} = ${result}`;
    setHistory((h) => [...h.slice(-4), expression]);
    setDisplay(String(result));
    setPrevVal(null);
    setOp(null);
    setFresh(true);

    recordActivity(user?.id, {
      title: "Calculator Used",
      details: expression,
      type: "calculator_used"
    });
  };

  const calc = (a: number, b: number, o: string) => {
    if (o === "+") return a + b;
    if (o === "-") return a - b;
    if (o === "×") return a * b;
    if (o === "÷") return b !== 0 ? a / b : 0;
    return b;
  };

  const btn = "flex items-center justify-center rounded-2xl text-xl font-bold h-16 active:scale-95 transition-all shadow-sm";

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <div className="h-12 overflow-y-auto text-right px-4 space-y-1">
          {history.map((h, i) => (
            <p key={i} className="text-sm font-medium text-slate-400 dark:text-slate-500">{h}</p>
          ))}
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 text-right text-5xl font-black tracking-tight text-slate-900 dark:text-white truncate">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <button onClick={clear} className={`${btn} bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100`}>AC</button>
        <button onClick={() => setDisplay((d) => d.slice(0, -1) || "0")} className={`${btn} bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200`}><Delete className="w-6 h-6" /></button>
        <button onClick={() => operate("÷")} className={`${btn} bg-primary/10 text-primary hover:bg-primary/20 text-2xl`}>÷</button>
        <button onClick={() => operate("×")} className={`${btn} bg-primary/10 text-primary hover:bg-primary/20 text-2xl`}>×</button>

        {["7","8","9"].map(n => <button key={n} onClick={() => input(n)} className={`${btn} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary`}>{n}</button>)}
        <button onClick={() => operate("-")} className={`${btn} bg-primary/10 text-primary hover:bg-primary/20 text-2xl`}>−</button>

        {["4","5","6"].map(n => <button key={n} onClick={() => input(n)} className={`${btn} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary`}>{n}</button>)}
        <button onClick={() => operate("+")} className={`${btn} bg-primary/10 text-primary hover:bg-primary/20 text-2xl`}>+</button>

        {["1","2","3"].map(n => <button key={n} onClick={() => input(n)} className={`${btn} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary`}>{n}</button>)}
        <button onClick={equals} className={`${btn} bg-primary text-white shadow-lg shadow-primary/30 row-span-2 h-full text-2xl`}>=</button>

        <button onClick={() => input("0")} className={`${btn} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary col-span-2`}>0</button>
        <button onClick={decimal} className={`${btn} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary`}>.</button>
      </div>
    </div>
  );
};

export default BasicCalculator;
