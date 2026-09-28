import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Timer, Trophy, XCircle } from "lucide-react";
import { Logo, meta } from "@/components/site";
import { courses, questions } from "@/lib/mock";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/test/$courseId")({
  head: () => meta("Assessment — NEURA", "Take your timed NEURA course assessment."),
  component: Test,
});

function Test() {
  const { courseId } = Route.useParams();
  const c = courses.find((x) => x.id === courseId) ?? courses[0];
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [done, setDone] = useState(false);
  const [secs, setSecs] = useState(600);
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [done]);

  const score = Math.round((answers.filter((a, k) => a === questions[k].answer).length / questions.length) * 100);
  const passed = score >= 60;
  const q = questions[i];

  return (
    <div className="min-h-screen">
      <header className="flex h-14 items-center justify-between border-b bg-card px-4">
        <Logo />
        {!done && <span className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 font-mono text-sm text-primary-foreground"><Timer className="h-4 w-4 text-accent" />{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</span>}
      </header>
      <main className="mx-auto max-w-2xl p-6">
        {done ? (
          <div className="mt-10 rounded-xl border bg-card p-10 text-center">
            {passed ? <Trophy className="mx-auto h-14 w-14 text-success" /> : <XCircle className="mx-auto h-14 w-14 text-destructive" />}
            <h1 className="mt-4 text-3xl font-bold">{passed ? "You passed!" : "Not quite yet"}</h1>
            <p className="mt-2 text-muted-foreground">{c.title} — Final assessment</p>
            <p className="mt-6 font-display text-6xl font-bold">{score}%</p>
            <p className="mt-2 text-sm text-muted-foreground">Passing score: 60%</p>
            <div className="mt-8 flex justify-center gap-3">
              {passed ? <Button asChild><Link to="/certificates">View certificate</Link></Button> : <Button onClick={() => { setDone(false); setI(0); setAnswers(questions.map(() => null)); setSecs(600); }}>Retake test</Button>}
              <Button variant="outline" asChild><Link to="/results">All results</Link></Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{c.title} · Question {i + 1} of {questions.length}</p>
            <div className="mt-3 flex gap-1">{questions.map((_, k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${answers[k] !== null ? "bg-success" : k === i ? "bg-primary" : "bg-muted"}`} />)}</div>
            <h1 className="mt-8 text-2xl font-bold">{q.q}</h1>
            <div className="mt-6 space-y-3">
              {q.options.map((o, k) => (
                <button key={o} onClick={() => setAnswers(answers.map((a, j) => (j === i ? k : a)))}
                  className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition ${answers[i] === k ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
                  <span className="grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold">{"ABCD"[k]}</span>{o}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="outline" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</Button>
              {i < questions.length - 1
                ? <Button onClick={() => setI(i + 1)}>Next</Button>
                : <Button onClick={() => setDone(true)}>Submit test</Button>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
