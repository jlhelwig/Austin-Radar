module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@gorhom/.*|@supabase/.*|react-native-reanimated|react-native-maps|react-native-gesture-handler|react-native-screens|react-native-safe-area-context)',
  ],
  setupFiles: ['./src/__tests__/setup.js'],
  testMatch: ['**/src/__tests__/**/*.test.js'],
};

