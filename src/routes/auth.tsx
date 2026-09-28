import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useState } from "react";
import { Logo, meta } from "@/components/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => meta("Sign in — NEURA", "Sign in or create your NEURA student account."),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password: pw })
      : await supabase.auth.signUp({ email, password: pw, options: { data: { full_name: name }, emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up") { toast.success("Check your email to confirm your account."); return; }
    nav({ to: "/dashboard" });
  };
  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r && "error" in r && r.error) toast.error(String((r.error as Error).message ?? r.error));
  };
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground md:flex">
        <Logo light />
        <div>
          <h2 className="text-4xl font-bold">Your learning,<br /><span className="text-accent">measured.</span></h2>
          <p className="mt-4 max-w-sm opacity-75">Track lessons, take timed tests and earn certificates — all in one place.</p>
        </div>
        <p className="text-sm opacity-60">© 2026 NEURA</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="md:hidden"><Logo /></div>
          <h1 className="mt-6 text-3xl font-bold">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "in" ? "Sign in to continue learning." : "Start your first course in minutes."}</p>
          <Button variant="outline" className="mt-6 w-full" onClick={google}>Continue with Google</Button>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
          <form className="space-y-4" onSubmit={submit}>
            {mode === "up" && <div><Label>Full name</Label><Input className="mt-1" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Divya D" /></div>}
            <div><Label>Email</Label><Input className="mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div><Label>Password</Label><Input className="mt-1" type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" /></div>
            <Button type="submit" disabled={busy} className="w-full">{mode === "in" ? "Sign in" : "Create account"}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "in" ? "New to NEURA?" : "Already have an account?"}{" "}
            <button className="font-medium text-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "Sign up" : "Sign in"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
