import AddItemModal from '@/components/AddItemModal';
import EmptyState from '@/components/EmptyState';
import GPACircle from '@/components/GPACircle';
import YearCard from '@/components/YearCard';
import { useGPA } from '@/contexts/GPAContext';
import { useTheme } from '@/contexts/ThemeContext';
import { calculateCumulativeGPA, getTotalCredits, getTotalSubjects } from '@/utils/gpa';
import { useResponsiveDimensions } from '@/utils/responsive';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Award, BookOpen, GraduationCap, Plus, Trash2 } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AccountDashboardScreen() {
    const { colors } = useTheme();
    const { width, scale } = useResponsiveDimensions();
    const { accounts, gradeScale, addYear, deleteYear, deleteAccount, isLoading } = useGPA();
    const { accountId } = useLocalSearchParams<{ accountId: string }>();
    const router = useRouter();
    const [showAddYear, setShowAddYear] = useState(false);
    const gpaSize = Math.round(Math.min(160 * scale, width * 0.5));

    const account = useMemo(() => accounts.find((s) => s.id === accountId), [accounts, accountId]);

    const cumulativeGPA = useMemo(
        () => (account ? calculateCumulativeGPA(account.years, gradeScale) : 0),
        [account, gradeScale]
    );
    const totalCredits = useMemo(() => (account ? getTotalCredits(account.years) : 0), [account]);
    const totalSubjects = useMemo(() => (account ? getTotalSubjects(account.years) : 0), [account]);

    const handleAddYear = useCallback(
        (name: string) => {
            if (accountId) {
                addYear(accountId, name);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        },
        [accountId, addYear]
    );

    const handleDeleteAccount = useCallback(() => {
        if (!account) return;
        Alert.alert('Delete Account', `Delete "${account.name}" and all their data?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    deleteAccount(account.id);
                    router.back();
                },
            },
        ]);
    }, [account, deleteAccount, router]);

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    if (!account) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.textSecondary }]}>Account not found</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen
                options={{
                    title: account.name,
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handleDeleteAccount}
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
                    headerBackTitle: 'Back',
                }}
            />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {account.program ? (
                    <Text style={[styles.programBadge, { color: colors.accent, backgroundColor: colors.accentLight }]}>
                        {account.program}
                    </Text>
                ) : null}

                <View style={styles.gpaSection}>
                    <GPACircle gpa={cumulativeGPA} size={gpaSize} label="Cumulative GPA" />
                </View>

                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <GraduationCap size={18} color={colors.accent} />
                        <Text style={[styles.statValue, { color: colors.text }]}>{account.years.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Years</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <BookOpen size={18} color="#3B82F6" />
                        <Text style={[styles.statValue, { color: colors.text }]}>{totalSubjects}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Subjects</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Award size={18} color="#F59E0B" />
                        <Text style={[styles.statValue, { color: colors.text }]}>{totalCredits}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Credits</Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Academic Years</Text>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.accent }]}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowAddYear(true);
                        }}
                        testID="add-year"
                    >
                        <Plus size={18} color="#fff" />
                        <Text style={styles.addButtonText}>Add Year</Text>
                    </TouchableOpacity>
                </View>

                {account.years.length === 0 ? (
                    <EmptyState
                        icon={<GraduationCap size={32} color={colors.textTertiary} />}
                        title="No Academic Years"
                        subtitle='Tap "Add Year" to start tracking GPA. Add years like 1st Year, 2nd Year, etc.'
                    />
                ) : (
                    account.years.map((year) => (
                        <YearCard
                            key={year.id}
                            year={year}
                            gradeScale={gradeScale}
                            onPress={() =>
                                router.push({
                                    pathname: '/year' as any,
                                    params: { accountId: account.id, yearId: year.id },
                                })
                            }
                        />
                    ))
                )}
            </ScrollView>

            <AddItemModal
                visible={showAddYear}
                title="Add Academic Year"
                placeholder="e.g. 1st Year"
                onClose={() => setShowAddYear(false)}
                onSubmit={handleAddYear}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scroll: {
        padding: 20,
        paddingBottom: 40,
    },
    programBadge: {
        alignSelf: 'center',
        fontSize: 13,
        fontWeight: '600' as const,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 4,
    },
    gpaSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        gap: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700' as const,
    },
    statLabel: {
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
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
