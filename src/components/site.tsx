import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Award, BarChart3, Users, FileQuestion, Settings } from "lucide-react";
import logoAsset from "@/assets/neura-logo.png.asset.json";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`inline-flex items-center ${light ? "rounded-lg bg-white px-2.5 py-1.5 shadow-sm" : ""}`}>
      <img src={logoAsset.url} alt="NEURA — Startup for AI" width={160} height={80} className="h-7 w-auto md:h-8" />
    </Link>
  );
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden gap-6 text-sm md:flex">
          <Link to="/courses" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>Courses</Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
        </nav>
        <div className="flex gap-2">
          <Link to="/auth" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Sign in</Link>
          <Link to="/auth" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Get started</Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 md:flex-row">
        <Logo />
        <p>© 2026 NEURA Learning. All rights reserved.</p>
      </div>
    </footer>
  );
}

const studentNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/results", label: "My Results", icon: BarChart3 },
  { to: "/certificates", label: "Certificates", icon: Award },
] as const;

const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/tests", label: "Tests", icon: FileQuestion },
  { to: "/admin/students", label: "Students", icon: Users },
] as const;

export function AppShell({ children, admin = false, title }: { children: ReactNode; admin?: boolean; title: string }) {
  const nav = admin ? adminNav : studentNav;
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col bg-sidebar p-4 text-sidebar-foreground md:flex">
        <Logo light />
        <p className="mt-8 mb-2 px-3 text-xs uppercase tracking-wider opacity-60">{admin ? "Administration" : "Learning"}</p>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary" }}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <Link to={admin ? "/dashboard" : "/admin"} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent">
            <Settings className="h-4 w-4" /> {admin ? "Student view" : "Admin view"}
          </Link>
          <div className="mt-2 flex items-center gap-3 rounded-md border border-sidebar-border p-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-sidebar-accent text-xs font-bold">DD</span>
            <div className="text-xs"><p className="font-medium">Divya D</p><p className="opacity-60">{admin ? "Administrator" : "Student"}</p></div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="flex h-16 items-center justify-between border-b bg-card px-6">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex gap-3 text-sm md:hidden">
            {nav.map((n) => <Link key={n.to} to={n.to}><n.icon className="h-5 w-5" /></Link>)}
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-success" style={{ width: `${value}%` }} />
    </div>
  );
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
