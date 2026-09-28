import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Timer, Trophy, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Logo, meta } from "@/components/site";
import { Button } from "@/components/ui/button";
import { useCourse, useInvalidate, useUser } from "@/lib/learning";
import { getTest, submitTest } from "@/lib/tests.functions";

export const Route = createFileRoute("/test/$courseId")({
  head: () => meta("Assessment — NEURA", "Take your timed NEURA course assessment."),
  component: Test,
});

function Test() {
  const { courseId } = Route.useParams();
  const user = useUser();
  const { data: c } = useCourse(courseId);
  const fetchTest = useServerFn(getTest);
  const submitFn = useServerFn(submitTest);
  const refresh = useInvalidate();
  const { data, isLoading } = useQuery({
    enabled: !!c && !!user,
    queryKey: ["test", c?.id],
    queryFn: () => fetchTest({ data: { courseId: c!.id } }),
  });
  const qs = data?.questions ?? [];
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [result, setResult] = useState<{ percentage: number; passed: boolean; passing: number } | null>(null);
  const [secs, setSecs] = useState(0);
  const [busy, setBusy] = useState(false);
  const started = useRef(Date.now());

  useEffect(() => {
    if (!data?.test) return;
    setSecs(data.test.duration_minutes * 60); started.current = Date.now();
  }, [data?.test]);
  useEffect(() => {
    if (result || !data?.test) return;
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [result, data?.test]);

  const submit = async () => {
    if (!data?.test || busy) return;
    setBusy(true);
    try {
      const full = Object.fromEntries(qs.map((q) => [q.id, answers[q.id] ?? null]));
      const r = await submitFn({ data: { testId: data.test.id, answers: full, seconds: Math.round((Date.now() - started.current) / 1000) } });
      setResult(r); refresh();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };
  useEffect(() => { if (secs === 0 && data?.test && !result && Date.now() - started.current > 2000) void submit(); }, [secs]); // eslint-disable-line

  const retake = () => { setResult(null); setI(0); setAnswers({}); setSecs((data?.test?.duration_minutes ?? 15) * 60); started.current = Date.now(); };

  let body: React.ReactNode;
  if (user === null) body = <p className="mt-10 text-center">Please <Link to="/auth" className="underline">sign in</Link> to take this test.</p>;
  else if (isLoading || !c || user === undefined) body = <p className="mt-10 text-center text-muted-foreground">Loading…</p>;
  else if (data?.error) body = <p className="mt-10 text-center">{data.error} <Link to="/courses/$courseId" params={{ courseId }} className="underline">Go to course</Link></p>;
  else if (result) body = (
    <div className="mt-10 rounded-xl border bg-card p-10 text-center">
      {result.passed ? <Trophy className="mx-auto h-14 w-14 text-success" /> : <XCircle className="mx-auto h-14 w-14 text-destructive" />}
      <h1 className="mt-4 text-3xl font-bold">{result.passed ? "You passed!" : "Not quite yet"}</h1>
      <p className="mt-2 text-muted-foreground">{c.title} — Final assessment</p>
      <p className="mt-6 font-display text-6xl font-bold">{result.percentage}%</p>
      <p className="mt-2 text-sm text-muted-foreground">Passing score: {result.passing}%</p>
      <div className="mt-8 flex justify-center gap-3">
        {result.passed ? <Button asChild><Link to="/certificates">View certificate</Link></Button> : <Button onClick={retake}>Retake test</Button>}
        <Button variant="outline" asChild><Link to="/results">All results</Link></Button>
      </div>
    </div>
  );
  else if (qs[i]) {
    const q = qs[i]!;
    body = (
      <>
        <p className="text-sm text-muted-foreground">{c.title} · Question {i + 1} of {qs.length}</p>
        <div className="mt-3 flex gap-1">{qs.map((x, k) => <span key={x.id} className={`h-1.5 flex-1 rounded-full ${answers[x.id] ? "bg-success" : k === i ? "bg-primary" : "bg-muted"}`} />)}</div>
        <h1 className="mt-8 text-2xl font-bold">{q.prompt}</h1>
        <div className="mt-6 space-y-3">
          {q.options.map((o, k) => (
            <button key={o.id} onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
              className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition ${answers[q.id] === o.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
              <span className="grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold">{"ABCDEF"[k]}</span>{o.label}
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          <Button variant="outline" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</Button>
          {i < qs.length - 1 ? <Button onClick={() => setI(i + 1)}>Next</Button> : <Button disabled={busy} onClick={submit}>{busy ? "Submitting…" : "Submit test"}</Button>}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex h-14 items-center justify-between border-b bg-card px-4">
        <Logo />
        {data?.test && !result && <span className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 font-mono text-sm text-primary-foreground"><Timer className="h-4 w-4 text-accent" />{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</span>}
      </header>
      <main className="mx-auto max-w-2xl p-6">{body}</main>
    </div>
  );
}
