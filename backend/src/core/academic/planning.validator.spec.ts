import { PlanningValidator } from './planning.validator';

describe('PlanningValidator', () => {
  it('computes total credits and detects no conflicts for disjoint slots', () => {
    const v = new PlanningValidator();
    const allCourses: any[] = [
      { code: 'C1', creditHours: 3 },
      { code: 'C2', creditHours: 4 },
    ];
    const assignments = [
      { courseCode: 'C1', sectionAssignments: [{ type: 'THEORY', dayOfWeek: 'MON', slots: ['P1'] }] },
      { courseCode: 'C2', sectionAssignments: [{ type: 'THEORY', dayOfWeek: 'MON', slots: ['P2'] }] },
    ];
    const result = v.validateAll({ assignments, allCourses, sections: [] as any });
    expect(result.valid).toBe(true);
    expect(result.totalCredits).toBe(7);
  });

  it('filters out passed courses and those below min credits or with unmet prereqs', () => {
    const v = new PlanningValidator();
    const c1: any = { id: 'c1', code: 'C1', creditHours: 3 };
    const c2: any = { id: 'c2', code: 'C2', creditHours: 3, minCreditsToOpen: 60 };
    const c3: any = { id: 'c3', code: 'C3', creditHours: 3 };
    const prereq: any = { courseId: 'c3', prereqCourseId: 'c1' };
    const statuses: any[] = [
      { courseId: 'c1', status: 'PASSED' },
      { courseId: 'c2', status: 'FAILED' },
      { courseId: 'c3', status: 'FAILED' },
    ];
    const all = [c1, c2, c3];
    // completed credits = 3 (C1)
    const eligibleLow = v.filterEligibleCourses({ allCourses: all as any, statuses: statuses as any, prerequisites: [prereq] as any, completedCredits: 3 });
    expect(eligibleLow.map((c) => c.code)).toEqual(['C3']); // C1 passed excluded; C2 blocked by minCreditsToOpen; C3 blocked by unmet prereq -> but prereq C1 is passed, so allowed

    const eligibleHigh = v.filterEligibleCourses({ allCourses: all as any, statuses: statuses as any, prerequisites: [prereq] as any, completedCredits: 120 });
    expect(eligibleHigh.map((c) => c.code).sort()).toEqual(['C2', 'C3']);
  });
});


