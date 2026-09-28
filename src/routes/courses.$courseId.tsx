import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, PlayCircle, FileQuestion } from "lucide-react";
import { PublicHeader, Footer, Bar, meta } from "@/components/site";
import { courses, lessons } from "@/lib/mock";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/courses/$courseId")({
  head: () => meta("Course details — NEURA", "Lessons, assessments and progress for this NEURA course."),
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const c = courses.find((x) => x.id === courseId) ?? courses[0]!;
  return (
    <div>
      <PublicHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm opacity-70">{c.category} · {c.level}</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">{c.title}</h1>
          <p className="mt-4 max-w-2xl opacity-80">{c.desc}</p>
          <p className="mt-4 text-sm opacity-70">By {c.instructor} · {c.lessons} lessons · {c.hours} hours</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold">Lessons</h2>
          <div className="mt-4 divide-y rounded-xl border bg-card">
            {lessons.map((l, i) => (
              <Link key={l.id} to="/learn/$courseId/$lessonId" params={{ courseId: c.id, lessonId: l.id }} className="flex items-center gap-4 p-4 hover:bg-muted">
                {l.done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                <span className="flex-1 text-sm"><span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span> &nbsp;{l.title}</span>
                <span className="text-xs text-muted-foreground">{l.duration}</span>
              </Link>
            ))}
            <Link to="/test/$courseId" params={{ courseId: c.id }} className="flex items-center gap-4 p-4 hover:bg-muted">
              <FileQuestion className="h-5 w-5" />
              <span className="flex-1 text-sm font-medium">Final assessment · 4 questions</span>
              <span className="text-xs text-muted-foreground">10 min</span>
            </Link>
          </div>
        </div>
        <aside className="h-fit rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Your progress</p>
          <p className="mt-1 font-display text-3xl font-bold">50%</p>
          <div className="mt-3"><Bar value={50} /></div>
          <Button asChild className="mt-6 w-full"><Link to="/learn/$courseId/$lessonId" params={{ courseId: c.id, lessonId: "l4" }}><PlayCircle className="h-4 w-4" /> Continue learning</Link></Button>
          <Button variant="outline" className="mt-2 w-full">Enroll</Button>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>✓ Certificate on completion</li><li>✓ Timed final assessment</li><li>✓ Learn at your own pace</li>
          </ul>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
