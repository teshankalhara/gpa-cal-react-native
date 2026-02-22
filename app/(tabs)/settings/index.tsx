import { useGPA } from '@/contexts/GPAContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeMode } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
    ChevronRight,
    Moon,
    RotateCcw,
    Scale,
    Smartphone,
    Sun,
    Trash2,
    Users
} from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'system', label: 'System', icon: Smartphone },
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'dark', label: 'Dark', icon: Moon },
];

export default function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { resetGradeScale, students } = useGPA();
  const router = useRouter();

  const totalYears = students.reduce((a, s) => a + s.years.length, 0);
  const totalSemesters = students.reduce(
    (a, s) => a + s.years.reduce((b, y) => b + y.semesters.length, 0),
    0
  );
  const totalSubjects = students.reduce(
    (a, s) =>
      a + s.years.reduce((b, y) => b + y.semesters.reduce((c, sem) => c + sem.subjects.length, 0), 0),
    0
  );

  const handleResetGrades = () => {
    Alert.alert('Reset Grade Scale', 'Restore default grade scale values?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetGradeScale();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all students, years, semesters, subjects, and reset grade scale. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['gpa_students_data', 'gpa_grade_scale']);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Done', 'All data has been cleared. Please restart the app.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = themeMode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor: isActive ? colors.accent : colors.surfaceAlt,
                      borderColor: isActive ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setThemeMode(opt.mode);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Icon size={18} color={isActive ? '#fff' : colors.textSecondary} />
                  <Text
                    style={[
                      styles.themeLabel,
                      { color: isActive ? '#fff' : colors.textSecondary },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Grade Configuration</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings/grades' as any)}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.accentLight }]}>
                <Scale size={18} color={colors.accent} />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Grade Scale</Text>
                <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                  Edit grade values & points
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.menuItem} onPress={handleResetGrades}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.warningLight }]}>
                <RotateCcw size={18} color={colors.warning} />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Reset Grade Scale</Text>
                <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                  Restore default values
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Data</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.surfaceAlt }]}>
                <Users size={18} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Summary</Text>
                <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                  {students.length} student{students.length !== 1 ? 's' : ''},{' '}
                  {totalYears} year{totalYears !== 1 ? 's' : ''},{' '}
                  {totalSemesters} semester{totalSemesters !== 1 ? 's' : ''},{' '}
                  {totalSubjects} subject{totalSubjects !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.menuItem} onPress={handleClearAll}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: colors.dangerLight }]}>
                <Trash2 size={18} color={colors.danger} />
              </View>
              <View>
                <Text style={[styles.menuTitle, { color: colors.danger }]}>Clear All Data</Text>
                <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                  Delete everything permanently
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          GPA Calculator v1.0
        </Text>
      </ScrollView>
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  menuSub: {
    fontSize: 12,
    marginTop: 1,
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 32,
  },
});
