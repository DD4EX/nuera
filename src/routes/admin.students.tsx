import { createFileRoute } from "@tanstack/react-router";
import { AppShell, meta } from "@/components/site";
import { students } from "@/lib/mock";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/students")({
  head: () => meta("Students — NEURA Admin", "View student profiles, enrollments and performance."),
  component: AdminStudents,
});

function AdminStudents() {
  return (
    <AppShell admin title="Students">
      <Input placeholder="Search students…" className="mb-4 max-w-sm" />
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground"><tr><th className="p-4">Student</th><th className="p-4">Courses</th><th className="p-4">Avg score</th><th className="p-4">Joined</th></tr></thead>
          <tbody className="divide-y">
            {students.map((s) => (
              <tr key={s.email}>
                <td className="p-4"><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></td>
                <td className="p-4">{s.courses}</td>
                <td className="p-4 font-display font-bold">{s.avg}%</td>
                <td className="p-4 text-muted-foreground">{s.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
