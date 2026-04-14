import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/tokens';

/**
 * OfflineBanner Component
 *
 * Displayed when the app cannot reach the Mastodon/Supabase APIs.
 * Slides in from the top and persists until connectivity is restored.
 * Silent degradation: UI hides gracefully, data falls back to seed cache.
 */
const OfflineBanner = ({ visible }) => {
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -60,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}
      pointerEvents="none"
    >
      <Text style={styles.text}>⚠ OFFLINE — SHOWING CACHED DATA</Text>
    </Animated.View>
  );
};

/**
 * ZeroStateMap Component
 *
 * Displayed when the gem array is empty and no signals are active.
 * Informs the user the radar is live but no signals are detected yet.
 */
const ZeroStateMap = () => (
  <View style={styles.zeroContainer} pointerEvents="none">
    <Text style={styles.zeroIcon}>◎</Text>
    <Text style={styles.zeroTitle}>NO SIGNALS DETECTED</Text>
    <Text style={styles.zeroSub}>Radar is scanning. Check back soon.</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.warning,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    zIndex: 100,
  },
  text: {
    ...Typography.label,
    color: Colors.deepBlack,
    fontSize: 11,
    letterSpacing: 1,
  },
  zeroContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroIcon: {
    fontSize: 64,
    color: Colors.grayMid,
    marginBottom: Spacing.md,
  },
  zeroTitle: {
    ...Typography.subheader,
    color: Colors.grayLow,
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  zeroSub: {
    color: Colors.grayMid,
    fontSize: 11,
  },
});

export { OfflineBanner, ZeroStateMap };
