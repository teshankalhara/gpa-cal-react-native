import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Home, Settings } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.textTertiary,

    // iOS floating glass effect
    tabBarBackground:
      Platform.OS === 'ios'
        ? () => (
            <BlurView
              intensity={50}
              tint={isDark ? 'dark' : 'light'}
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                bottom: 10, // safe area
                height: 75,
                borderRadius: 35,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
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

    // Tab bar style
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute',      // fix to bottom of screen
        left: 0,
        right: 0,
        bottom: 10, // match blur offset
        height: 75,
        backgroundColor: 'transparent',
        paddingHorizontal:25,
        borderTopWidth: 0,
        justifyContent: 'center', // center icons vertically
        alignItems: 'center',     // center icons horizontally
        paddingBottom: 0,          // no extra padding needed
      },
      android: {
        height: 75,
        paddingTop:5,
        paddingHorizontal:15,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      },
    }),

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