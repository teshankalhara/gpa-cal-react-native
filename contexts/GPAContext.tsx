import { DEFAULT_GRADE_SCALE } from '@/constants/grades';
import { AcademicYear, GradeValue, Semester, Account, Subject } from '@/types';
import { generateId } from '@/utils/gpa';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

const ACCOUNTS_KEY = 'gpa_accounts_data';
const GRADE_KEY = 'gpa_grade_scale';

export const [GPAProvider, useGPA] = createContextHook(() => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeValue[]>(DEFAULT_GRADE_SCALE);

  const dataQuery = useQuery({
    queryKey: ['gpaData'],
    queryFn: async () => {
      console.log('[GPAContext] Loading data from storage...');
      const [accountsData, gradeData] = await Promise.all([
        AsyncStorage.getItem(ACCOUNTS_KEY),
        AsyncStorage.getItem(GRADE_KEY),
      ]);
      return {
        accounts: accountsData ? JSON.parse(accountsData) as Account[] : [],
        gradeScale: gradeData ? JSON.parse(gradeData) as GradeValue[] : DEFAULT_GRADE_SCALE,
      };
    },
  });

  const saveAccountsMutation = useMutation({
    mutationFn: async (data: Account[]) => {
      console.log('[GPAContext] Saving accounts data...');
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(data));
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
      setAccounts(dataQuery.data.accounts);
      setGradeScale(dataQuery.data.gradeScale);
    }
  }, [dataQuery.data]);

  const persistAccounts = useCallback((updated: Account[]) => {
    setAccounts(updated);
    saveAccountsMutation.mutate(updated);
  }, []);

  const addAccount = useCallback((name: string, program: string) => {
    const newAccount: Account = {
      id: generateId(),
      name,
      program,
      years: [],
      createdAt: Date.now(),
    };
    const updated = [...accounts, newAccount];
    persistAccounts(updated);
    return newAccount;
  }, [accounts, persistAccounts]);

  const updateAccount = useCallback((id: string, name: string, program: string) => {
    const updated = accounts.map((s) =>
      s.id === id ? { ...s, name, program } : s
    );
    persistAccounts(updated);
  }, [accounts, persistAccounts]);

  const deleteAccount = useCallback((id: string) => {
    const updated = accounts.filter((s) => s.id !== id);
    persistAccounts(updated);
  }, [accounts, persistAccounts]);

  const getAccount = useCallback((id: string) => {
    return accounts.find((s) => s.id === id);
  }, [accounts]);

  const addYear = useCallback((accountId: string, name: string) => {
    const newYear: AcademicYear = { id: generateId(), name, semesters: [] };
    const updated = accounts.map((s) =>
      s.id === accountId ? { ...s, years: [...s.years, newYear] } : s
    );
    persistAccounts(updated);
    return newYear;
  }, [accounts, persistAccounts]);

  const updateYear = useCallback((accountId: string, yearId: string, name: string) => {
    const updated = accounts.map((s) =>
      s.id === accountId
        ? { ...s, years: s.years.map((y) => (y.id === yearId ? { ...y, name } : y)) }
        : s
    );
    persistAccounts(updated);
  }, [accounts, persistAccounts]);

  const deleteYear = useCallback((accountId: string, yearId: string) => {
    const updated = accounts.map((s) =>
      s.id === accountId
        ? { ...s, years: s.years.filter((y) => y.id !== yearId) }
        : s
    );
    persistAccounts(updated);
  }, [accounts, persistAccounts]);

  const addSemester = useCallback((accountId: string, yearId: string, name: string) => {
    const newSem: Semester = { id: generateId(), name, subjects: [] };
    const updated = accounts.map((s) =>
      s.id === accountId
        ? {
            ...s,
            years: s.years.map((y) =>
              y.id === yearId ? { ...y, semesters: [...y.semesters, newSem] } : y
            ),
          }
        : s
    );
    persistAccounts(updated);
    return newSem;
  }, [accounts, persistAccounts]);

  const updateSemester = useCallback((accountId: string, yearId: string, semId: string, name: string) => {
    const updated = accounts.map((s) =>
      s.id === accountId
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
    persistAccounts(updated);
  }, [accounts, persistAccounts]);

  const deleteSemester = useCallback((accountId: string, yearId: string, semId: string) => {
    const updated = accounts.map((s) =>
      s.id === accountId
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
    persistAccounts(updated);
  }, [accounts, persistAccounts]);

  const addSubject = useCallback((accountId: string, yearId: string, semId: string, subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...subject, id: generateId() };
    const updated = accounts.map((s) =>
      s.id === accountId
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
    persistAccounts(updated);
    return newSubject;
  }, [accounts, persistAccounts]);

  const updateSubject = useCallback(
    (accountId: string, yearId: string, semId: string, subjectId: string, data: Partial<Omit<Subject, 'id'>>) => {
      const updated = accounts.map((s) =>
        s.id === accountId
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
      persistAccounts(updated);
    },
    [accounts, persistAccounts]
  );

  const deleteSubject = useCallback((accountId: string, yearId: string, semId: string, subjectId: string) => {
    const updated = accounts.map((s) =>
      s.id === accountId
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
    persistAccounts(updated);
  }, [accounts, persistAccounts]);

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
    accounts,
    gradeScale,
    isLoading: dataQuery.isLoading,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccount,
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
