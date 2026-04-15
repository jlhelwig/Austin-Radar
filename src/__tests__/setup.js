/**
 * Jest Test Setup
 * Mocks for native modules that don't exist in the test environment.
 */

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View, Text } = require('react-native');
  const MockMapView = (props) => <View {...props} />;
  const MockMarker = (props) => <View {...props} />;
  const MockCallout = (props) => <View {...props} />;
  MockMapView.Marker = MockMarker;
  MockMapView.Callout = MockCallout;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
  };
});

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve()),
  setNotificationHandler: jest.fn(),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: { extra: {} },
}));

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => <View {...props} />,
    BottomSheetView: (props) => <View {...props} />,
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Silence expected warnings in test output
jest.spyOn(console, 'warn').mockImplementation((msg) => {
  if (msg.includes('[Supabase]')) return;
  console.log('[WARN]', msg);
});
