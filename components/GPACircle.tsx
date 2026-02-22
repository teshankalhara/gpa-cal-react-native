import { useTheme } from '@/contexts/ThemeContext';
import { getGPAColor } from '@/utils/gpa';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface GPACircleProps {
  gpa: number;
  size?: number;
  label?: string;
}

export default function GPACircle({ gpa, size = 160, label }: GPACircleProps) {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [gpa]);

  const gpaColor = getGPAColor(gpa);
  const fontSize = size * 0.25;
  const labelSize = size * 0.09;
  const maxLabelSize = size * 0.075;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.surface,
          borderColor: gpaColor,
          borderWidth: size * 0.035,
          transform: [{ scale: animatedValue }],
        },
      ]}
    >
      <Text style={[styles.gpa, { fontSize, color: gpaColor }]}>
        {gpa > 0 ? gpa.toFixed(2) : '—'}
      </Text>
      {label && (
        <Text
          style={[styles.label, { fontSize: labelSize, color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
      <Text style={[styles.maxLabel, { fontSize: maxLabelSize, color: colors.textTertiary }]}>
        / 4.00
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  gpa: {
    fontWeight: '700' as const,
    letterSpacing: -1,
  },
  label: {
    fontWeight: '500' as const,
    marginTop: 2,
  },
  maxLabel: {
    fontWeight: '400' as const,
    marginTop: 1,
  },
});
