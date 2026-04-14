import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/tokens';
import { saveUserToken } from '../store/storage';

/**
 * AuthScreen: The entry point for authentication.
 * 
 * Features:
 * - Google OAuth button.
 * - Mission-critical "Dev Bypass" button for rapid iteration.
 * - Bound to Design Tokens.
 */

const AuthScreen = ({ navigation }) => {
  const handleGoogleLogin = () => {
    // TODO: Implement expo-auth-session logic
    console.log('Google Login initiated');
  };

  const handleDevBypass = async () => {
    console.log('Dev Bypass activated');
    // Save a dummy token to test persistence
    await saveUserToken('dev-token-' + Date.now());
    navigation.replace('MainMap');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>AUSTIN RADAR</Text>
        <Text style={styles.subtitle}>Mission-Critical City Scouting</Text>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleGoogleLogin}
        >
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bypassButton} 
          onPress={handleDevBypass}
        >
          <Text style={styles.bypassText}>[ DEV BYPASS ]</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepBlack,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  title: {
    ...Typography.header,
    color: Colors.neonGreen,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.subheader,
    color: Colors.grayLow,
    marginBottom: Spacing.xxl,
  },
  loginButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: 5,
    marginBottom: Spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.deepBlack,
    fontWeight: '700',
    fontSize: 16,
  },
  bypassButton: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  bypassText: {
    ...Typography.label,
    color: Colors.grayMid,
  },
});

export default AuthScreen;
