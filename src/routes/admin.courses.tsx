import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AppShell, meta } from "@/components/site";
import { courses } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/courses")({
  head: () => meta("Manage courses — NEURA Admin", "Create, edit and publish NEURA courses and lessons."),
  component: AdminCourses,
});

function AdminCourses() {
  return (
    <AppShell admin title="Courses">
      <div className="mb-4 flex justify-between">
        <p className="text-sm text-muted-foreground">{courses.length} courses</p>
        <Dialog>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> New course</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create course</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input className="mt-1" /></div>
              <div><Label>Category</Label><Input className="mt-1" /></div>
              <div><Label>Description</Label><Textarea className="mt-1" /></div>
              <Button className="w-full">Save course</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground"><tr><th className="p-4">Course</th><th className="p-4">Category</th><th className="p-4">Lessons</th><th className="p-4">Status</th><th className="p-4" /></tr></thead>
          <tbody className="divide-y">
            {courses.map((c, i) => (
              <tr key={c.id}>
                <td className="p-4 font-medium">{c.title}<p className="text-xs font-normal text-muted-foreground">{c.instructor}</p></td>
                <td className="p-4 text-muted-foreground">{c.category}</td>
                <td className="p-4">{c.lessons}</td>
                <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${i < 5 ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{i < 5 ? "Published" : "Draft"}</span></td>
                <td className="p-4 text-right"><Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
