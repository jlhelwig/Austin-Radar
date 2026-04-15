# Austin Radar: Lessons Learned

> Retrospective on the development process — what went wrong, why, and what to do better next time.

---

## 1. The MMKV / Nitro Disaster

### What happened
`react-native-mmkv` v4 was installed as a dependency. It uses **Nitro Modules**, a new native bridge that initializes differently from standard React Native modules. The line `export const storage = new MMKV()` runs at **import time** — before the Nitro native runtime is ready — causing a `Cannot read property 'prototype' of undefined` crash that blocked the entire app from booting.

### Why it took so long to diagnose
- The error message gave **zero indication** that MMKV was the source. It just said `prototype of undefined`.
- We chased Sentry first (removed import, then uninstalled entirely) because it seemed like the most likely culprit.
- We then chased Reanimated (created a babel.config.js) because missing babel plugins can cause similar errors.
- Only after **isolation testing** (replacing MMKV with an in-memory shim) did we confirm the root cause.

### Lesson
> **When facing an opaque native crash, isolate by subtraction — not by guessing.** Comment out imports one at a time from the entry point and test each. Start with native modules that run code at import time (`new MMKV()`, `Sentry.init()`, etc). This would have saved ~2 hours.

### Future rule
- **Never call native constructors at module scope.** Lazy-initialize behind a function or `useEffect`.
- **Pin native module versions** to SDK-verified ranges. Don't use `^` for native dependencies.

---

## 2. Sentry: Three-Headed Problem

### What happened
Sentry caused **three separate failures** across different layers:
1. **Build phase**: The `@sentry/react-native` plugin injected an "Upload Debug Symbols" build phase into Xcode. Without org credentials, the build failed with exit code 65.
2. **JS import crash**: Even after removing the plugin from `app.json`, `import * as Sentry from '@sentry/react-native'` tried to access the now-unlinked native module, crashing with `prototype of undefined`.
3. **Stale `ios/` directory**: Removing the plugin from `app.json` didn't remove the Xcode build phase from the already-generated `ios/` folder. Required `npx expo prebuild --clean`.

### Lesson
> **Removing a plugin from `app.json` is not enough.** You must also: (a) run `prebuild --clean` to regenerate native dirs, (b) remove the JS import, and (c) uninstall the package if its native code auto-initializes. All three layers (config, JS, native binary) must be consistent.

### Future rule
- When disabling any native SDK, create a checklist: `app.json` → `import` removal → `package.json` → `prebuild --clean`.

---

## 3. Missing `babel.config.js`

### What happened
The project had no `babel.config.js` at all. This is unusual for a React Native project — Expo normally creates one during `expo init`. It's likely this project was initialized without the default template, or the file was accidentally deleted.

`react-native-reanimated` requires its Babel plugin to be listed **last** in the plugins array. Without the file, reanimated's worklet transforms never ran.

### Lesson
> **Always verify scaffold files exist before debugging runtime errors.** A missing babel config, metro config, or tsconfig can cause cryptic failures that look like dependency bugs.

### Future rule
- After `npm install`, before first run, verify: `babel.config.js`, `metro.config.js`, `app.json`, `index.js` all exist and have valid content.

---

## 4. Supabase Client Crash Without Env Vars

### What happened
`createClient(supabaseUrl, supabaseAnonKey)` throws a hard error if `supabaseUrl` is an empty string. Our code passed `''` as a fallback when env vars were missing, which crashes the app on boot.

### Lesson
> **Every external service client must be guarded against missing credentials.** In DEV, you cannot assume env vars are set. The pattern should be: if credentials exist, create the real client; otherwise, provide a mock that returns safe empty results.

### Future rule
- All API client initializations follow the pattern:
  ```js
  if (credentials) {
    client = createRealClient(credentials);
  } else {
    client = createMockClient();
    console.warn('[Service] Running in offline mode');
  }
  ```

---

## 5. Multi-Agent Coordination Failures

### What happened
This project was built across multiple AI agents and sessions. Each agent made locally-correct changes, but the combined effect created inconsistencies:
- One agent removed Sentry from `app.json` plugins but left the JS import.
- One agent downgraded MMKV to v2.12.2 in the plan, but v4.3.1 stayed in `package.json`.
- The `babel.config.js` was never created because no single agent took ownership of the full build pipeline.

### Lesson
> **Multi-agent workflows need a "consistency checker" step.** After any agent session, a verification pass should confirm: (a) all imports resolve to installed packages, (b) all `app.json` plugins have corresponding dependencies, (c) all native modules have correct babel/metro configuration.

### Future rule
- End every session with a `npx expo doctor` or equivalent health check.
- Maintain a `MANIFEST.md` that lists every native dependency and its required config (babel plugin, app.json plugin, env vars).

---

## 6. Hermes Runtime Gaps

### What happened
`AbortSignal.timeout(5000)` was used in `mastodonFeed.js`. This is a modern Web API that exists in Node.js and browsers, but **not in Hermes** (React Native's JS engine). It silently returned `undefined`, causing every Mastodon fetch to fail with `AbortSignal.timeout is not a function`.

### Lesson
> **Hermes is not Node.js and not a browser.** Always check Hermes compatibility before using modern APIs. Common gaps: `AbortSignal.timeout`, `structuredClone`, `crypto.randomUUID`, `URL` (needs polyfill).

### Future rule
- Use `AbortController` + `setTimeout` instead of `AbortSignal.timeout`.
- Keep a "Hermes compatibility" reference in Code_Rules.md.

---

## 7. Stale Metro Bundle Cache

### What happened
After fixing code, the iOS Simulator kept showing old errors. Metro's development client caches the initial bundle, and pressing `r` to reload sometimes served the stale version. This made it appear that our fixes weren't working, leading to unnecessary additional debugging.

### Lesson
> **After significant changes (removing imports, adding babel config), you MUST:**
> 1. Kill Metro (`Ctrl+C` or `lsof -ti :8081 | xargs kill -9`)
> 2. Clear cache (`npx expo start -c`)
> 3. For native changes: full rebuild (`npx expo run:ios`)

### Future rule
- If a fix "doesn't work" after a reload, always try a full clean restart before investigating further.

---

## 8. No Tests Until the End

### What happened
28 automated tests were written at the very end of the project. If these had existed earlier, several bugs would have been caught immediately:
- The `evaluateSignals` threshold logic could have been validated without running on device.
- The Mastodon feed's `AbortSignal.timeout` would have failed in Jest (Node.js doesn't use Hermes, but mocking would have revealed the dependency).
- The seed data validation would have caught any schema drift from future edits.

### Lesson
> **Write tests for business logic BEFORE building the UI layer.** Storage, signal evaluation, and feed parsing are all pure logic — no native dependencies needed. These tests take 0.5 seconds to run and would have saved hours of simulator debugging.

---

## 9. DEV → PROD Transition Guide

> Everything in this section was intentionally shimmed, mocked, or disabled for DEV. **Every item must be addressed before shipping to the App Store.**

### Phase 1: Restore Native Dependencies

#### ☐ MMKV (Persistent Storage)
The in-memory shim in `storage.js` works for DEV, but PROD needs real disk persistence.

**Option A — Downgrade to MMKV v2 (safer):**
```bash
npm uninstall react-native-mmkv
npm install react-native-mmkv@2.12.2
npx expo prebuild --clean
```
Then restore `storage.js`:
```js
import { MMKV } from 'react-native-mmkv';
export const storage = new MMKV();
```

**Option B — Keep MMKV v4 (Nitro) but lazy-init:**
```js
import { MMKV } from 'react-native-mmkv';
let _instance;
export const storage = () => {
  if (!_instance) _instance = new MMKV();
  return _instance;
};
```
> ⚠️ Option B requires every call site to change from `storage.get()` to `storage().get()`.

#### ☐ Sentry (Error Monitoring)
1. Create a Sentry org + project at [sentry.io](https://sentry.io)
2. Install and re-link:
   ```bash
   npm install @sentry/react-native
   ```
3. Add the plugin back to `app.json`:
   ```json
   "plugins": ["@sentry/react-native"]
   ```
4. Restore `App.js`:
   ```js
   import * as Sentry from '@sentry/react-native';
   Sentry.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN, tracesSampleRate: 0.2 });
   // ...
   export default Sentry.wrap(App);
   ```
5. Set `EXPO_PUBLIC_SENTRY_DSN` in your EAS secrets or `.env`
6. Run `npx expo prebuild --clean && npx expo run:ios`

### Phase 2: Connect Live Services

#### ☐ Supabase (Backend)
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the PostGIS schema migrations (see `Development_Roadmap.md`)
3. Set env vars:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Remove the mock client guard in `supabase.js` — the real `createClient` will now have valid credentials
5. **Test**: Verify gem submission flows to the `gems` table in the Supabase dashboard

#### ☐ Google OAuth (Authentication)
1. Create OAuth credentials in Google Cloud Console
2. Configure `expo-auth-session` with the client ID
3. Remove the "DEV Bypass" button from `AuthScreen.js`:
   ```js
   // Delete or gate behind __DEV__:
   if (__DEV__) { /* show bypass button */ }
   ```
4. **Test**: Full login → token save → session persistence → logout flow

#### ☐ Mastodon Feed (Live Signals)
1. Verify the endpoint `https://mastodon.social/api/v1/timelines/tag/` is accessible from the production network
2. Consider using a self-hosted or dedicated Mastodon instance for rate limiting protection
3. The `AbortController` timeout is already production-ready (5s fail-closed)
4. **Test**: Confirm signals appear on the radar map after authentication

### Phase 3: Build Hardening

#### ☐ Signal Threshold
In `signalService.js`, the threshold is controlled by:
```js
const SIGNAL_THRESHOLD = process.env.EXPO_PUBLIC_DEV_MODE === 'true' ? 1 : 2;
```
- **DEV**: 1 signal triggers an alert (for testing)
- **PROD**: 2+ signals required for a confirmed alert
- **Action**: Remove `EXPO_PUBLIC_DEV_MODE` from production env, or set to `'false'`

#### ☐ Moderation
- **DEV**: Gem submissions bypass moderation (instant publish)
- **PROD**: Requires AI moderation (OpenAI via Supabase Edge Functions) + 3-vote community validation
- **Action**: Deploy the Edge Function and wire up `GemSubmissionModal.js` to call it before insert

#### ☐ Push Notifications
- **DEV**: `expo-notifications` is installed but notifications are local-only
- **PROD**: Configure APNs (iOS) and FCM (Android) push certificates
- **Action**: Follow [Expo Push Notifications guide](https://docs.expo.dev/push-notifications/overview/)

### Phase 4: App Store Preparation

#### ☐ EAS Build
Switch from local builds to EAS (Expo Application Services):
```bash
npm install -g eas-cli
eas build:configure
eas build --platform ios --profile production
```

#### ☐ Privacy & Compliance
- [ ] `PRIVACY.md` is already written — convert to App Store Privacy URL
- [ ] Add NSLocationWhenInUseUsageDescription to `app.json` (already present)
- [ ] Add background location justification if using background polling
- [ ] Ensure no plain-text tokens (Code_Rules.md Rule 14)

#### ☐ Performance
- [ ] Reduce `tracesSampleRate` in Sentry from 1.0 to 0.2 (avoid quota exhaustion)
- [ ] Enable marker clustering for 100+ gems on the map
- [ ] Set polling interval floor to 1 minute (battery protection)
- [ ] Verify `tracksViewChanges={false}` on all map markers

#### ☐ Environment Variables Checklist
| Variable | DEV Value | PROD Value |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | empty (mock) | `https://your-project.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | empty (mock) | Real anon key |
| `EXPO_PUBLIC_SENTRY_DSN` | empty (disabled) | Real Sentry DSN |
| `EXPO_PUBLIC_DEV_MODE` | `true` | `false` or unset |
| `SENTRY_DISABLE_AUTO_UPLOAD` | `true` | `false` |

### Phase 5: Verification Before Ship

```bash
# 1. Run automated tests
npm test

# 2. Build production bundle
eas build --platform ios --profile production

# 3. Test on physical device via TestFlight
eas submit --platform ios

# 4. Verify in TestFlight:
#    - Cold start → Auth screen (no bypass button)
#    - Google Login → Map loads with seed data + live gems
#    - Signal polling shows live Mastodon data
#    - Gem submission goes through moderation
#    - Push notification received for 2+ signal burst
#    - Kill app → reopen → session persisted (MMKV)
#    - Airplane mode → offline banner + seed data only
```

---

## Summary: Top 5 Rules for Next Time

1. **Isolate by subtraction** — When debugging opaque crashes, comment out imports one at a time instead of guessing.
2. **Never construct native modules at module scope** — Use lazy initialization or factories.
3. **Multi-layer removal** — Disabling a native SDK requires changes to config, JS imports, package.json, AND a clean prebuild.
4. **Test business logic first** — Write unit tests before touching the simulator.
5. **Verify scaffold files** — Before first run, confirm babel.config.js, metro.config.js, and all entry points exist.

