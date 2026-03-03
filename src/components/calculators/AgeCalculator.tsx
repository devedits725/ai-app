import { useState } from "react";
import { Input } from "@/components/ui/input";
import { differenceInYears, differenceInMonths, differenceInDays, parse, isValid } from "date-fns";

const AgeCalculator = () => {
  const [dob, setDob] = useState("");
  const today = new Date();
  const birthDate = dob ? new Date(dob) : null;
  const valid = birthDate && isValid(birthDate) && birthDate < today;

  const years = valid ? differenceInYears(today, birthDate) : 0;
  const months = valid ? differenceInMonths(today, birthDate) % 12 : 0;
  const days = valid ? differenceInDays(today, new Date(today.getFullYear(), today.getMonth() - (differenceInMonths(today, birthDate)), birthDate.getDate())) : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Age Calculator</h2>
      <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      {valid && (
        <div className="p-4 rounded-xl bg-primary/10 text-center space-y-1">
          <p className="text-2xl font-bold text-primary">{years} years</p>
          <p className="text-sm text-muted-foreground">{months} months, {Math.max(0, days)} days</p>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
