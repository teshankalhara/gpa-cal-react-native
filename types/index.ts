export interface GradeValue {
    grade: string;
    points: number;
  }
  
  export interface Subject {
    id: string;
    code: string;
    name: string;
    credits: number;
    grade: string;
  }
  
  export interface Semester {
    id: string;
    name: string;
    subjects: Subject[];
  }
  
  export interface AcademicYear {
    id: string;
    name: string;
    semesters: Semester[];
  }
  
  export interface Account {
    id: string;
    name: string;
    program: string;
    years: AcademicYear[];
    createdAt: number;
  }
  
  export interface AppData {
    accounts: Account[];
    gradeScale: GradeValue[];
  }
  
  export type ThemeMode = 'light' | 'dark' | 'system';
  