import { useTheme } from '@/contexts/ThemeContext';
import { GradeValue, Semester } from '@/types';
import { calculateSemesterGPA, getGPAColor } from '@/utils/gpa';
import { BookOpen, ChevronRight, Trash2 } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SemesterCardProps {
  semester: Semester;
  gradeScale: GradeValue[];
  onPress: () => void;
  onDelete?: () => void;
}

export default function SemesterCard({ semester, gradeScale, onPress, onDelete }: SemesterCardProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const gpa = calculateSemesterGPA(semester.subjects, gradeScale);
  const gpaColor = getGPAColor(gpa);
  const totalCredits = semester.subjects.reduce((a, s) => a + s.credits, 0);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, tension: 100, friction: 10 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 10 }).start();
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.rowTouchable}
        >
          <View style={[styles.iconBadge, { backgroundColor: gpaColor + '18' }]}>
            <BookOpen size={20} color={gpaColor} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.text }]}>{semester.name}</Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {semester.subjects.length} Subject{semester.subjects.length !== 1 ? 's' : ''} · {totalCredits} Credits
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={[styles.gpaValue, { color: gpaColor }]}>
              {gpa > 0 ? gpa.toFixed(2) : '—'}
            </Text>
            <ChevronRight size={18} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>
        {onDelete ? (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.deleteBtn}
            testID="delete-semester"
          >
            <Trash2 size={18} color={colors.danger} />
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deleteBtn: {
    padding: 4,
  },
  gpaValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
});
