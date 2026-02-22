import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' as const },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'GPA Calculator' }} />
      <Stack.Screen name="student" options={{ title: 'Student' }} />
      <Stack.Screen name="year" options={{ title: 'Year Details' }} />
      <Stack.Screen name="semester" options={{ title: 'Semester' }} />
    </Stack>
  );
}