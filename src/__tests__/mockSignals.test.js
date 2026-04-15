/**
 * Mock Signals Tests
 *
 * Tests the DEV-only mock signal injection scenarios.
 */

import { injectMockSignals } from '../api/mockSignals';

// Mock the evaluateSignals dependency
jest.mock('../api/signalService', () => ({
  evaluateSignals: jest.fn(() => Promise.resolve()),
  requestNotificationPermissions: jest.fn(),
  sendSignalAlert: jest.fn(),
}));

const { evaluateSignals } = require('../api/signalService');

describe('Mock Signals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject "quiet" scenario (1 signal)', async () => {
    await injectMockSignals('quiet');
    expect(evaluateSignals).toHaveBeenCalledTimes(1);
    const signals = evaluateSignals.mock.calls[0][0];
    expect(signals).toHaveLength(1);
    expect(signals[0].locationId).toBe('rainey');
  });

  it('should inject "burst" scenario (2 signals, same location)', async () => {
    await injectMockSignals('burst');
    const signals = evaluateSignals.mock.calls[0][0];
    expect(signals).toHaveLength(2);
    expect(signals.every(s => s.locationId === 'rainey')).toBe(true);
  });

  it('should inject "spread" scenario (3 signals, multiple locations)', async () => {
    await injectMockSignals('spread');
    const signals = evaluateSignals.mock.calls[0][0];
    expect(signals).toHaveLength(3);
    const locations = [...new Set(signals.map(s => s.locationId))];
    expect(locations.length).toBeGreaterThan(1);
  });

  it('should handle unknown scenario gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    await injectMockSignals('nonexistent');
    expect(evaluateSignals).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should pass onAlert callback through to evaluateSignals', async () => {
    const onAlert = jest.fn();
    await injectMockSignals('burst', onAlert);
    expect(evaluateSignals.mock.calls[0][1]).toBe(onAlert);
  });
});
