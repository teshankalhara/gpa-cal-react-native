import { useWindowDimensions } from 'react-native';

const BASE_WIDTH = 393;
const MAX_SCALE = 1.4;

/**
 * Returns window dimensions (updates on rotation/resize).
 * Use this instead of Dimensions.get('window') at module level.
 */
export function useResponsiveDimensions() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / BASE_WIDTH, MAX_SCALE);
  return { width, height, scale };
}
