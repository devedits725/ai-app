import { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import quizData from "@/data/quizzes.json";

const subjects = Object.keys(quizData) as Array<keyof typeof quizData>;

const QuizPage = () => {
  const [subject, setSubject] = useState(subjects[0]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const questions = useMemo(() => quizData[subject].slice(0, 10), [subject]);
  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers((a) => [...a, idx]);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const retry = () => {
    setCurrent(0); setSelected(null); setScore(0); setFinished(false); setAnswers([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader title="Practice Quiz" />
      <div className="px-4 pt-2 flex gap-2">
        {subjects.map((s) => (
          <button key={s} onClick={() => { setSubject(s); retry(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${subject === s ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4">
        {finished ? (
          <div className="text-center space-y-4 mt-8">
            <p className="text-5xl font-bold text-primary">{score}/{questions.length}</p>
            <p className="text-lg font-semibold">{score >= 8 ? "Excellent! 🎉" : score >= 5 ? "Good job! 👍" : "Keep practicing! 💪"}</p>
            <button onClick={retry} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium active:scale-95 transition-all">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Q{current + 1}/{questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <p className="text-base font-semibold">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                let style = "bg-card border-border";
                if (selected !== null) {
                  if (idx === q.answer) style = "bg-success/10 border-success";
                  else if (idx === selected) style = "bg-destructive/10 border-destructive";
                }
                return (
                  <button key={idx} onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${style}`}>
                    <span className="text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <div className="space-y-3">
                <p className="text-sm bg-muted p-3 rounded-xl">{q.explanation}</p>
                <button onClick={next} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium active:scale-95 transition-all">
                  {current + 1 >= questions.length ? "See Results" : "Next Question"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <BannerAdPlaceholder />
    </div>
  );
};

export default QuizPage;
