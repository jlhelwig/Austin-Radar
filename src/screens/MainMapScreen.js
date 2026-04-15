import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { Colors, Spacing, Typography } from '../theme/tokens';
import RadarPulse from '../components/RadarPulse';
import GemMarker from '../components/GemMarker';
import GemSubmissionModal from '../components/GemSubmissionModal';
import { OfflineBanner, ZeroStateMap } from '../components/EdgeStateUI';
import { useGems } from '../hooks/useGems';
import { useSignalPolling } from '../hooks/useSignalPolling';
import { loadRadarSettings } from '../store/storage';
import { injectMockSignals } from '../api/mockSignals';

/**
 * MainMapScreen: The core radar interface.
 *
 * Milestone 5: Added edge-case UI (offline banner, zero state)
 * and DEV mock signal trigger button.
 */

const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

const MainMapScreen = ({ navigation }) => {
  const { gems, submitGem, isLoading } = useGems();
  const [radarSettings] = useState(() => loadRadarSettings());
  const { signals, isPolling, isOffline } = useSignalPolling(radarSettings);
  const bottomSheetRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: 30.2672,
    longitude: -97.7431,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const filterGemsInViewport = useMemo(() => {
    const latMin = region.latitude - region.latitudeDelta / 2;
    const latMax = region.latitude + region.latitudeDelta / 2;
    const lngMin = region.longitude - region.longitudeDelta / 2;
    const lngMax = region.longitude + region.longitudeDelta / 2;

    return gems.filter(gem => {
      const { latitude, longitude } = gem.coordinates;
      return (
        latitude >= latMin &&
        latitude <= latMax &&
        longitude >= lngMin &&
        longitude <= lngMax
      );
    });
  }, [gems, region]);

  const handleMarkGem = () => {
    bottomSheetRef.current?.expand();
  };

  const handleMockBurst = async () => {
    await injectMockSignals('burst', (alert) => {
      console.log('[DEV] Alert triggered:', alert.venueName);
    });
  };

  const onGemSubmit = (form) => {
    const newGem = {
      ...form,
      coordinates: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
    };
    submitGem(newGem);
  };

  const showZeroState = !isLoading && filterGemsInViewport.length === 0 && signals.length === 0;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        customMapStyle={darkMapStyle}
      >
        {filterGemsInViewport.map(gem => (
          <GemMarker key={gem.id || gem.timestamp} gem={gem} />
        ))}
      </MapView>

      {/* Zero state — no gems or signals in view */}
      {showZeroState && <ZeroStateMap />}

      {/* Radar pulse centered on screen */}
      <View style={styles.radarContainer} pointerEvents="none">
        <RadarPulse />
      </View>

      {/* Offline banner — slides in when network unavailable */}
      <OfflineBanner visible={isOffline} />

      {/* Status overlay */}
      <View style={styles.overlay}>
        <Text style={styles.radarText}>
          {isPolling ? '[ SCANNING... ]' : '[ RADAR ACTIVE ]'}
        </Text>
        <Text style={styles.signalText}>
          {signals.length} LIVE · {filterGemsInViewport.length} GEMS
        </Text>
      </View>

      {/* Navigation buttons */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.settingsText}>⚙</Text>
      </TouchableOpacity>

      {/* DEV: Mock signal burst trigger */}
      {DEV_MODE && (
        <TouchableOpacity style={styles.mockButton} onPress={handleMockBurst}>
          <Text style={styles.mockText}>[ BURST ]</Text>
        </TouchableOpacity>
      )}

      {/* Mark Gem FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleMarkGem}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <GemSubmissionModal
        bottomSheetRef={bottomSheetRef}
        onSubmit={onGemSubmit}
      />
    </View>
  );
};

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
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
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grayMid,
  },
  settingsText: {
    color: Colors.grayLow,
    fontSize: 18,
  },
  mockButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: 'rgba(255,255,0,0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  mockText: {
    ...Typography.label,
    color: Colors.warning,
    fontSize: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.neonGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: {
    fontSize: 36,
    color: Colors.deepBlack,
    fontWeight: '300',
    marginTop: -4,
  },
});

export default MainMapScreen;
