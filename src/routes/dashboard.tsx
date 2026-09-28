import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Stat, meta } from "@/components/site";
import { useMyAttempts, useMyCertificates, useMyEnrollments, fmtDate } from "@/lib/learning";

export const Route = createFileRoute("/dashboard")({
  head: () => meta("Dashboard — NEURA", "Your courses, progress and recent results."),
  component: Dashboard,
});

function Dashboard() {
  const { data: en } = useMyEnrollments();
  const { data: at = [] } = useMyAttempts();
  const { data: cs = [] } = useMyCertificates();
  const enrolled = (en?.list ?? []).map((e) => { const c = e.courses as { slug: string; title: string } | null; return { id: c?.slug ?? "", title: c?.title ?? "" }; });
  const results = at.slice(0, 5).map((r) => ({ key: r.id, test: (r.tests as { title: string } | null)?.title ?? "Test", date: fmtDate(r.submitted_at), score: Number(r.percentage ?? 0), passed: !!r.passed }));
  const avg = at.length ? Math.round(at.reduce((a, r) => a + Number(r.percentage ?? 0), 0) / at.length) + "%" : "—";
  return (
    <AppShell title="Dashboard">
      <div className="rounded-xl bg-primary p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold">Welcome back 👋</h2>
        <p className="mt-1 opacity-75">Pick up where you left off.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Enrolled courses" value={String(enrolled.length)} />
        <Stat label="Lessons completed" value={String(en?.lessonsDone ?? 0)} />
        <Stat label="Average score" value={avg} />
        <Stat label="Certificates" value={String(cs.length)} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-3 font-semibold">Continue learning</h3>
          <div className="space-y-3">
            {enrolled.map((c) => (
              <Link key={c.id} to="/courses/$courseId" params={{ courseId: c.id }} className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:shadow">
                <div className="h-12 w-12 shrink-0 rounded-lg bg-primary" />
                <div className="flex-1">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">Open course</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Recent results</h3>
          <div className="divide-y rounded-xl border bg-card">
            {results.map((r) => (
              <div key={r.key} className="flex items-center justify-between p-4 text-sm">
                <div><p className="font-medium">{r.test}</p><p className="text-xs text-muted-foreground">{r.date}</p></div>
                <span className={`font-display font-bold ${r.passed ? "text-success" : "text-destructive"}`}>{r.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
