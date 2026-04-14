import { MMKV } from 'react-native-mmkv';

/**
 * MMKV Storage Wrapper
 * 
 * Provides synchronous storage for mission-critical session and state data.
 */

export const storage = new MMKV();

const KEYS = {
  USER_TOKEN: 'user_token',
  ONBOARDING_COMPLETE: 'onboarding_complete',
};

/**
 * Save the user authentication token.
 * @param {string} token 
 */
export const saveUserToken = async (token) => {
  storage.set(KEYS.USER_TOKEN, token);
};

/**
 * Get the current user token.
 * @returns {string | undefined}
 */
export const getUserToken = () => {
  return storage.getString(KEYS.USER_TOKEN);
};

/**
 * Clear the user token (Logout).
 */
export const clearUserToken = () => {
  storage.delete(KEYS.USER_TOKEN);
};
