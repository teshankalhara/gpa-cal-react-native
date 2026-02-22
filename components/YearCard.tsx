import { useTheme } from '@/contexts/ThemeContext';
import { AcademicYear, GradeValue } from '@/types';
import { calculateYearGPA, getGPAColor } from '@/utils/gpa';
import { ChevronRight, GraduationCap } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface YearCardProps {
  year: AcademicYear;
  gradeScale: GradeValue[];
  onPress: () => void;
}

export default function YearCard({ year, gradeScale, onPress }: YearCardProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const gpa = calculateYearGPA(year.semesters, gradeScale);
  const gpaColor = getGPAColor(gpa);
  const totalSubjects = year.semesters.reduce((acc, s) => acc + s.subjects.length, 0);
  const totalCredits = year.semesters.reduce(
    (acc, s) => acc + s.subjects.reduce((a, sub) => a + sub.credits, 0),
    0
  );

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, tension: 100, friction: 10 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 10 }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
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
          <View style={[styles.iconBadge, { backgroundColor: gpaColor + '18' }]}>
            <GraduationCap size={22} color={gpaColor} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.yearName, { color: colors.text }]}>{year.name}</Text>
            <View style={styles.metaRow}>
              <Text style={[styles.meta, { color: colors.textSecondary }]}>
                {year.semesters.length} Semester{year.semesters.length !== 1 ? 's' : ''}
              </Text>
              <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
              <Text style={[styles.meta, { color: colors.textSecondary }]}>
                {totalSubjects} Subjects{totalSubjects !== 1 ? 's' : ''}
              </Text>
              <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
              <Text style={[styles.meta, { color: colors.textSecondary }]}>
                {totalCredits} Credits
              </Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={[styles.gpaValue, { color: gpaColor }]}>
              {gpa > 0 ? gpa.toFixed(2) : '—'}
            </Text>
            <ChevronRight size={18} color={colors.textTertiary} />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 15,
    paddingLeft:10,
    paddingRight:5,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  yearName: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  meta: {
    fontSize: 13,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 6,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gpaValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
});
