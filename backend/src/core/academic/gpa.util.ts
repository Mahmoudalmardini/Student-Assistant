export function getCourseStatus(grade: number): 'Pass' | 'Conditional' | 'Fail' {
  if (grade >= 60) return 'Pass';
  if (grade >= 50) return 'Conditional';
  return 'Fail';
}

export function mapNumericToGradePoint(grade: number): number {
  if (grade >= 90) return 4.0;
  if (grade >= 85) return 3.7;
  if (grade >= 80) return 3.3;
  if (grade >= 75) return 3.0;
  if (grade >= 70) return 2.7;
  if (grade >= 65) return 2.3;
  if (grade >= 60) return 2.0;
  if (grade >= 55) return 1.7;
  if (grade >= 50) return 1.3;
  return 0.0;
}

export function classifyGpa(gpa: number): 'poor' | 'average' | 'good' | 'very good' | 'excellent' {
  if (gpa < 2) return 'poor';
  if (gpa <= 2.5) return 'average';
  if (gpa <= 3) return 'good';
  if (gpa <= 3.5) return 'very good';
  return 'excellent';
}


