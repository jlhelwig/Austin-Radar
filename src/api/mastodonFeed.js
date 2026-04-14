/**
 * Mastodon Signal Fetcher
 *
 * Fetches public hashtag timelines from the Mastodon API.
 * Uses the austin.social instance as the primary feed source.
 *
 * DEV: Fetches from local instance with broad tags.
 * PROD: Should fan out to multiple instances for redundancy.
 *
 * API Reference: https://docs.joinmastodon.org/methods/timelines/
 * No authentication required for public hashtag endpoints.
 */

const MASTODON_INSTANCE = 'https://austin.social';
const TRACKED_HASHTAGS = ['austinlive', 'austinsighting', 'austinnightlife', 'atx'];
const VENUE_KEYWORDS = ['rainey', 'sixth street', '6th street', 'driskill', 'midnight cowboy', 'elephant room'];

/**
 * Fetch the most recent public posts for a hashtag.
 * @param {string} hashtag - The tag to search (without #).
 * @returns {Promise<Array>} Array of Mastodon status objects.
 */
const fetchHashtagTimeline = async (hashtag) => {
  const url = `${MASTODON_INSTANCE}/api/v1/timelines/tag/${hashtag}?limit=20`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(5000), // Fail-Closed: 5s timeout per Code_Rules.md Rule 15
  });

  if (!response.ok) throw new Error(`Mastodon fetch failed: ${response.status}`);
  return response.json();
};

/**
 * Match a post's content against known venue keywords.
 * @param {string} content - Raw HTML content from Mastodon status.
 * @returns {string|null} The matched venue keyword, or null.
 */
const matchVenueKeyword = (content) => {
  const lower = content.toLowerCase();
  return VENUE_KEYWORDS.find(kw => lower.includes(kw)) || null;
};

/**
 * Fetch and parse live signals from all tracked hashtags.
 * Returns structured signal objects ready for evaluateSignals().
 * @returns {Promise<Array>} Array of { locationId, venueName, message }.
 */
export const fetchLiveSignals = async () => {
  const signals = [];

  for (const tag of TRACKED_HASHTAGS) {
    try {
      const statuses = await fetchHashtagTimeline(tag);

      for (const status of statuses) {
        const plainText = status.content.replace(/<[^>]+>/g, '');
        const match = matchVenueKeyword(plainText);

        if (match) {
          signals.push({
            locationId: match.replace(/\s+/g, '_'),
            venueName: match.charAt(0).toUpperCase() + match.slice(1),
            message: plainText.slice(0, 120),
            sourceUrl: status.url,
          });
        }
      }
    } catch (err) {
      // Silent degradation per Code_Rules.md Rule 13 (Fail-Safe)
      console.warn(`[Signal] Failed to fetch tag #${tag}:`, err.message);
    }
  }

  return signals;
};
