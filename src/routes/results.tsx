import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Stat, meta } from "@/components/site";
import { results } from "@/lib/mock";

export const Route = createFileRoute("/results")({
  head: () => meta("My results — NEURA", "Every assessment score and attempt in one place."),
  component: Results,
});

function Results() {
  return (
    <AppShell title="My Results">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Tests taken" value="3" />
        <Stat label="Passed" value="2" />
        <Stat label="Best score" value="90%" />
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground"><tr><th className="p-4">Assessment</th><th className="p-4">Date</th><th className="p-4">Score</th><th className="p-4">Status</th></tr></thead>
          <tbody className="divide-y">
            {results.map((r) => (
              <tr key={r.test}>
                <td className="p-4 font-medium">{r.test}</td>
                <td className="p-4 text-muted-foreground">{r.date}</td>
                <td className="p-4 font-display font-bold">{r.score}%</td>
                <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.passed ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>{r.passed ? "Passed" : "Failed"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
