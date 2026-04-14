import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors, Spacing, Typography } from '../theme/tokens';
import RadarPulse from '../components/RadarPulse';
import GemMarker from '../components/GemMarker';
import provenWinners from '../data/proven_winners.json';

/**
 * MainMapScreen: The core radar interface.
 * 
 * Features:
 * - Full-screen MapView with custom neon style.
 * - Pulsing radar overlay.
 * - Gem markers from seeded "Proven Winners" data.
 * - Bounding-box detection for future Supabase fetching.
 */

const MainMapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 30.2672,
    longitude: -97.7431,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [visibleGems, setVisibleGems] = useState([]);

  useEffect(() => {
    // Initial load: Filter gems within current region
    filterGems(region);
  }, []);

  const filterGems = (currentRegion) => {
    // Simple bounding box logic for seeded data
    const latMin = currentRegion.latitude - currentRegion.latitudeDelta / 2;
    const latMax = currentRegion.latitude + currentRegion.latitudeDelta / 2;
    const lngMin = currentRegion.longitude - currentRegion.longitudeDelta / 2;
    const lngMax = currentRegion.longitude + currentRegion.longitudeDelta / 2;

    const filtered = provenWinners.filter(gem => {
      const { latitude, longitude } = gem.coordinates;
      return (
        latitude >= latMin && 
        latitude <= latMax && 
        longitude >= lngMin && 
        longitude <= lngMax
      );
    });

    setVisibleGems(filtered);
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    filterGems(newRegion);
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChange}
        customMapStyle={darkMapStyle}
        // provider={PROVIDER_GOOGLE} // Allow native maps (Apple) for zero cost in dev
      >
        {visibleGems.map(gem => (
          <GemMarker key={gem.id} gem={gem} />
        ))}
      </MapView>

      <View style={styles.radarContainer} pointerEvents="none">
        <RadarPulse />
      </View>

      <View style={styles.overlay}>
        <Text style={styles.radarText}>[ RADAR ACTIVE ]</Text>
        <Text style={styles.signalText}>{visibleGems.length} SIGNALS FOUND</Text>
      </View>
    </View>
  );
};

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepBlack,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  radarContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neonGreen,
    alignItems: 'center',
  },
  radarText: {
    ...Typography.label,
    color: Colors.neonGreen,
    letterSpacing: 2,
  },
  signalText: {
    color: Colors.grayLow,
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
});

export default MainMapScreen;
