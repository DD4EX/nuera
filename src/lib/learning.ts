import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const [user, setUser] = useState<{ id: string; email?: string } | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return user;
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data: c, error } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!c) return null;
      const { data: mods } = await supabase.from("course_modules").select("id").eq("course_id", c.id);
      const ids = (mods ?? []).map((m) => m.id);
      const { data: lessons } = ids.length
        ? await supabase.from("lessons").select("id,title,duration_minutes,sort_order,content").in("module_id", ids).order("sort_order")
        : { data: [] };
      return { ...c, lessons: lessons ?? [] };
    },
  });
}

export function useMyCourseState(courseId?: string, lessonIds: string[] = []) {
  return useQuery({
    enabled: !!courseId,
    queryKey: ["mystate", courseId, lessonIds.join()],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return { enrolled: false, done: new Set<string>() };
      const { data: e } = await supabase.from("enrollments").select("id").eq("course_id", courseId!).eq("user_id", u.user.id).maybeSingle();
      const { data: p } = lessonIds.length
        ? await supabase.from("lesson_progress").select("lesson_id").eq("user_id", u.user.id).eq("completed", true).in("lesson_id", lessonIds)
        : { data: [] };
      return { enrolled: !!e, done: new Set((p ?? []).map((x) => x.lesson_id)) };
    },
  });
}

export async function enroll(courseId: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Please sign in to enroll.");
  const { error } = await supabase.from("enrollments").insert({ course_id: courseId, user_id: u.user.id, status: "active" });
  if (error && !error.message.includes("duplicate")) throw error;
}

export async function markComplete(lessonId: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  await supabase.from("lesson_progress").upsert(
    { user_id: u.user.id, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
    { onConflict: "user_id,lesson_id" },
  );
}

export function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}

export function useMyAttempts() {
  return useQuery({
    queryKey: ["attempts"],
    queryFn: async () => {
      const { data } = await supabase.from("test_attempts")
        .select("id,percentage,passed,submitted_at,tests(title)").eq("status", "submitted").order("submitted_at", { ascending: false });
      return data ?? [];
    },
  });
}

export function useMyCertificates() {
  return useQuery({
    queryKey: ["certs"],
    queryFn: async () => {
      const { data } = await supabase.from("certificates").select("id,certificate_code,issued_at,courses(title)").order("issued_at", { ascending: false });
      return data ?? [];
    },
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const { data } = await supabase.from("enrollments").select("id,courses(slug,title)");
      const { count } = await supabase.from("lesson_progress").select("id", { count: "exact", head: true }).eq("completed", true);
      return { list: data ?? [], lessonsDone: count ?? 0 };
    },
  });
}

export const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "");
