import AddAccountModal from '@/components/AddAccountModal';
import EmptyState from '@/components/EmptyState';
import AccountCard from '@/components/AccountCard';
import { useGPA } from '@/contexts/GPAContext';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Plus, Users } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AccountsScreen() {
  const { colors } = useTheme();
  const { accounts, gradeScale, addAccount, deleteAccount, isLoading } = useGPA();
  const router = useRouter();
  const [showAddAccount, setShowAddAccount] = useState(false);

  const handleAddAccount = useCallback(
    (name: string, program: string) => {
      addAccount(name, program);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [addAccount]
  );

  const handleDeleteAccount = useCallback(
    (id: string, name: string) => {
      Alert.alert('Delete Account', `Delete "${name}" and all their data?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAccount(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]);
    },
    [deleteAccount]
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={[styles.heroBg, { backgroundColor: colors.accent + '12' }]}>
            <Users size={28} color={colors.accent} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            {accounts.length} Account{accounts.length !== 1 ? 's' : ''}
          </Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
            Track and compare GPAs across accounts
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Accounts</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAddAccount(true);
            }}
            testID="add-account"
          >
            <Plus size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add Account</Text>
          </TouchableOpacity>
        </View>

        {accounts.length === 0 ? (
          <EmptyState
            icon={<Users size={32} color={colors.textTertiary} />}
            title="No Accounts Yet"
            subtitle='Tap "Add Account" to start tracking GPA for your accounts.'
          />
        ) : (
          accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              gradeScale={gradeScale}
              onPress={() =>
                router.push({ pathname: '/student' as any, params: { accountId: account.id } })
              }
            />
          ))
        )}
      </ScrollView>

      <AddAccountModal
        visible={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        onSubmit={handleAddAccount}
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  heroBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 14,
    textAlign: 'center',
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
});
