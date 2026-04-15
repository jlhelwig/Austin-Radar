# Austin Radar: Modifications Log
*Date: April 15, 2026*

---

## Full Codebase Review — Bugs Found & Fixed

### Build-Blocking Errors

| # | File | Error | Fix |
|---|---|---|---|
| 1 | `ios/` (build phase) | Sentry's "Upload Debug Symbols" build phase persists from stale prebuild, fails with "org ID required" | **Clean prebuild** (`npx expo prebuild --clean`) to regenerate `ios/` without the Sentry plugin |
| 2 | `signalService.js` | `TaskManager` and `Location` imported but never used — causes dead code in native binary | **Removed** unused imports |
| 3 | `App.js` | `Sentry.init()` called with empty DSN string, causes silent init failure on every boot | **Guarded** behind `if (SENTRY_DSN)` check |

### Runtime Bugs

| # | File | Bug | Fix |
|---|---|---|---|
| 4 | `MainMapScreen.js` | `loadRadarSettings()` called at top-level on **every render** (synchronous MMKV read per frame) | **Moved** into `useState(() => ...)` initializer — runs once |
| 5 | `SettingsScreen.js` | Missing `navigation` prop — user stranded on Settings with no way back after saving | **Added** `navigation` prop + `navigation.goBack()` after save |

### Documentation Errors

| # | File | Error | Fix |
|---|---|---|---|
| 6 | `PRIVACY.md` | References "Firebase" as a third-party service — we only use Supabase | **Corrected** to "Supabase" only |

### No Issues Found (Clean Files)
- `tokens.js` — Design system is clean and consistent
- `RadarPulse.js` — Animation uses Native Driver correctly
- `GemMarker.js` — `tracksViewChanges={false}` properly set for perf
- `GemSubmissionModal.js` — Star validation logic is correct
- `useGems.js` — TanStack Query + seed merge is correct
- `useSignalPolling.js` — Interval/cleanup logic is correct
- `mastodonFeed.js` — 5s timeout + silent degradation per Code Rules
- `mockSignals.js` — Test scenarios are well-structured
- `supabase.js` — Polyfill + fallback warnings are correct
- `storage.js` — MMKV wrapper with centralized keys is solid
- `AppNavigator.js` — Auth persistence logic is correct
- `EdgeStateUI.js` — Animated banner with native driver is correct
- `index.js` — Entry point with `expo-dev-client` is correct
- `Code_Rules.md` — No changes needed
- `Development_Roadmap.md` — Accurate milestone tracking
- `Test.md` — Testing protocol is current
- `README.md` — Tech stack description is accurate
- `proven_winners.json` — Seed data is valid

---

## Next: Clean Native Build
After these fixes, a `npx expo prebuild --clean` followed by `npx expo run:ios` will generate a fresh `ios/` directory without the stale Sentry build phase.
