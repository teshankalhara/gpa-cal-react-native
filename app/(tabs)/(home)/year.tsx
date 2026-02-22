import AddItemModal from '@/components/AddItemModal';
import EmptyState from '@/components/EmptyState';
import GPACircle from '@/components/GPACircle';
import SemesterCard from '@/components/SemesterCard';
import { useGPA } from '@/contexts/GPAContext';
import { useTheme } from '@/contexts/ThemeContext';
import { calculateYearGPA } from '@/utils/gpa';
import { useResponsiveDimensions } from '@/utils/responsive';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, Plus, Trash2 } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function YearDetailScreen() {
    const { colors } = useTheme();
    const { width, scale } = useResponsiveDimensions();
    const { students, gradeScale, addSemester, deleteSemester, deleteYear } = useGPA();
    const { studentId, yearId } = useLocalSearchParams<{ studentId: string; yearId: string }>();
    const router = useRouter();
    const [showAddSem, setShowAddSem] = useState(false);
    const gpaSize = Math.round(Math.min(130 * scale, width * 0.42));

    const student = useMemo(() => students.find((s) => s.id === studentId), [students, studentId]);
    const year = useMemo(() => student?.years.find((y) => y.id === yearId), [student, yearId]);

    const yearGPA = useMemo(
        () => (year ? calculateYearGPA(year.semesters, gradeScale) : 0),
        [year, gradeScale]
    );

    const handleAddSemester = useCallback(
        (name: string) => {
            if (studentId && yearId) {
                addSemester(studentId, yearId, name);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        },
        [studentId, yearId, addSemester]
    );

    const handleDeleteSemester = useCallback(
        (semId: string, semName: string) => {
            Alert.alert('Delete Semester', `Delete "${semName}" and all subjects?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (studentId && yearId) {
                            deleteSemester(studentId, yearId, semId);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        }
                    },
                },
            ]);
        },
        [studentId, yearId, deleteSemester]
    );

    const handleDeleteYear = useCallback(() => {
        if (!year || !studentId) return;
        Alert.alert('Delete Year', `Delete "${year.name}" and all data?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    deleteYear(studentId, year.id);
                    router.back();
                },
            },
        ]);
    }, [year, studentId, deleteYear, router]);

    if (!student || !year) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.textSecondary }]}>Year not found</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    title: year.name,
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handleDeleteYear}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{
                                paddingHorizontal: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Trash2 size={22} color={colors.danger} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.gpaSection}>
                    <GPACircle gpa={yearGPA} size={gpaSize} label="Year GPA" />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Semesters</Text>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.accent }]}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowAddSem(true);
                        }}
                        testID="add-semester"
                    >
                        <Plus size={18} color="#fff" />
                        <Text style={styles.addButtonText}>Add Semester</Text>
                    </TouchableOpacity>
                </View>

                {year.semesters.length === 0 ? (
                    <EmptyState
                        icon={<BookOpen size={32} color={colors.textTertiary} />}
                        title="No Semesters"
                        subtitle='Tap "Add Semester" to add semesters like Semester 1, Semester 2, etc.'
                    />
                ) : (
                    year.semesters.map((sem) => (
                        <SemesterCard
                            key={sem.id}
                            semester={sem}
                            gradeScale={gradeScale}
                            onPress={() =>
                                router.push({
                                    pathname: '/semester' as any,
                                    params: { studentId, yearId: year.id, semId: sem.id },
                                })
                            }
                            onDelete={() => handleDeleteSemester(sem.id, sem.name)}
                        />
                    ))
                )}
            </ScrollView>

            <AddItemModal
                visible={showAddSem}
                title="Add Semester"
                placeholder="e.g. Semester 1"
                onClose={() => setShowAddSem(false)}
                onSubmit={handleAddSemester}
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
    gpaSection: {
        alignItems: 'center',
        paddingVertical: 16,
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
