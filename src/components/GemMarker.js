import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Colors, Spacing, Typography } from '../theme/tokens';

/**
 * GemMarker Component
 * 
 * Custom map marker for "Community Gems".
 * Optimized with tracksViewChanges protection for performance.
 */

const GemMarker = ({ gem }) => {
  const isSpeakeasy = gem.category === 'Speakeasy';

  return (
    <Marker
      coordinate={gem.coordinates}
      tracksViewChanges={false} // Performance optimization
    >
      <View style={[
        styles.markerContainer,
        isSpeakeasy && styles.speakeasyBorder
      ]}>
        <View style={styles.innerGem} />
      </View>

      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{gem.name}</Text>
          <Text style={styles.calloutCategory}>{gem.category}</Text>
          <Text style={styles.calloutInstructions} numberOfLines={2}>
            {gem.instructions}
          </Text>
          {gem.stars && (
            <Text style={styles.calloutStars}>
              {'★'.repeat(gem.stars)}
            </Text>
          )}
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neonGreen,
  },
  speakeasyBorder: {
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  innerGem: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neonGreen,
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  callout: {
    backgroundColor: Colors.dimBlack,
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grayMid,
    width: 200,
  },
  calloutTitle: {
    ...Typography.label,
    color: Colors.white,
    fontSize: 14,
    marginBottom: 2,
  },
  calloutCategory: {
    ...Typography.label,
    color: Colors.neonGreen,
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  calloutInstructions: {
    color: Colors.grayLow,
    fontSize: 12,
    marginBottom: 6,
  },
  calloutStars: {
    color: Colors.neonGreen,
    fontSize: 12,
  },
});

export default GemMarker;
