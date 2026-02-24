// app/(tabs)/_homeLayout.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  const { colors, resolvedTheme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' as const },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background }, // prevent white flash during navigation
        animation: 'default', // smooth transition animation
      }}
    >
      <Stack.Screen name="index" options={{ title: 'GPA Calculator' }} />
      <Stack.Screen name="student" options={{ title: 'Account' }} />
      <Stack.Screen name="year" options={{ title: 'Year Details' }} />
      <Stack.Screen name="semester" options={{ title: 'Semester' }} />
    </Stack>
  );
}