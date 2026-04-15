/**
 * Storage Tests
 *
 * Tests the MMKV-compatible storage wrapper (in-memory shim for DEV).
 * Covers: token CRUD, radar settings persistence, and safe defaults.
 */

import {
  saveUserToken,
  getUserToken,
  clearUserToken,
  saveRadarSettings,
  loadRadarSettings,
} from '../store/storage';

describe('Storage Module', () => {
  // --- Token Management ---

  describe('User Token', () => {
    it('should return undefined when no token is saved', () => {
      const token = getUserToken();
      expect(token).toBeUndefined();
    });

    it('should save and retrieve a token', () => {
      saveUserToken('test-token-123');
      const token = getUserToken();
      expect(token).toBe('test-token-123');
    });

    it('should overwrite an existing token', () => {
      saveUserToken('old-token');
      saveUserToken('new-token');
      expect(getUserToken()).toBe('new-token');
    });

    it('should clear the token on logout', () => {
      saveUserToken('token-to-clear');
      clearUserToken();
      expect(getUserToken()).toBeUndefined();
    });
  });

  // --- Radar Settings ---

  describe('Radar Settings', () => {
    it('should return safe defaults when nothing is saved', () => {
      const settings = loadRadarSettings();
      expect(settings).toEqual({
        muted: false,
        intervalMs: 300000,
      });
    });

    it('should persist muted=true and custom interval', () => {
      saveRadarSettings(true, 60000);
      const settings = loadRadarSettings();
      expect(settings.muted).toBe(true);
      expect(settings.intervalMs).toBe(60000);
    });

    it('should persist muted=false', () => {
      saveRadarSettings(false, 900000);
      const settings = loadRadarSettings();
      expect(settings.muted).toBe(false);
      expect(settings.intervalMs).toBe(900000);
    });
  });
});
