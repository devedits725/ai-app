import { useState } from "react";
import { Delete } from "lucide-react";

const BasicCalculator = () => {
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
    setHistory((h) => [...h.slice(-4), `${prevVal} ${op} ${cur} = ${result}`]);
    setDisplay(String(result));
    setPrevVal(null);
    setOp(null);
    setFresh(true);
  };

  const calc = (a: number, b: number, o: string) => {
    if (o === "+") return a + b;
    if (o === "-") return a - b;
    if (o === "×") return a * b;
    if (o === "÷") return b !== 0 ? a / b : 0;
    return b;
  };

  const btn = "flex items-center justify-center rounded-xl text-lg font-medium h-14 active:scale-95 transition-all";

  return (
    <div className="space-y-3">
      {history.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-0.5 max-h-16 overflow-y-auto">
          {history.map((h, i) => <p key={i}>{h}</p>)}
        </div>
      )}
      <div className="bg-card border border-border rounded-2xl p-4 text-right text-3xl font-mono font-bold truncate">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className={`${btn} bg-destructive/10 text-destructive`}>C</button>
        <button onClick={() => setDisplay((d) => d.slice(0, -1) || "0")} className={`${btn} bg-secondary`}><Delete className="w-5 h-5" /></button>
        <button onClick={() => operate("÷")} className={`${btn} bg-primary/10 text-primary`}>÷</button>
        <button onClick={() => operate("×")} className={`${btn} bg-primary/10 text-primary`}>×</button>
        {["7","8","9"].map(n => <button key={n} onClick={() => input(n)} className={`${btn} bg-secondary`}>{n}</button>)}
        <button onClick={() => operate("-")} className={`${btn} bg-primary/10 text-primary`}>−</button>
        {["4","5","6"].map(n => <button key={n} onClick={() => input(n)} className={`${btn} bg-secondary`}>{n}</button>)}
        <button onClick={() => operate("+")} className={`${btn} bg-primary/10 text-primary`}>+</button>
        {["1","2","3"].map(n => <button key={n} onClick={() => input(n)} className={`${btn} bg-secondary`}>{n}</button>)}
        <button onClick={equals} className={`${btn} bg-primary text-primary-foreground row-span-2`}>=</button>
        <button onClick={() => input("0")} className={`${btn} bg-secondary col-span-2`}>0</button>
        <button onClick={decimal} className={`${btn} bg-secondary`}>.</button>
      </div>
    </div>
  );
};

export default BasicCalculator;
