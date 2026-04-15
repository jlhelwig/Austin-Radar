# Austin Radar: Testing Protocols

## Running Tests
```bash
# Run all tests
npm test

# Run a specific test file
npx jest src/__tests__/storage.test.js --verbose

# Run with coverage
npx jest --coverage
```

---

## Automated Test Suites

### 1. Storage (`storage.test.js`)
| # | Test Case | Path |
|---|---|---|
| 1 | Returns undefined when no token saved | `getUserToken()` cold start |
| 2 | Saves and retrieves a token | `saveUserToken()` → `getUserToken()` |
| 3 | Overwrites an existing token | Double `saveUserToken()` |
| 4 | Clears the token on logout | `clearUserToken()` → verify undefined |
| 5 | Returns safe defaults (muted=false, 5min) | `loadRadarSettings()` cold start |
| 6 | Persists muted=true + custom interval | `saveRadarSettings()` → `loadRadarSettings()` |
| 7 | Persists muted=false | Toggle off path |

### 2. Signal Service (`signalService.test.js`)
| # | Test Case | Path |
|---|---|---|
| 1 | Single signal does NOT trigger (PROD threshold=2) | Below threshold |
| 2 | 2+ signals at same location DOES trigger | At threshold |
| 3 | Different locationIds do NOT group | Cross-venue isolation |
| 4 | Multiple location groups each trigger | Multi-venue burst |
| 5 | Empty signal array is safe | Zero input edge case |
| 6 | Works without onAlert callback | Null callback safety |

### 3. Mastodon Feed (`mastodonFeed.test.js`)
| # | Test Case | Path |
|---|---|---|
| 1 | Returns empty array when all fetches fail | Network failure path |
| 2 | Parses status with venue keyword ("driskill") | Happy path — match |
| 3 | Ignores posts without venue keywords | No-match filtering |
| 4 | Strips HTML tags from content | Sanitization |
| 5 | Handles HTTP 500 error responses | Server error path |

### 4. Mock Signals (`mockSignals.test.js`)
| # | Test Case | Path |
|---|---|---|
| 1 | Injects "quiet" scenario (1 signal) | Single signal DEV test |
| 2 | Injects "burst" scenario (2 signals, same location) | Multi-signal DEV test |
| 3 | Injects "spread" scenario (3 signals, multi-venue) | Cross-venue DEV test |
| 4 | Handles unknown scenario name gracefully | Invalid input guard |
| 5 | Passes onAlert callback through | Callback forwarding |

### 5. Proven Winners Seed Data (`provenWinners.test.js`)
| # | Test Case | Path |
|---|---|---|
| 1 | Contains at least 1 entry | Non-empty validation |
| 2 | All entries have required fields | Schema validation |
| 3 | All stars are 4-5 (per Code_Rules.md) | Business rule enforcement |
| 4 | All coordinates are near Austin, TX | Geofence validation |
| 5 | All IDs are unique | Uniqueness constraint |

---

## Manual Testing Protocols

### Auth Flow
- [ ] App shows Auth screen on cold start (no token)
- [ ] DEV Bypass navigates to MainMap
- [ ] Google Login button logs to console (placeholder)
- [ ] Settings screen navigates back after save

### Map & Radar
- [ ] Map renders centered on Austin (30.27, -97.74)
- [ ] RadarPulse animation runs continuously
- [ ] Gem markers render from seed data
- [ ] Marker callouts show name/category/instructions
- [ ] Viewport filtering updates on pan/zoom

### Gem Submission
- [ ] FAB (+) opens bottom sheet
- [ ] Stars 1-3 show "Too Low for Radar" error
- [ ] Stars 4-5 enable submit button
- [ ] Submit closes sheet and resets form
- [ ] Missing name/category disables submit

### Edge States
- [ ] OfflineBanner slides in when `isOffline=true`
- [ ] ZeroStateMap shows when no gems or signals in view
- [ ] Supabase offline mode uses seed data only

### Settings
- [ ] Mute toggle changes switch state
- [ ] Polling frequency options highlight on selection
- [ ] Apply Settings saves to storage and navigates back
