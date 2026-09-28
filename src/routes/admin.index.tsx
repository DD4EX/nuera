import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Stat, Bar, meta } from "@/components/site";
import { courses, students } from "@/lib/mock";

export const Route = createFileRoute("/admin/")({
  head: () => meta("Admin overview — NEURA", "Platform activity, enrollments and performance at a glance."),
  component: AdminHome,
});

function AdminHome() {
  return (
    <AppShell admin title="Admin Overview">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Total students" value="1,284" hint="+48 this month" />
        <Stat label="Active courses" value={String(courses.length)} />
        <Stat label="Tests taken" value="3,912" />
        <Stat label="Pass rate" value="81%" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold">Course completion</h3>
          <div className="mt-4 space-y-4">
            {courses.map((c, i) => { const v = [72, 58, 34, 91, 45, 66][i]; return (
              <div key={c.id}><div className="mb-1 flex justify-between text-sm"><span>{c.title}</span><span className="text-muted-foreground">{v}%</span></div><Bar value={v} /></div>
            ); })}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold">Newest students</h3>
          <div className="mt-4 divide-y">
            {students.map((s) => (
              <div key={s.email} className="flex items-center gap-3 py-3 text-sm">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-bold">{s.name.split(" ").map((w) => w[0]).join("")}</span>
                <div className="flex-1"><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></div>
                <span className="text-xs text-muted-foreground">{s.joined}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
