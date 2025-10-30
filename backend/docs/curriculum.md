## Curriculum model

Entities: `Program`, `Course`, `Prerequisite`, `StudyPlan`, `CourseRequirement`, `AuditLog`.

CSV columns: `code,name_en,name_ar,credits,theory_hours,practical_hours,category,semester_hint,prereq_codes` where `prereq_codes` is `;`-separated course codes.

Supervisor endpoints:
- GET `/academic/courses` — list
- POST `/academic/courses` — create
- PATCH `/academic/courses/:id` — update
- DELETE `/academic/courses/:id` — delete
- GET `/academic/courses/:id/prerequisites` — list
- POST `/academic/courses/:id/prerequisites` — replace
- GET `/academic/courses/export/csv` — export CSV
- POST `/academic/courses/import/csv` — import CSV `{ csv: string }`
- GET `/academic/study-plans` — list
- POST `/academic/study-plans` — create
- GET `/academic/study-plans/:id` — get
- PATCH `/academic/study-plans/:id` — update
- DELETE `/academic/study-plans/:id` — remove
- GET `/academic/study-plans/:id/totals` — totals by bucket
- GET `/academic/prereqs/validate` — validate DAG (cycle detection)

Seed scenario:
- Creates `swe-supervisor` (password `supervisor123`), program `Software Engineering`, plan `SWE Study Plan 2016`, minimal courses, and an audit log entry.
