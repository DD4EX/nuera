# NEURA Learning Platform

## Build plan
- Replace the template home with a branded NEURA learning experience using the uploaded logo, the specified blue/cyan palette, and a practical learning dashboard.
- Enable student email/password and Google sign-in, profile creation on signup, and a separate database-backed role system for administrator access.
- Establish Lovable Cloud data structures and access rules for courses, modules, lessons/resources, enrollment/progress, question bank/tests, attempts/answers, and certificates; use Cloud file storage for learning materials.
- Implement the core student workflow: course catalog and detail, enrollment, lesson learning/progress, timed MCQ test submission and scoring, attempt/results review, progress, certificates, and account profile.
- Implement the secured administration workspace for students, course content, questions/tests, results and reports, with safe inputs and paginated data surfaces.
- Add realistic starter course and assessment content, route-specific page titles/descriptions, and verify the preview plus Cloud policies after implementation.

## Technical notes
- Use the project's TanStack Start routes and server functions; keep role checks and private data access server-side and enforce row access with database policies.
- Keep roles separate from profile records. Admin pages require an explicitly granted administrator role; never infer privileges from browser storage or hardcoded credentials.
- Store uploaded media in Cloud storage and metadata in the database, not large file bodies.
- The platform is a production-oriented baseline; external notification delivery, video hosting, and capacity testing are outside the supplied requirements' initial implementation scope.
