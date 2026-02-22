import { DEFAULT_GRADE_SCALE } from '@/constants/grades';
import { AcademicYear, GradeValue, Semester, Student, Subject } from '@/types';
import { generateId } from '@/utils/gpa';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

const STUDENTS_KEY = 'gpa_students_data';
const GRADE_KEY = 'gpa_grade_scale';

export const [GPAProvider, useGPA] = createContextHook(() => {
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeValue[]>(DEFAULT_GRADE_SCALE);

  const dataQuery = useQuery({
    queryKey: ['gpaData'],
    queryFn: async () => {
      console.log('[GPAContext] Loading data from storage...');
      const [studentsData, gradeData] = await Promise.all([
        AsyncStorage.getItem(STUDENTS_KEY),
        AsyncStorage.getItem(GRADE_KEY),
      ]);
      return {
        students: studentsData ? JSON.parse(studentsData) as Student[] : [],
        gradeScale: gradeData ? JSON.parse(gradeData) as GradeValue[] : DEFAULT_GRADE_SCALE,
      };
    },
  });

  const saveStudentsMutation = useMutation({
    mutationFn: async (data: Student[]) => {
      console.log('[GPAContext] Saving students data...');
      await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(data));
      return data;
    },
  });

  const saveGradesMutation = useMutation({
    mutationFn: async (data: GradeValue[]) => {
      console.log('[GPAContext] Saving grade scale...');
      await AsyncStorage.setItem(GRADE_KEY, JSON.stringify(data));
      return data;
    },
  });

  useEffect(() => {
    if (dataQuery.data) {
      setStudents(dataQuery.data.students);
      setGradeScale(dataQuery.data.gradeScale);
    }
  }, [dataQuery.data]);

  const persistStudents = useCallback((updated: Student[]) => {
    setStudents(updated);
    saveStudentsMutation.mutate(updated);
  }, []);

  const addStudent = useCallback((name: string, program: string) => {
    const newStudent: Student = {
      id: generateId(),
      name,
      program,
      years: [],
      createdAt: Date.now(),
    };
    const updated = [...students, newStudent];
    persistStudents(updated);
    return newStudent;
  }, [students, persistStudents]);

  const updateStudent = useCallback((id: string, name: string, program: string) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, name, program } : s
    );
    persistStudents(updated);
  }, [students, persistStudents]);

  const deleteStudent = useCallback((id: string) => {
    const updated = students.filter((s) => s.id !== id);
    persistStudents(updated);
  }, [students, persistStudents]);

  const getStudent = useCallback((id: string) => {
    return students.find((s) => s.id === id);
  }, [students]);

  const addYear = useCallback((studentId: string, name: string) => {
    const newYear: AcademicYear = { id: generateId(), name, semesters: [] };
    const updated = students.map((s) =>
      s.id === studentId ? { ...s, years: [...s.years, newYear] } : s
    );
    persistStudents(updated);
    return newYear;
  }, [students, persistStudents]);

  const updateYear = useCallback((studentId: string, yearId: string, name: string) => {
    const updated = students.map((s) =>
      s.id === studentId
        ? { ...s, years: s.years.map((y) => (y.id === yearId ? { ...y, name } : y)) }
        : s
    );
    persistStudents(updated);
  }, [students, persistStudents]);

  const deleteYear = useCallback((studentId: string, yearId: string) => {
    const updated = students.map((s) =>
      s.id === studentId
        ? { ...s, years: s.years.filter((y) => y.id !== yearId) }
        : s
    );
    persistStudents(updated);
  }, [students, persistStudents]);

  const addSemester = useCallback((studentId: string, yearId: string, name: string) => {
    const newSem: Semester = { id: generateId(), name, subjects: [] };
    const updated = students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            years: s.years.map((y) =>
              y.id === yearId ? { ...y, semesters: [...y.semesters, newSem] } : y
            ),
          }
        : s
    );
    persistStudents(updated);
    return newSem;
  }, [students, persistStudents]);

  const updateSemester = useCallback((studentId: string, yearId: string, semId: string, name: string) => {
    const updated = students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            years: s.years.map((y) =>
              y.id === yearId
                ? { ...y, semesters: y.semesters.map((sem) => (sem.id === semId ? { ...sem, name } : sem)) }
                : y
            ),
          }
        : s
    );
    persistStudents(updated);
  }, [students, persistStudents]);

  const deleteSemester = useCallback((studentId: string, yearId: string, semId: string) => {
    const updated = students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            years: s.years.map((y) =>
              y.id === yearId
                ? { ...y, semesters: y.semesters.filter((sem) => sem.id !== semId) }
                : y
            ),
          }
        : s
    );
    persistStudents(updated);
  }, [students, persistStudents]);

  const addSubject = useCallback((studentId: string, yearId: string, semId: string, subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...subject, id: generateId() };
    const updated = students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            years: s.years.map((y) =>
              y.id === yearId
                ? {
                    ...y,
                    semesters: y.semesters.map((sem) =>
                      sem.id === semId ? { ...sem, subjects: [...sem.subjects, newSubject] } : sem
                    ),
                  }
                : y
            ),
          }
        : s
    );
    persistStudents(updated);
    return newSubject;
  }, [students, persistStudents]);

  const updateSubject = useCallback(
    (studentId: string, yearId: string, semId: string, subjectId: string, data: Partial<Omit<Subject, 'id'>>) => {
      const updated = students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              years: s.years.map((y) =>
                y.id === yearId
                  ? {
                      ...y,
                      semesters: y.semesters.map((sem) =>
                        sem.id === semId
                          ? {
                              ...sem,
                              subjects: sem.subjects.map((sub) =>
                                sub.id === subjectId ? { ...sub, ...data } : sub
                              ),
                            }
                          : sem
                      ),
                    }
                  : y
              ),
            }
          : s
      );
      persistStudents(updated);
    },
    [students, persistStudents]
  );

  const deleteSubject = useCallback((studentId: string, yearId: string, semId: string, subjectId: string) => {
    const updated = students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            years: s.years.map((y) =>
              y.id === yearId
                ? {
                    ...y,
                    semesters: y.semesters.map((sem) =>
                      sem.id === semId
                        ? { ...sem, subjects: sem.subjects.filter((sub) => sub.id !== subjectId) }
                        : sem
                    ),
                  }
                : y
            ),
          }
        : s
    );
    persistStudents(updated);
  }, [students, persistStudents]);

  const updateGradeScale = useCallback((newScale: GradeValue[]) => {
    setGradeScale(newScale);
    saveGradesMutation.mutate(newScale);
  }, []);

  const resetGradeScale = useCallback(() => {
    setGradeScale(DEFAULT_GRADE_SCALE);
    saveGradesMutation.mutate(DEFAULT_GRADE_SCALE);
  }, []);

  const importGradeScale = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as GradeValue[];
      if (Array.isArray(parsed) && parsed.every((g) => typeof g.grade === 'string' && typeof g.points === 'number')) {
        setGradeScale(parsed);
        saveGradesMutation.mutate(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return {
    students,
    gradeScale,
    isLoading: dataQuery.isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    addYear,
    updateYear,
    deleteYear,
    addSemester,
    updateSemester,
    deleteSemester,
    addSubject,
    updateSubject,
    deleteSubject,
    updateGradeScale,
    resetGradeScale,
    importGradeScale,
  };
});
