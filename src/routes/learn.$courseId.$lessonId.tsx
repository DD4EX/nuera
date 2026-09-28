import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { Logo, meta } from "@/components/site";
import { Button } from "@/components/ui/button";
import { markComplete, useCourse, useInvalidate, useMyCourseState } from "@/lib/learning";

export const Route = createFileRoute("/learn/$courseId/$lessonId")({
  head: () => meta("Lesson — NEURA", "Watch and read your NEURA lesson."),
  component: Lesson,
});

function Lesson() {
  const { courseId, lessonId } = Route.useParams();
  const { data: c } = useCourse(courseId);
  const lessons = c?.lessons ?? [];
  const { data: st } = useMyCourseState(c?.id, lessons.map((l) => l.id));
  const refresh = useInvalidate();
  const nav = useNavigate();
  if (!c) return <p className="p-10 text-center text-muted-foreground">Loading…</p>;
  if (st && !st.enrolled) return <p className="p-10 text-center">Enroll first to open lessons. <Link to="/courses/$courseId" params={{ courseId }} className="underline">Go to course</Link></p>;
  const idx = Math.max(0, lessons.findIndex((l) => l.id === lessonId));
  const l = lessons[idx];
  if (!l) return <p className="p-10 text-center">Lesson not found.</p>;
  const prev = lessons[idx - 1], next = lessons[idx + 1];
  const done = st?.done ?? new Set<string>();
  const complete = async () => {
    await markComplete(l.id); refresh();
    if (next) nav({ to: "/learn/$courseId/$lessonId", params: { courseId, lessonId: next.id } });
    else nav({ to: "/test/$courseId", params: { courseId } });
  };
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-card px-4">
        <Logo />
        <Link to="/courses/$courseId" params={{ courseId }} className="text-sm text-muted-foreground hover:text-foreground">← {c.title}</Link>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-72 border-r bg-card p-4 md:block">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Lessons</p>
          {lessons.map((x, i) => (
            <Link key={x.id} to="/learn/$courseId/$lessonId" params={{ courseId, lessonId: x.id }}
              className={`flex items-center gap-3 rounded-md p-2 text-sm ${x.id === l.id ? "bg-muted font-medium" : "hover:bg-muted"}`}>
              {done.has(x.id) ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
              {i + 1}. {x.title}
            </Link>
          ))}
        </aside>
        <main className="mx-auto w-full max-w-3xl flex-1 p-6">
          <div className="grid aspect-video place-items-center rounded-xl bg-primary text-primary-foreground">
            <PlayCircle className="h-16 w-16 text-accent" />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Lesson {idx + 1} of {lessons.length} · {l.duration_minutes} min</p>
          <h1 className="mt-1 text-3xl font-bold">{l.title}</h1>
          <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
            <p>In this lesson you'll explore the core ideas behind this topic, with practical examples you can relate to everyday technology.</p>
            <p>Take notes as you go — the key concepts here will appear in the final assessment for this course.</p>
          </div>
          <div className="mt-10 flex items-center justify-between border-t pt-6">
            {prev ? <Button variant="outline" asChild><Link to="/learn/$courseId/$lessonId" params={{ courseId, lessonId: prev.id }}><ChevronLeft className="h-4 w-4" /> Previous</Link></Button> : <span />}
            <Button onClick={complete}>{next ? <>Mark complete & next <ChevronRight className="h-4 w-4" /></> : "Mark complete & take test"}</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
