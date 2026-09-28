import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Stat, Bar, meta } from "@/components/site";
import { courses, results } from "@/lib/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => meta("Dashboard — NEURA", "Your courses, progress and recent results."),
  component: Dashboard,
});

function Dashboard() {
  const enrolled = courses.filter((c) => c.progress > 0);
  return (
    <AppShell title="Dashboard">
      <div className="rounded-xl bg-primary p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold">Welcome back, Divya 👋</h2>
        <p className="mt-1 opacity-75">You're 35% away from finishing AI Foundations.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Enrolled courses" value={String(enrolled.length)} />
        <Stat label="Lessons completed" value="24" hint="+6 this week" />
        <Stat label="Average score" value="77%" />
        <Stat label="Certificates" value="2" />
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
                  <div className="mt-2 flex items-center gap-3"><Bar value={c.progress} /><span className="text-xs text-muted-foreground">{c.progress}%</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Recent results</h3>
          <div className="divide-y rounded-xl border bg-card">
            {results.map((r) => (
              <div key={r.test} className="flex items-center justify-between p-4 text-sm">
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
