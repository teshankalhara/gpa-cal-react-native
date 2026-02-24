import { useTheme } from '@/contexts/ThemeContext';
import { GradeValue, Subject } from '@/types';
import { getGPAColor, getGradePoints } from '@/utils/gpa';
import { Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SubjectRowProps {
  subject: Subject;
  gradeScale: GradeValue[];
  onDelete: () => void;
  onEdit: () => void;
}

export default function SubjectRow({ subject, gradeScale, onDelete, onEdit }: SubjectRowProps) {
  const { colors } = useTheme();
  const points = getGradePoints(subject.grade, gradeScale);
  const gradeColor = getGPAColor(points);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onEdit}
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.left}>
        <View style={styles.codeRow}>
          <Text style={[styles.code, { color: colors.accent }]}>{subject.code}</Text>
          <View style={[styles.creditBadge, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.creditText, { color: colors.textSecondary }]}>{subject.credits} Cr</Text>
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {subject.name}
        </Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.gradeBadge, { backgroundColor: gradeColor + '18' }]}>
          <Text style={[styles.gradeText, { color: gradeColor }]}>{subject.grade || '—'}</Text>
        </View>
        <View onStartShouldSetResponder={() => true}>
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} testID="delete-subject">
            <Trash2 size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  code: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  creditBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  creditText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  name: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginTop: 3,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
});
