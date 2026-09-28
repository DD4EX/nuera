import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Circle, PlayCircle, FileQuestion } from "lucide-react";
import { toast } from "sonner";
import { PublicHeader, Footer, Bar, meta } from "@/components/site";
import { Button } from "@/components/ui/button";
import { enroll, useCourse, useInvalidate, useMyCourseState } from "@/lib/learning";

export const Route = createFileRoute("/courses/$courseId")({
  head: () => meta("Course details — NEURA", "Lessons, assessments and progress for this NEURA course."),
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const { data: c, isLoading } = useCourse(courseId);
  const lessons = c?.lessons ?? [];
  const { data: st } = useMyCourseState(c?.id, lessons.map((l) => l.id));
  const refresh = useInvalidate();
  const nav = useNavigate();
  if (isLoading) return <div><PublicHeader /><p className="p-10 text-center text-muted-foreground">Loading…</p></div>;
  if (!c) return <div><PublicHeader /><p className="p-10 text-center">Course not found. <Link to="/courses" className="underline">Browse courses</Link></p></div>;
  const done = st?.done ?? new Set<string>();
  const pct = lessons.length ? Math.round((done.size / lessons.length) * 100) : 0;
  const nextLesson = lessons.find((l) => !done.has(l.id)) ?? lessons[0];
  const onEnroll = async () => {
    try { await enroll(c.id); toast.success("You're enrolled!"); refresh(); }
    catch (e) { toast.error((e as Error).message); if ((e as Error).message.includes("sign in")) nav({ to: "/auth" }); }
  };
  return (
    <div>
      <PublicHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm opacity-70">{c.category} · {c.difficulty}</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">{c.title}</h1>
          <p className="mt-4 max-w-2xl opacity-80">{c.description}</p>
          <p className="mt-4 text-sm opacity-70">By {c.instructor} · {lessons.length} lessons · {c.duration_hours} hours</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold">Lessons</h2>
          <div className="mt-4 divide-y rounded-xl border bg-card">
            {lessons.map((l, i) => (
              <Link key={l.id} to="/learn/$courseId/$lessonId" params={{ courseId, lessonId: l.id }} className="flex items-center gap-4 p-4 hover:bg-muted">
                {done.has(l.id) ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                <span className="flex-1 text-sm"><span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span> &nbsp;{l.title}</span>
                <span className="text-xs text-muted-foreground">{l.duration_minutes} min</span>
              </Link>
            ))}
            <Link to="/test/$courseId" params={{ courseId }} className="flex items-center gap-4 p-4 hover:bg-muted">
              <FileQuestion className="h-5 w-5" />
              <span className="flex-1 text-sm font-medium">Final assessment</span>
              <span className="text-xs text-muted-foreground">15 min</span>
            </Link>
          </div>
        </div>
        <aside className="h-fit rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Your progress</p>
          <p className="mt-1 font-display text-3xl font-bold">{pct}%</p>
          <div className="mt-3"><Bar value={pct} /></div>
          {st?.enrolled && nextLesson ? (
            <Button asChild className="mt-6 w-full"><Link to="/learn/$courseId/$lessonId" params={{ courseId, lessonId: nextLesson.id }}><PlayCircle className="h-4 w-4" /> Continue learning</Link></Button>
          ) : (
            <Button className="mt-6 w-full" onClick={onEnroll}>Enroll for free</Button>
          )}
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>✓ Certificate on completion</li><li>✓ Timed final assessment</li><li>✓ Learn at your own pace</li>
          </ul>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
