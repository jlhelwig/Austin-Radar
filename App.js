import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Initialize Sentry only when a valid DSN is present (DEV has no Sentry org configured)
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0, // Reduce in PROD
  });
}

const queryClient = new QueryClient();

/**
 * App Component
 *
 * Provisions global providers:
 * - GestureHandlerRootView: Required for bottom-sheet and gesture interactions.
 * - QueryClientProvider: Server state management via TanStack Query.
 * - NavigationContainer: React Navigation routing.
 * - Sentry.wrap: Silent error/performance monitoring wrapper.
 */
function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
