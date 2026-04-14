import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { fetchLiveSignals } from '../api/mastodonFeed';
import { evaluateSignals, requestNotificationPermissions } from '../api/signalService';

/**
 * useSignalPolling Hook
 *
 * Manages the polling lifecycle for live signals in DEV mode.
 * Uses a foreground polling interval (no background task required for DEV).
 * Respects the user-configured polling rate from Battery Settings.
 *
 * @param {number} intervalMs - Polling interval in milliseconds (from battery config).
 * @param {boolean} muted - Noise Opt-Out: if true, signals are fetched but not alerted.
 */
export const useSignalPolling = ({ intervalMs = 60000, muted = false }) => {
  const [signals, setSignals] = useState([]);
  const [isPolling, setIsPolling] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastPollAt, setLastPollAt] = useState(null);
  const appState = useRef(AppState.currentState);
  const timer = useRef(null);

  const poll = useCallback(async () => {
    setIsPolling(true);
    try {
      const fresh = await fetchLiveSignals();
      setSignals(fresh);
      setLastPollAt(new Date());
      setIsOffline(false);

      if (!muted) {
        await evaluateSignals(fresh, (alert) => {
          console.log('[Radar] Signal alert triggered:', alert.venueName);
        });
      }
    } catch (err) {
      setIsOffline(true);
      console.warn('[Radar] Polling error:', err.message);
    } finally {
      setIsPolling(false);
    }
  }, [muted]);

  useEffect(() => {
    requestNotificationPermissions();

    // Only poll while app is active
    const handleAppStateChange = (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        poll();
      }
      appState.current = nextState;
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    poll(); // Initial poll on mount

    timer.current = setInterval(poll, intervalMs);

    return () => {
      clearInterval(timer.current);
      sub.remove();
    };
  }, [poll, intervalMs]);

  return { signals, isPolling, isOffline, lastPollAt };
};
