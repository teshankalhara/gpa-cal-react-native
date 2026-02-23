import { useTheme } from '@/contexts/ThemeContext';
import { GradeValue, Account } from '@/types';
import { calculateCumulativeGPA, getGPAColor, getTotalCredits, getTotalSubjects } from '@/utils/gpa';
import { Award, BookOpen, ChevronRight } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AccountCardProps {
  account: Account;
  gradeScale: GradeValue[];
  onPress: () => void;
}

export default function AccountCard({ account, gradeScale, onPress }: AccountCardProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const gpa = calculateCumulativeGPA(account.years, gradeScale);
  const gpaColor = getGPAColor(gpa);
  const totalSubjects = getTotalSubjects(account.years);
  const totalCredits = getTotalCredits(account.years);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, tension: 100, friction: 10 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 10 }).start();
  };

  const initials = account.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      testID="account-card"
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
        <View style={styles.topRow}>
          <View style={[styles.avatar, { backgroundColor: gpaColor + '20' }]}>
            <Text style={[styles.avatarText, { color: gpaColor }]}>{initials || '?'}</Text>
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {account.name}
            </Text>
            {account.program ? (
              <Text style={[styles.program, { color: colors.textSecondary }]} numberOfLines={1}>
                {account.program}
              </Text>
            ) : null}
          </View>
          <View style={styles.gpaSection}>
            <Text style={[styles.gpaValue, { color: gpaColor }]}>
              {gpa > 0 ? gpa.toFixed(2) : '—'}
            </Text>
            <Text style={[styles.gpaLabel, { color: colors.textTertiary }]}>GPA</Text>
          </View>
          <ChevronRight size={18} color={colors.textTertiary} />
        </View>

        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <View style={styles.stat}>
            <BookOpen size={14} color={colors.textTertiary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {account.years.length} Year{account.years.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Award size={14} color={colors.textTertiary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {totalSubjects} Subject{totalSubjects !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {totalCredits} Credits
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  program: {
    fontSize: 13,
    marginTop: 2,
  },
  gpaSection: {
    alignItems: 'center',
    marginRight: 8,
  },
  gpaValue: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  gpaLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  statDivider: {
    width: 1,
    height: 16,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
