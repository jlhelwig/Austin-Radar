import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme/tokens';
import { saveRadarSettings, loadRadarSettings } from '../store/storage';

/**
 * SettingsScreen
 *
 * Provides user-controllable parameters for the Live Radar system:
 * - Noise Opt-Out toggle (suppresses push alerts).
 * - Polling frequency selector (maps to intervalMs for useSignalPolling).
 */

const POLLING_OPTIONS = [
  { label: '1 MIN (Intense)', value: 60000 },
  { label: '5 MIN (Balanced)', value: 300000 },
  { label: '15 MIN (Light)', value: 900000 },
  { label: '1 HOUR (Minimal)', value: 3600000 },
];

const SettingsScreen = ({ navigation, onSave }) => {
  // Load persisted settings as defaults
  const defaults = loadRadarSettings();
  const [muted, setMuted] = useState(defaults.muted);
  const [selectedInterval, setSelectedInterval] = useState(defaults.intervalMs);

  const handleSave = () => {
    saveRadarSettings(muted, selectedInterval);
    if (onSave) onSave({ muted, intervalMs: selectedInterval });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>RADAR SETTINGS</Text>

        {/* Noise Opt-Out */}
        <View style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>MUTE ALERTS</Text>
            <Text style={styles.rowSub}>Receive no push notifications</Text>
          </View>
          <Switch
            value={muted}
            onValueChange={setMuted}
            trackColor={{ false: Colors.grayMid, true: Colors.neonGreen }}
            thumbColor={Colors.white}
          />
        </View>

        {/* Polling Frequency */}
        <Text style={styles.sectionLabel}>POLLING FREQUENCY</Text>
        {POLLING_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.optionRow,
              selectedInterval === opt.value && styles.optionSelected,
            ]}
            onPress={() => setSelectedInterval(opt.value)}
          >
            <Text style={[
              styles.optionText,
              selectedInterval === opt.value && styles.optionTextSelected,
            ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>APPLY SETTINGS</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepBlack,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.header,
    fontSize: 24,
    color: Colors.neonGreen,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dimBlack,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  rowLabel: {
    ...Typography.label,
    color: Colors.white,
  },
  rowSub: {
    color: Colors.grayLow,
    fontSize: 11,
    marginTop: 2,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.grayLow,
    marginBottom: Spacing.sm,
  },
  optionRow: {
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.grayMid,
    marginBottom: Spacing.sm,
  },
  optionSelected: {
    borderColor: Colors.neonGreen,
    backgroundColor: 'rgba(0,255,0,0.05)',
  },
  optionText: {
    color: Colors.grayLow,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: Colors.neonGreen,
  },
  saveButton: {
    backgroundColor: Colors.neonGreen,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  saveText: {
    color: Colors.deepBlack,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default SettingsScreen;
