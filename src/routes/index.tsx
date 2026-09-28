import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Timer, Award, BarChart3 } from "lucide-react";
import { PublicHeader, Footer, meta } from "@/components/site";
import { courses } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => meta("NEURA — Learn, test and certify your skills", "Structured courses, timed assessments and verified certificates on the NEURA learning platform."),
  component: Home,
});

const features = [
  { icon: BookOpen, t: "Structured courses", d: "Step-by-step lessons that track your progress automatically." },
  { icon: Timer, t: "Timed assessments", d: "Multiple-choice tests with instant scoring and feedback." },
  { icon: BarChart3, t: "Clear results", d: "See every score, retake and improvement in one place." },
  { icon: Award, t: "Certificates", d: "Earn verifiable certificates when you pass a course." },
];

function Home() {
  return (
    <div>
      <PublicHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">New: AI Foundations course</span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] md:text-6xl">Learn deeply.<br />Prove it <span className="text-accent">clearly.</span></h1>
            <p className="mt-6 max-w-md text-lg opacity-80">NEURA brings courses, timed tests and certificates together so every student knows exactly where they stand.</p>
            <div className="mt-8 flex gap-3">
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-medium text-accent-foreground">Start learning <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/courses" className="rounded-md border border-primary-foreground/30 px-5 py-3 font-medium">Browse courses</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            {[["12k+", "Students"], ["48", "Courses"], ["95%", "Completion"], ["8k", "Certificates"]].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6">
                <p className="font-display text-4xl font-bold text-accent">{v}</p><p className="mt-1 text-sm opacity-70">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold">Everything a learner needs</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {features.map((f) => (
            <div key={f.t} className="rounded-xl border bg-card p-6">
              <f.icon className="h-6 w-6" />
              <h3 className="mt-4 font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Popular courses</h2>
          <Link to="/courses" className="text-sm font-medium underline">View all</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {courses.slice(0, 3).map((c) => (
            <Link key={c.id} to="/courses/$courseId" params={{ courseId: c.id }} className="rounded-xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-medium text-muted-foreground">{c.category} · {c.level}</p>
              <h3 className="mt-2 text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              <p className="mt-4 text-xs text-muted-foreground">{c.lessons} lessons · {c.hours} hrs</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
