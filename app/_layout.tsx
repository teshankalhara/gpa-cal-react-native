import { GPAProvider } from '@/contexts/GPAContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Href, Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ONBOARDING_KEY = 'gpa_onboarding_complete';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { resolvedTheme } = useTheme();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

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
    <>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerBackTitle: 'Back' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'none' }} />
      </Stack>
    </>
  );
}

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