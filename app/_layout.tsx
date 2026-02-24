// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Href, Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { GPAProvider } from '@/contexts/GPAContext';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Home, Settings } from 'lucide-react-native';

const ONBOARDING_KEY = 'gpa_onboarding_complete';
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// tab layout
export function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,

        // iOS only floating glass tab
        tabBarBackground:
          Platform.OS === 'ios'
            ? () => (
              <BlurView
                intensity={50}
                tint={isDark ? 'dark' : 'light'}
                style={{
                  position: 'absolute',
                  left: 15,
                  right: 15,
                  bottom: 15,
                  height: 75,
                  borderRadius: 35,
                  overflow: 'hidden',
                  boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: isDark
                      ? 'rgba(0,0,0,0.25)'
                      : 'rgba(255,255,255,0.25)',
                  }}
                />
              </BlurView>
            )
            : undefined,

        // Tab bar style per platform
        tabBarStyle:
          Platform.OS === 'ios'
            ? {
              position: 'absolute',
              height: 80,
              paddingHorizontal: 30,
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 0,
            }
            : {
              height: 70,
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: 10,
            },

        tabBarIconStyle: {
          alignSelf: 'center',
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          textAlign: 'center',
          marginTop: 2,
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';

// root layout navigation
function RootLayoutNav() {
  const { colors, resolvedTheme, isDark } = useTheme();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Create a custom theme for React Navigation to match our app colors
  // This prevents the white frame during transitions
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
    },
  };

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const done = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (done !== 'true') {
          setShowOnboarding(true);
        }
      } catch (e) {
        console.log('Error checking onboarding status:', e);
      } finally {
        setIsReady(true);
      }
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
      if (showOnboarding) {
        router.replace('/onboarding' as Href);
      }
    }
  }, [isReady, showOnboarding]);

  if (!isReady) return <View />;

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          contentStyle: { backgroundColor: colors.background }, // prevent white flash
          animation: 'default', // smooth transitions
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, animation: 'none' }}
        />
      </Stack>
    </NavThemeProvider>
  );
}

// root layout
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <GPAProvider>
            <RootLayoutNav />
          </GPAProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}