import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PublicHeader, Footer, meta } from "@/components/site";
import { courses } from "@/lib/mock";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/courses/")({
  head: () => meta("Course catalog — NEURA", "Browse NEURA courses in AI, data science and programming."),
  component: Catalog,
});

const cats = ["All", "Artificial Intelligence", "Data", "Programming", "Engineering"];

function Catalog() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = courses.filter((c) => (cat === "All" || c.category === cat) && c.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PublicHeader />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl font-bold">Course catalog</h1>
        <p className="mt-2 text-muted-foreground">Pick a course and start learning today.</p>
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{c}</button>
            ))}
          </div>
          <Input placeholder="Search courses…" value={q} onChange={(e) => setQ(e.target.value)} className="md:w-64" />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {list.map((c) => (
            <Link key={c.id} to="/courses/$courseId" params={{ courseId: c.id }} className="flex flex-col rounded-xl border bg-card transition hover:shadow-lg">
              <div className="h-28 rounded-t-xl bg-primary p-4"><span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">{c.level}</span></div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-muted-foreground">{c.category}</p>
                <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.desc}</p>
                <p className="mt-4 text-xs text-muted-foreground">{c.instructor} · {c.lessons} lessons · {c.hours} hrs</p>
              </div>
            </Link>
          ))}
          {list.length === 0 && <p className="text-muted-foreground">No courses match your search.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}
