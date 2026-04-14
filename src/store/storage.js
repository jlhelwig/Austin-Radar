import { MMKV } from 'react-native-mmkv';

/**
 * MMKV Storage Wrapper
 *
 * Provides synchronous storage for mission-critical session and state data.
 * All keys are centrally defined here to prevent magic strings across the codebase.
 */

export const storage = new MMKV();

const KEYS = {
  USER_TOKEN: 'user_token',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  RADAR_MUTED: 'radar_muted',
  RADAR_INTERVAL_MS: 'radar_interval_ms',
};

/** Save the user authentication token. */
export const saveUserToken = (token) => {
  storage.set(KEYS.USER_TOKEN, token);
};

/** Get the current user token. */
export const getUserToken = () => {
  return storage.getString(KEYS.USER_TOKEN);
};

/** Clear the user token (Logout). */
export const clearUserToken = () => {
  storage.delete(KEYS.USER_TOKEN);
};

/**
 * Save radar alert settings.
 * @param {boolean} muted - Whether push alerts are silenced.
 * @param {number} intervalMs - Polling frequency in milliseconds.
 */
export const saveRadarSettings = (muted, intervalMs) => {
  storage.set(KEYS.RADAR_MUTED, muted);
  storage.set(KEYS.RADAR_INTERVAL_MS, intervalMs);
};

/**
 * Load radar alert settings, falling back to safe defaults.
 * @returns {{ muted: boolean, intervalMs: number }}
 */
export const loadRadarSettings = () => {
  const muted = storage.getBoolean(KEYS.RADAR_MUTED) ?? false;
  const intervalMs = storage.getNumber(KEYS.RADAR_INTERVAL_MS) ?? 300000;
  return { muted, intervalMs };
};
