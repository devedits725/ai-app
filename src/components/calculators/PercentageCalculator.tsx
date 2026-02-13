import { useState } from "react";
import { Input } from "@/components/ui/input";

const PercentageCalculator = () => {
  const [number, setNumber] = useState("");
  const [percent, setPercent] = useState("");

  const result = number && percent ? (parseFloat(number) * parseFloat(percent)) / 100 : null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Percentage Calculator</h2>
      <div className="space-y-3">
        <Input type="number" placeholder="Enter number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <Input type="number" placeholder="Enter percentage (%)" value={percent} onChange={(e) => setPercent(e.target.value)} />
      </div>
      {result !== null && (
        <div className="p-4 rounded-xl bg-primary/10 text-center">
          <p className="text-sm text-muted-foreground">{percent}% of {number} is</p>
          <p className="text-2xl font-bold text-primary">{result.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default PercentageCalculator;
