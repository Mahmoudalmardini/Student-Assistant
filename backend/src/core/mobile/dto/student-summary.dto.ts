export type StudentSummary = {
  name: string;
  busRegistered: boolean;
  cumulativeGpa: { value: number; classification: string };
  semesterGpas: { semesterId: string; semesterName: string; value: number; classification: string }[];
  courses: {
    courseId: string;
    code: string;
    name: string;
    creditHours: number;
    semesterId: string;
    semesterName: string;
    gradeNumeric: number;
    gradePoint: number;
    status: string;
  }[];
};
