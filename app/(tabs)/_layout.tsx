import { useTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import { Home, Settings } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { colors,isDark } = useTheme();

  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.textTertiary,
    
      tabBarBackground: () => (
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
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            justifyContent: 'center', // center content vertically
            alignItems: 'center',     // center content horizontally
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: isDark
                ? 'rgba(0,0,0,0.25)'
                : 'rgba(255,255,255,0.25)',
              width: '100%',
              justifyContent: 'center', // extra safety for centering icons
              alignItems: 'center',
            }}
          />
        </BlurView>
      ),
    
      tabBarStyle: {
        position: 'absolute',
        height: 80,
        paddingHorizontal:30,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        justifyContent: 'center', // vertical alignment
        alignItems: 'center',     // horizontal alignment
        bottom: 0,
      },
    
      tabBarIconStyle: {
        marginBottom: 0,
        alignSelf: 'center',
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