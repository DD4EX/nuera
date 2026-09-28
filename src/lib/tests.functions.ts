import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: e } = await context.supabase.from("enrollments").select("id").eq("course_id", data.courseId).eq("user_id", context.userId).maybeSingle();
    if (!e) return { error: "Enroll in this course first.", test: null, questions: [] };
    const { data: test } = await supabaseAdmin.from("tests").select("id,title,duration_minutes,passing_percentage").eq("course_id", data.courseId).eq("published", true).limit(1).maybeSingle();
    if (!test) return { error: "No test for this course yet.", test: null, questions: [] };
    const { data: tq } = await supabaseAdmin.from("test_questions").select("sort_order,questions(id,prompt,question_options(id,label,sort_order))").eq("test_id", test.id).order("sort_order");
    const questions = (tq ?? []).map((r) => {
      const q = r.questions as unknown as { id: string; prompt: string; question_options: { id: string; label: string; sort_order: number }[] };
      return { id: q.id, prompt: q.prompt, options: [...q.question_options].sort((a, b) => a.sort_order - b.sort_order).map((o) => ({ id: o.id, label: o.label })) };
    });
    return { error: null, test, questions };
  });

export const submitTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ testId: z.string().uuid(), seconds: z.number().int().min(0), answers: z.record(z.string().uuid(), z.string().uuid().nullable()) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const uid = context.userId;
    const { data: test } = await db.from("tests").select("id,course_id,passing_percentage").eq("id", data.testId).single();
    if (!test) throw new Error("Test not found");
    const { data: e } = await db.from("enrollments").select("id").eq("course_id", test.course_id).eq("user_id", uid).maybeSingle();
    if (!e) throw new Error("Not enrolled");
    const { data: tq } = await db.from("test_questions").select("question_id,points").eq("test_id", test.id);
    const qids = (tq ?? []).map((r) => r.question_id);
    const { data: correct } = await db.from("question_options").select("id,question_id").in("question_id", qids).eq("is_correct", true);
    const correctBy = new Map((correct ?? []).map((o) => [o.question_id, o.id]));
    let score = 0, max = 0, c = 0, w = 0, u = 0;
    const rows = (tq ?? []).map((r) => {
      const pts = Number(r.points); max += pts;
      const chosen = data.answers[r.question_id] ?? null;
      const ok = chosen !== null && correctBy.get(r.question_id) === chosen;
      if (chosen === null) u++; else if (ok) { c++; score += pts; } else w++;
      return { question_id: r.question_id, option_id: chosen, is_correct: chosen === null ? null : ok, points_awarded: ok ? pts : 0 };
    });
    const pct = max ? Math.round((score / max) * 100) : 0;
    const passed = pct >= Number(test.passing_percentage);
    const { count } = await db.from("test_attempts").select("id", { count: "exact", head: true }).eq("test_id", test.id).eq("user_id", uid);
    const { data: att, error } = await db.from("test_attempts").insert({
      user_id: uid, test_id: test.id, attempt_number: (count ?? 0) + 1, submitted_at: new Date().toISOString(),
      time_taken_seconds: data.seconds, score, max_score: max, percentage: pct, passed, correct_count: c, incorrect_count: w, unanswered_count: u, status: "submitted",
    }).select("id").single();
    if (error) throw new Error("Could not save your result");
    await db.from("test_answers").insert(rows.map((r) => ({ ...r, attempt_id: att.id, marked_for_review: false })));
    if (passed) {
      const { data: has } = await db.from("certificates").select("id").eq("user_id", uid).eq("course_id", test.course_id).maybeSingle();
      if (!has) {
        await db.from("certificates").insert({ user_id: uid, course_id: test.course_id, certificate_code: `NEU-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}` });
        await db.from("enrollments").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", e.id);
      }
    }
    return { percentage: pct, passed, passing: Number(test.passing_percentage) };
  });
