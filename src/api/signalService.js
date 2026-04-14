import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

/**
 * Signal Service — DEV Mode
 *
 * Handles two responsibilities:
 * 1. Parsing incoming signal data from the API (Mastodon/RSS).
 * 2. Triggering local push notifications based on signal rules.
 *
 * DEV BEHAVIOR: Single signal = push triggered immediately.
 * PROD BEHAVIOR: Requires 2+ signals at same location before push.
 */

const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
const SIGNAL_THRESHOLD = DEV_MODE ? 1 : 2;

// Configure how notifications are displayed while app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions from the OS.
 * @returns {Promise<boolean>} Whether permissions were granted.
 */
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

/**
 * Send a local push notification for a confirmed signal.
 * @param {string} title - Venue or event name.
 * @param {string} body - Signal description.
 */
export const sendSignalAlert = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎯 ${title}`,
      body,
      data: { type: 'live_signal' },
    },
    trigger: null, // Immediate
  });
};

/**
 * Evaluate incoming signals against the threshold rule.
 * Groups signals by locationId and triggers alerts when threshold is met.
 *
 * @param {Array} signals - Array of { locationId, venueName, message }.
 * @param {Function} onAlert - Optional callback to update UI on alert.
 */
export const evaluateSignals = async (signals, onAlert) => {
  const grouped = {};

  for (const signal of signals) {
    const key = signal.locationId;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(signal);
  }

  for (const [locationId, group] of Object.entries(grouped)) {
    if (group.length >= SIGNAL_THRESHOLD) {
      const { venueName, message } = group[0];
      await sendSignalAlert(venueName, message);
      if (onAlert) onAlert({ locationId, count: group.length, venueName });
    }
  }
};
