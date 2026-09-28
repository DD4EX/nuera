import { createFileRoute } from "@tanstack/react-router";
import { Plus, CheckCircle2 } from "lucide-react";
import { AppShell, meta } from "@/components/site";
import { questions } from "@/lib/mock";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/tests")({
  head: () => meta("Manage tests — NEURA Admin", "Build timed multiple-choice assessments for NEURA courses."),
  component: AdminTests,
});

function AdminTests() {
  return (
    <AppShell admin title="Tests">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">AI Foundations — Final assessment</h2>
          <p className="text-sm text-muted-foreground">{questions.length} questions · 10 min limit · Pass at 60%</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Add question</Button>
      </div>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.q} className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Question {i + 1}</p>
            <p className="mt-1 font-medium">{q.q}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {q.options.map((o, k) => (
                <div key={o} className={`flex items-center gap-2 rounded-md border p-2 text-sm ${k === q.answer ? "border-success bg-success/10" : ""}`}>
                  {k === q.answer && <CheckCircle2 className="h-4 w-4 text-success" />}{o}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
