import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCurriculum1720000000000 implements MigrationInterface {
  name = 'InitCurriculum1720000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ensure uuid extension exists (id columns use uuid)
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
    );
    // programs
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "programs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "version" character varying, "notes" text, CONSTRAINT "UQ_programs_name" UNIQUE ("name"), CONSTRAINT "PK_programs_id" PRIMARY KEY ("id"))`,
    );

    // audit_logs
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "actorId" character varying NOT NULL, "action" character varying NOT NULL, "entity" character varying NOT NULL, "entityId" character varying NOT NULL, "diff" jsonb, CONSTRAINT "PK_audit_logs_id" PRIMARY KEY ("id"))`,
    );

    // courses
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "courses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "code" character varying NOT NULL,
        "name" character varying NOT NULL,
        "creditHours" integer NOT NULL,
        "type" character varying,
        "hasTheoretical" boolean NOT NULL DEFAULT false,
        "hasPractical" boolean NOT NULL DEFAULT false,
        "minCreditsToOpen" integer,
        "isConditionRequired" boolean NOT NULL DEFAULT false,
        CONSTRAINT "UQ_courses_code" UNIQUE ("code"),
        CONSTRAINT "PK_courses_id" PRIMARY KEY ("id")
      )`,
    );

    // prerequisites (edges between courses)
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "prerequisites" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "courseId" uuid NOT NULL,
        "prereqCourseId" uuid NOT NULL,
        CONSTRAINT "PK_prereq_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_prereq_course" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_prereq_prereqCourse" FOREIGN KEY ("prereqCourseId") REFERENCES "courses"("id") ON DELETE CASCADE
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_prereq_course_pair" ON "prerequisites" ("courseId", "prereqCourseId")`,
    );

    // course_requirements (study plan items)
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "course_requirements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "studyPlanId" uuid NOT NULL,
        "courseId" uuid NOT NULL,
        "mandatory" boolean NOT NULL DEFAULT true,
        "bucket" character varying NOT NULL,
        "minSemesterIndex" integer,
        CONSTRAINT "PK_course_requirements_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_course_req_plan" FOREIGN KEY ("studyPlanId") REFERENCES "study_plans"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_course_req_course" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_course_req_plan" ON "course_requirements" ("studyPlanId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_course_req_course" ON "course_requirements" ("courseId")`,
    );

    // add programId to study_plans if missing
    const hasColumn = await queryRunner.hasColumn('study_plans', 'programId');
    if (!hasColumn) {
      await queryRunner.query(`ALTER TABLE "study_plans" ADD COLUMN "programId" uuid`);
      await queryRunner.query(
        `ALTER TABLE "study_plans" ADD CONSTRAINT "FK_study_plans_program" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE SET NULL`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasFk = await queryRunner.query(
      `SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='study_plans' AND constraint_type='FOREIGN KEY'`,
    );
    // best-effort drop foreign key/column
    try {
      await queryRunner.query(`ALTER TABLE "study_plans" DROP CONSTRAINT IF EXISTS "FK_study_plans_program"`);
      await queryRunner.query(`ALTER TABLE "study_plans" DROP COLUMN IF EXISTS "programId"`);
    } catch {}
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_prereq_course_pair"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_course_req_course"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_course_req_plan"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "course_requirements"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prerequisites"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "courses"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "programs"`);
  }
}


