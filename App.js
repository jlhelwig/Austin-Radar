import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

// NOTE: @sentry/react-native is installed but NOT linked for DEV builds.
// Re-add the plugin to app.json and restore Sentry.wrap() for PROD.

const queryClient = new QueryClient();

/**
 * App Component
 *
 * Provisions global providers:
 * - GestureHandlerRootView: Required for bottom-sheet and gesture interactions.
 * - QueryClientProvider: Server state management via TanStack Query.
 * - NavigationContainer: React Navigation routing.
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

export default App;

