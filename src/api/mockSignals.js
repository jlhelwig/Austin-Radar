/**
 * mockSignals.js — DEV ONLY
 *
 * Simulates high-traffic "Radar Pulse" events for development testing.
 * Call injectMockSignals() to bypass Mastodon fetching and populate
 * the signal evaluator with synthetic data.
 *
 * Usage: import and call from a debug button or console.
 */

import { evaluateSignals } from '../api/signalService';

const MOCK_SIGNAL_SETS = {
  /** Single quiet signal — should NOT trigger in PROD (2-signal rule). */
  quiet: [
    {
      locationId: 'rainey',
      venueName: 'Rainey Street',
      message: 'Just saw someone famous on Rainey St.',
    },
  ],

  /** Multi-signal burst — triggers alert in both DEV and PROD. */
  burst: [
    {
      locationId: 'rainey',
      venueName: 'Rainey Street',
      message: 'Celebrity spotted at Banger\'s on Rainey!',
    },
    {
      locationId: 'rainey',
      venueName: 'Rainey Street',
      message: 'Confirmed — still there outside Icenhauer\'s.',
    },
  ],

  /** Multi-venue spread — tests grouping logic across locations. */
  spread: [
    {
      locationId: 'sixth_street',
      venueName: '6th Street',
      message: 'Big crowd forming near 6th and Red River.',
    },
    {
      locationId: 'driskill',
      venueName: 'The Driskill',
      message: 'Driskill lobby bar is packed — something happening.',
    },
    {
      locationId: 'driskill',
      venueName: 'The Driskill',
      message: 'Film crew spotted outside the Driskill.',
    },
  ],
};

/**
 * Inject a named mock signal set into the signal evaluator.
 * @param {'quiet' | 'burst' | 'spread'} scenario - The scenario to run.
 * @param {Function} onAlert - Optional callback to observe alerts in UI.
 */
export const injectMockSignals = async (scenario = 'burst', onAlert) => {
  const signals = MOCK_SIGNAL_SETS[scenario];

  if (!signals) {
    console.warn(`[Mock] Unknown scenario: "${scenario}". Use: quiet, burst, spread.`);
    return;
  }

  console.log(`[Mock] Injecting scenario: ${scenario} (${signals.length} signals)`);
  await evaluateSignals(signals, onAlert);
};
