import { useState } from "react";
import { Input } from "@/components/ui/input";

const ExamScoreCalculator = () => {
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");

  const pct = obtained && total && parseFloat(total) > 0 ? (parseFloat(obtained) / parseFloat(total)) * 100 : null;

  const grade = pct !== null ? (pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F") : null;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Exam Score Calculator</h2>
      <div className="space-y-3">
        <Input type="number" placeholder="Marks obtained" value={obtained} onChange={(e) => setObtained(e.target.value)} />
        <Input type="number" placeholder="Total marks" value={total} onChange={(e) => setTotal(e.target.value)} />
      </div>
      {pct !== null && grade && (
        <div className="p-4 rounded-xl bg-primary/10 text-center space-y-1">
          <p className="text-3xl font-bold text-primary">{pct.toFixed(1)}%</p>
          <p className="text-lg font-semibold">Grade: {grade}</p>
        </div>
      )}
    </div>
  );
};

export default ExamScoreCalculator;
