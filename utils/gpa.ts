import { AcademicYear, GradeValue, Semester, Subject } from '@/types';

export function getGradePoints(grade: string, gradeScale: GradeValue[]): number {
  const found = gradeScale.find((g) => g.grade === grade);
  return found ? found.points : 0;
}

export function calculateSemesterGPA(subjects: Subject[], gradeScale: GradeValue[]): number {
  if (subjects.length === 0) return 0;
  let totalCredits = 0;
  let totalPoints = 0;
  for (const subject of subjects) {
    if (subject.grade && subject.credits > 0) {
      const points = getGradePoints(subject.grade, gradeScale);
      totalPoints += points * subject.credits;
      totalCredits += subject.credits;
    }
  }
  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

export function calculateYearGPA(semesters: Semester[], gradeScale: GradeValue[]): number {
  let totalCredits = 0;
  let totalPoints = 0;
  for (const sem of semesters) {
    for (const subject of sem.subjects) {
      if (subject.grade && subject.credits > 0) {
        const points = getGradePoints(subject.grade, gradeScale);
        totalPoints += points * subject.credits;
        totalCredits += subject.credits;
      }
    }
  }
  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

export function calculateCumulativeGPA(years: AcademicYear[], gradeScale: GradeValue[]): number {
  let totalCredits = 0;
  let totalPoints = 0;
  for (const year of years) {
    for (const sem of year.semesters) {
      for (const subject of sem.subjects) {
        if (subject.grade && subject.credits > 0) {
          const points = getGradePoints(subject.grade, gradeScale);
          totalPoints += points * subject.credits;
          totalCredits += subject.credits;
        }
      }
    }
  }
  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

export function getTotalCredits(years: AcademicYear[]): number {
  let total = 0;
  for (const year of years) {
    for (const sem of year.semesters) {
      for (const subject of sem.subjects) {
        total += subject.credits;
      }
    }
  }
  return total;
}

export function getTotalSubjects(years: AcademicYear[]): number {
  let total = 0;
  for (const year of years) {
    for (const sem of year.semesters) {
      total += sem.subjects.length;
    }
  }
  return total;
}

export function getGPAColor(gpa: number): string {
  if (gpa >= 3.7) return '#10B981';
  if (gpa >= 3.0) return '#3B82F6';
  if (gpa >= 2.0) return '#F59E0B';
  if (gpa > 0) return '#EF4444';
  return '#9CA0B0';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
