import { createFileRoute } from "@tanstack/react-router";
import { Award, Download } from "lucide-react";
import { AppShell, meta } from "@/components/site";
import { certificates } from "@/lib/mock";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/certificates")({
  head: () => meta("Certificates — NEURA", "Download and share your NEURA course certificates."),
  component: Certs,
});

function Certs() {
  return (
    <AppShell title="Certificates">
      <div className="grid gap-6 md:grid-cols-2">
        {certificates.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-xl border bg-card">
            <div className="relative bg-primary p-8 text-center text-primary-foreground">
              <div className="absolute inset-3 rounded-lg border border-accent/40" />
              <Award className="mx-auto h-10 w-10 text-accent" />
              <p className="mt-3 text-xs uppercase tracking-[0.3em] opacity-70">Certificate of completion</p>
              <p className="mt-3 font-display text-2xl font-bold">Divya D</p>
              <p className="mt-1 text-sm opacity-80">has successfully completed</p>
              <p className="mt-1 font-display text-lg text-accent">{c.course}</p>
            </div>
            <div className="flex items-center justify-between p-4 text-sm">
              <div><p className="font-medium">{c.date}</p><p className="text-xs text-muted-foreground">ID: {c.id}</p></div>
              <Button size="sm" variant="outline"><Download className="h-4 w-4" /> Download</Button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
