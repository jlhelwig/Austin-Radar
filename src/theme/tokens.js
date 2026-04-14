/**
 * Austin Radar Design Tokens
 * 
 * Centralized theme configuration for neon/dark "Radar" aesthetic.
 * Adheres to Milestone 1 structural refinement.
 */

export const Colors = {
  // Brand Colors
  neonGreen: '#00FF00',
  deepBlack: '#000000',
  dimBlack: '#121212', // For card backgrounds
  
  // Grayscale
  white: '#FFFFFF',
  grayLow: '#888888',
  grayMid: '#444444',
  grayHigh: '#1A1A1A',
  
  // Semantic Colors
  error: '#FF0000',
  warning: '#FFFF00',
  info: '#00FFFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Typography = {
  header: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
  },
  subheader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
};

export const Theme = {
  dark: {
    background: Colors.deepBlack,
    surface: Colors.dimBlack,
    text: Colors.white,
    accent: Colors.neonGreen,
    muted: Colors.grayLow,
  },
};
