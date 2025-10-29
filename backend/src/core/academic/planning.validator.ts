import { Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { Prerequisite } from './entities/prerequisite.entity';
import { ScheduledSection } from './entities/scheduled-section.entity';
import { StudentCourseStatus } from './entities/student-course-status.entity';
import { CourseStatus } from '../../common/enums/course-status.enum';
import { SectionType } from './entities/section-type.enum';

export interface CandidateAssignment {
  courseCode: string;
  sectionAssignments: Array<{ type: SectionType; dayOfWeek: string; slots: string[] }>;
}

export interface ValidationReportItem {
  code: string;
  ok: boolean;
  reason?: string;
}

export interface ValidationResult {
  valid: boolean;
  items: ValidationReportItem[];
  totalCredits: number;
}

@Injectable()
export class PlanningValidator {
  filterEligibleCourses(args: {
    allCourses: Course[];
    statuses: StudentCourseStatus[];
    prerequisites: Prerequisite[];
    completedCredits: number;
  }): Course[] {
    const { allCourses, statuses, prerequisites, completedCredits } = args;
    const statusByCourseId = new Map(statuses.map((s) => [s.courseId, s.status]));
    const prereqByCourseId = new Map<string, string[]>(
      allCourses.map((c) => [c.id, prerequisites.filter((p) => p.courseId === c.id).map((p) => p.prereqCourseId)]),
    );

    return allCourses.filter((c) => {
      const status = statusByCourseId.get(c.id);
      if (status === CourseStatus.PASSED) return false; // exclude completed
      if (c.minCreditsToOpen != null && completedCredits < c.minCreditsToOpen) return false;
      const prereqs = prereqByCourseId.get(c.id) || [];
      const unmet = prereqs.some((pid) => statusByCourseId.get(pid) !== CourseStatus.PASSED);
      if (unmet) return false;
      return true;
    });
  }

  validateScheduleConflicts(assignments: CandidateAssignment[], sections: ScheduledSection[]): ValidationReportItem[] {
    const sectionKey = (x: { dayOfWeek: string; slots: string[] }) => `${x.dayOfWeek}:${[...x.slots].sort().join(',')}`;
    const occupied = new Set<string>();
    const items: ValidationReportItem[] = [];
    for (const a of assignments) {
      let ok = true;
      for (const sa of a.sectionAssignments) {
        const key = sectionKey(sa);
        if (occupied.has(key)) {
          ok = false;
          break;
        }
        occupied.add(key);
      }
      items.push({ code: a.courseCode, ok, reason: ok ? undefined : 'Schedule conflict detected' });
    }
    return items;
  }

  validateCredits(assignments: CandidateAssignment[], courseByCode: Map<string, Course>): { total: number; ok: boolean } {
    const total = assignments.reduce((sum, a) => sum + (courseByCode.get(a.courseCode)?.creditHours || 0), 0);
    return { total, ok: true };
  }

  validateAll(args: {
    assignments: CandidateAssignment[];
    allCourses: Course[];
    sections: ScheduledSection[];
  }): ValidationResult {
    const { assignments, allCourses, sections } = args;
    const courseByCode = new Map(allCourses.map((c) => [c.code, c]));
    const conflictItems = this.validateScheduleConflicts(assignments, sections);
    const { total } = this.validateCredits(assignments, courseByCode);
    const items = conflictItems;
    const valid = items.every((i) => i.ok);
    return { valid, items, totalCredits: total };
  }
}


