import AddSubjectModal from '@/components/AddSubjectModal';
import EmptyState from '@/components/EmptyState';
import GPACircle from '@/components/GPACircle';
import SubjectRow from '@/components/SubjectRow';
import { useGPA } from '@/contexts/GPAContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Subject } from '@/types';
import { calculateSemesterGPA } from '@/utils/gpa';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FileText, Plus } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useResponsiveDimensions } from '@/utils/responsive';

export default function SemesterDetailScreen() {
  const { colors } = useTheme();
  const { width, scale } = useResponsiveDimensions();
  const { accounts, gradeScale, addSubject, updateSubject, deleteSubject } = useGPA();
  const { accountId, yearId, semId } = useLocalSearchParams<{ accountId: string; yearId: string; semId: string }>();
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const gpaSize = Math.round(Math.min(110 * scale, width * 0.36));

  const account = useMemo(() => accounts.find((s) => s.id === accountId), [accounts, accountId]);
  const year = useMemo(() => account?.years.find((y) => y.id === yearId), [account, yearId]);
  const semester = useMemo(() => year?.semesters.find((s) => s.id === semId), [year, semId]);

  const semGPA = useMemo(
    () => (semester ? calculateSemesterGPA(semester.subjects, gradeScale) : 0),
    [semester, gradeScale]
  );

  const totalCredits = useMemo(
    () => semester?.subjects.reduce((a, s) => a + s.credits, 0) ?? 0,
    [semester]
  );

  const handleAddSubject = useCallback(
    (data: Omit<Subject, 'id'>) => {
      if (accountId && yearId && semId) {
        if (editingSubject) {
          updateSubject(accountId, yearId, semId, editingSubject.id, data);
        } else {
          addSubject(accountId, yearId, semId, data);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setEditingSubject(null);
      }
    },
    [accountId, yearId, semId, editingSubject, addSubject, updateSubject]
  );

  const handleDeleteSubject = useCallback(
    (subId: string, subName: string) => {
      if (Platform.OS === 'web') {
        const ok = window.confirm(`Delete Subject\n\nDelete "${subName}"?`);
        if (ok && accountId && yearId && semId) {
          deleteSubject(accountId, yearId, semId, subId);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        return;
      }
      Alert.alert('Delete Subject', `Delete "${subName}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (accountId && yearId && semId) {
              deleteSubject(accountId, yearId, semId, subId);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
        },
      ]);
    },
    [accountId, yearId, semId, deleteSubject]
  );

  if (!account || !year || !semester) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Semester not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: `${year.name} — ${semester.name}`,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <GPACircle gpa={semGPA} size={gpaSize} label="Semester GPA" />
          <View style={styles.statsCol}>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{semester.subjects.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Subjects</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{totalCredits}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Credits</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Subjects</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setEditingSubject(null);
              setShowAddSubject(true);
            }}
            testID="add-subject"
          >
            <Plus size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add Subject</Text>
          </TouchableOpacity>
        </View>

        {semester.subjects.length === 0 ? (
          <EmptyState
            icon={<FileText size={32} color={colors.textTertiary} />}
            title="No Subjects"
            subtitle='Tap "Add Subject" to add courses with their code, credits, and grade.'
          />
        ) : (
          semester.subjects.map((subject) => (
            <SubjectRow
              key={subject.id}
              subject={subject}
              gradeScale={gradeScale}
              onDelete={() => handleDeleteSubject(subject.id, subject.name)}
              onEdit={() => {
                setEditingSubject(subject);
                setShowAddSubject(true);
              }}
            />
          ))
        )}
      </ScrollView>

      <AddSubjectModal
        visible={showAddSubject}
        onClose={() => {
          setShowAddSubject(false);
          setEditingSubject(null);
        }}
        onSubmit={handleAddSubject}
        initialData={editingSubject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 16,
  },
  statsCol: {
    gap: 10,
  },
  statBox: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
