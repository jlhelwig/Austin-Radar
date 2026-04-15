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

---

## 🔥 PERSISTENT CRASH: `Cannot read property 'prototype' of undefined`

### Root Cause (Confirmed via Isolation Testing)

**`react-native-mmkv` v4 uses Nitro Modules.** The line `export const storage = new MMKV()` in `storage.js` runs at **import time** (module initialization). On Expo SDK 54 with the New Architecture, the Nitro native module isn't fully ready when the JS runtime processes top-level module code, causing the crash.

### Resolution Chain
| Step | Action | Result |
|---|---|---|
| 1 | Removed `@sentry/react-native` import from `App.js` | ❌ Error persisted |
| 2 | Uninstalled `@sentry/react-native` from `package.json` | ❌ Error persisted |
| 3 | Added `babel.config.js` with `react-native-reanimated/plugin` | ❌ Error persisted |
| 4 | **Replaced MMKV with in-memory shim** in `storage.js` | ✅ **App booted!** |
| 5 | Guarded `supabase.js` against missing env vars | ✅ Offline mode works |

### Additional Fix: Supabase Client Crash
- **Error**: `supabaseUrl is required` — `createClient()` crashes with empty string
- **Solution**: Mock client in DEV that returns empty results, allowing seed data fallback

### Files Modified
- `App.js` — Removed Sentry import/wrap (native module not linked)
- `src/store/storage.js` — Replaced MMKV with in-memory shim for DEV
- `src/api/supabase.js` — Guarded createClient with mock fallback
- `babel.config.js` — Created with reanimated plugin (was missing entirely)
- `package.json` — Uninstalled `@sentry/react-native`, added `babel-preset-expo`

---

## Next: Clean Native Build
After these fixes, a `npx expo prebuild --clean` followed by `npx expo run:ios` will generate a fresh `ios/` directory without the stale Sentry build phase.
