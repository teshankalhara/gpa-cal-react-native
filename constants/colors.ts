export const Colors = {
    light: {
      background: '#F5F6FA',
      surface: '#FFFFFF',
      surfaceAlt: '#EEF0F6',
      text: '#1A1D27',
      textSecondary: '#6B7085',
      textTertiary: '#9CA0B0',
      border: '#E2E4ED',
      accent: '#10B981',
      accentLight: '#D1FAE5',
      accentDark: '#059669',
      danger: '#EF4444',
      dangerLight: '#FEE2E2',
      warning: '#F59E0B',
      warningLight: '#FEF3C7',
      tabBar: '#FFFFFF',
      tabBarBorder: '#E2E4ED',
      cardShadow: 'rgba(0,0,0,0.06)',
      statusBar: 'dark' as const,
      headerBg: '#FFFFFF',
    },
    dark: {
      background: '#0F1117',
      surface: '#1A1D27',
      surfaceAlt: '#242836',
      text: '#F0F1F5',
      textSecondary: '#9CA0B0',
      textTertiary: '#6B7085',
      border: '#2A2E3D',
      accent: '#10B981',
      accentLight: '#064E3B',
      accentDark: '#34D399',
      danger: '#EF4444',
      dangerLight: '#7F1D1D',
      warning: '#F59E0B',
      warningLight: '#78350F',
      tabBar: '#1A1D27',
      tabBarBorder: '#2A2E3D',
      cardShadow: 'rgba(0,0,0,0.3)',
      statusBar: 'light' as const,
      headerBg: '#1A1D27',
    },
  };
  
  export interface ThemeColors {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    accent: string;
    accentLight: string;
    accentDark: string;
    danger: string;
    dangerLight: string;
    warning: string;
    warningLight: string;
    tabBar: string;
    tabBarBorder: string;
    cardShadow: string;
    statusBar: 'dark' | 'light';
    headerBg: string;
  }
  
  export default Colors;
  