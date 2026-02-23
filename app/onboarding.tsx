import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, router } from 'expo-router';
import { BarChart3, GraduationCap, Users } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveDimensions } from '@/utils/responsive';

const ONBOARDING_KEY = 'gpa_onboarding_complete';

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: 'cap' | 'chart' | 'users';
  accentColor: string;
  bgPattern: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Track Your GPA',
    subtitle:
      'Organize your academic journey by years, semesters, and subjects. Stay on top of your grades effortlessly.',
    icon: 'cap',
    accentColor: '#10B981',
    bgPattern: '#0D9668',
  },
  {
    id: '2',
    title: 'Detailed Analytics',
    subtitle:
      'View semester-wise and year-wise GPA breakdowns. Customize your grading scale to match your university.',
    icon: 'chart',
    accentColor: '#3B82F6',
    bgPattern: '#2563EB',
  },
  {
    id: '3',
    title: 'Multiple Accounts',
    subtitle:
      'Manage GPA records for multiple accounts in one place. Perfect for tutors, parents, or study groups.',
    icon: 'users',
    accentColor: '#F59E0B',
    bgPattern: '#D97706',
  },
];

export default function OnboardingScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, scale } = useResponsiveDimensions();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
    }
  }, [currentIndex]);

  const handleGetStarted = useCallback(async () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/(tabs)/(home)' as Href);
    });
  }, [buttonScale]);

  const handleSkip = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)/(home)' as Href);
  }, []);

  const renderIcon = (slide: OnboardingSlide, animated: boolean) => {
    const size = Math.round(64 * scale);
    const color = '#FFFFFF';
    switch (slide.icon) {
      case 'cap':
        return <GraduationCap size={size} color={color} />;
      case 'chart':
        return <BarChart3 size={size} color={color} />;
      case 'users':
        return <Users size={size} color={color} />;
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const iconTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [60, 0, -60],
      extrapolate: 'clamp',
    });

    const iconOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const textTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [40, 0, -40],
      extrapolate: 'clamp',
    });

    const textOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const outerSize = Math.round(220 * scale);
    const middleSize = Math.round(170 * scale);
    const innerSize = Math.round(120 * scale);
    return (
      <View style={[styles.slide, { width, paddingHorizontal: 32 * scale }]}>
        <View style={[styles.illustrationContainer, { marginBottom: 48 * scale }]}>
          <View
            style={[
              styles.iconCircleOuter,
              {
                width: outerSize,
                height: outerSize,
                borderRadius: outerSize / 2,
                backgroundColor: item.accentColor + '15',
              },
            ]}
          >
            <View
              style={[
                styles.iconCircleMiddle,
                {
                  width: middleSize,
                  height: middleSize,
                  borderRadius: middleSize / 2,
                  backgroundColor: item.accentColor + '25',
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.iconCircle,
                  {
                    width: innerSize,
                    height: innerSize,
                    borderRadius: innerSize / 2,
                    backgroundColor: item.accentColor,
                    transform: [{ translateY: iconTranslateY }],
                    opacity: iconOpacity,
                  },
                ]}
              >
                {renderIcon(item, true)}
              </Animated.View>
            </View>
          </View>
        </View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: textTranslateY }],
              opacity: textOpacity,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text, fontSize: 28 * scale }]}>{item.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, maxWidth: 300 * scale, fontSize: 16 * scale, lineHeight: 24 * scale }]}>
            {item.subtitle}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.skipRow, { paddingTop: insets.top + 12 }]}>
        {!isLast ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton} testID="onboarding-skip">
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        testID="onboarding-flatlist"
      />

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 24, paddingHorizontal: 32 * scale }]}>
        <View style={[styles.pagination, { marginBottom: 28 * scale, gap: 8 * scale }]}>
          {slides.map((slide, index) => {
            const dotScaleX = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [1, 28 / 8, 1],
              extrapolate: 'clamp',
            });

            const dotOpacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            const dotSize = 8 * scale;
            return (
              <Animated.View
                key={slide.id}
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                    opacity: dotOpacity,
                    backgroundColor: slides[currentIndex].accentColor,
                    transform: [{ scaleX: dotScaleX }],
                  },
                ]}
              />
            );
          })}
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: slides[currentIndex].accentColor,
                height: 56 * scale,
                borderRadius: 16 * scale,
              },
            ]}
            onPress={isLast ? handleGetStarted : handleNext}
            activeOpacity={0.85}
            testID="onboarding-next"
          >
            <Text style={[styles.buttonText, { fontSize: 17 * scale }]}>
              {isLast ? 'Get Started' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  iconCircleOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleMiddle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
    }),
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 300,
  },
  bottomSection: {
    paddingHorizontal: 32,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: 0.2,
  },
});
