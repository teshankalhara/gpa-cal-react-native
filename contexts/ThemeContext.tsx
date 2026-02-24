import Colors, { ThemeColors } from '@/constants/colors';
import { ThemeMode } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const THEME_STORAGE_KEY = 'gpa_theme_mode';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemScheme = useColorScheme();
  const queryClient = useQueryClient();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const themeQuery = useQuery({
    queryKey: ['themeMode'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return (stored as ThemeMode) || 'system';
    },
  });

  const themeMutation = useMutation({
    mutationFn: async (mode: ThemeMode) => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      return mode;
    },
    onSuccess: (mode) => {
      queryClient.setQueryData(['themeMode'], mode);
    },
  });

  useEffect(() => {
    if (themeQuery.data) {
      setThemeMode(themeQuery.data);
    }
  }, [themeQuery.data]);

  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const colors: ThemeColors = Colors[resolvedTheme];

  const setThemeModePersist = (mode: ThemeMode) => {
    setThemeMode(mode);
    themeMutation.mutate(mode);
  };

  return {
    themeMode,
    resolvedTheme,
    colors,
    isDark: resolvedTheme === 'dark',
    setThemeMode: setThemeModePersist,
  };
});
