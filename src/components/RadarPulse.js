import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { Colors } from '../theme/tokens';

/**
 * RadarPulse Component
 * 
 * A mission-critical UI element providing a pulsing neon animation.
 * Optimized for performance using the Native Driver.
 */

const PulseCircle = ({ delay = 0 }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 4,
          duration: 3000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
          delay: delay,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 3000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
          delay: delay,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [scale, opacity, delay]);

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
};

const RadarPulse = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      <PulseCircle delay={0} />
      <PulseCircle delay={1000} />
      <PulseCircle delay={2000} />
      {/* Central Core */}
      <View style={styles.core} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  circle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.neonGreen,
    backgroundColor: 'transparent',
  },
  core: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.neonGreen,
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default RadarPulse;
