/**
 * Mastodon Feed Tests
 *
 * Tests venue keyword matching and signal structure output.
 * Network calls are mocked to avoid external dependencies.
 */

// Mock fetch globally
global.fetch = jest.fn();

// Import after mock is in place
const { fetchLiveSignals } = require('../api/mastodonFeed');

describe('Mastodon Feed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when all fetches fail', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    const signals = await fetchLiveSignals();
    expect(signals).toEqual([]);
  });

  it('should parse a status containing a venue keyword', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        {
          content: '<p>Just saw someone at the driskill lobby!</p>',
          url: 'https://austin.social/@user/123',
        },
      ]),
    });

    const signals = await fetchLiveSignals();
    const driskillSignals = signals.filter(s => s.locationId === 'driskill');

    expect(driskillSignals.length).toBeGreaterThan(0);
    expect(driskillSignals[0]).toEqual(
      expect.objectContaining({
        locationId: 'driskill',
        venueName: 'Driskill',
        sourceUrl: 'https://austin.social/@user/123',
      })
    );
  });

  it('should ignore posts without venue keywords', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { content: '<p>Beautiful sunset in Austin today</p>', url: 'https://example.com' },
      ]),
    });

    const signals = await fetchLiveSignals();
    expect(signals).toEqual([]);
  });

  it('should strip HTML tags from content', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        {
          content: '<p><strong>Rainey</strong> street is <em>packed</em>!</p>',
          url: 'https://austin.social/@test/456',
        },
      ]),
    });

    const signals = await fetchLiveSignals();
    const raineySignals = signals.filter(s => s.locationId === 'rainey');
    expect(raineySignals.length).toBeGreaterThan(0);
    expect(raineySignals[0].message).not.toContain('<');
  });

  it('should handle HTTP error responses gracefully', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });
    const signals = await fetchLiveSignals();
    expect(signals).toEqual([]);
  });
});
