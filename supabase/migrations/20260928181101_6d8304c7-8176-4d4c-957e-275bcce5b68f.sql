GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.enrollments, public.lesson_progress, public.profiles, public.courses, public.course_modules, public.lessons, public.tests, public.questions, public.question_options, public.test_questions TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;