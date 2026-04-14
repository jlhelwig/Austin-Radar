import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import MainMapScreen from '../screens/MainMapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { getUserToken } from '../store/storage';
import { Colors } from '../theme/tokens';

const Stack = createNativeStackNavigator();

/**
 * AppNavigator: The main routing configuration with Auth persistence.
 * 
 * Logic:
 * - Checks MMKV storage on mount for a valid user token.
 * - Shows a loading state during the check.
 * - Conditional stack rendering based on auth state.
 */

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check for existing session on boot
    const bootstrapAsync = () => {
      try {
        const token = getUserToken();
        setUserToken(token);
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    // Mission-critical loading state
    return (
      <View style={{ flex: 1, backgroundColor: Colors.deepBlack, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.neonGreen} />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {userToken == null && (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
      <Stack.Screen name="MainMap" component={MainMapScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
