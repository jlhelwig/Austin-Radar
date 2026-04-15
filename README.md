# Austin Radar

> Mission-Critical City Scouting — Real-time radar for Austin's best spots.

---

## Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **Xcode** (with iOS Simulator — required for native build)
- **CocoaPods** (`brew install cocoapods` if missing)
- **Watchman** (optional but recommended: `brew install watchman`)

### Install Dependencies
```bash
npm install
```

### Run on iOS Simulator
```bash
# Set encoding (required for CocoaPods on macOS)
export LANG=en_US.UTF-8 && export LC_ALL=en_US.UTF-8

# First run (compiles native code + launches simulator — ~5 min)
npx expo run:ios

# Subsequent runs (uses cached build — ~30 sec)
npx expo start --ios
```

### Run with Cache Clear
```bash
npx expo start -c --ios
```

### Stop the Application
- **In terminal**: Press `Ctrl+C`
- **Kill background Metro**: `lsof -ti :8081 | xargs kill -9`
- **Kill everything**: `pkill -f node && pkill -f Metro`

---

## Commands Reference

| Command | What It Does |
|---|---|
| `npx expo run:ios` | Full native compile + launch (use after dependency changes) |
| `npx expo start --ios` | Start Metro + open simulator (fast, uses cached build) |
| `npx expo start -c --ios` | Same as above but clears Metro bundler cache |
| `npx expo prebuild --clean` | Regenerate `ios/` and `android/` native directories |
| `npm install` | Install/update JS dependencies |
| Press `r` in Metro | Reload the JS bundle in the simulator |
| Press `j` in Metro | Open Chrome DevTools debugger |
| Press `m` in Metro | Toggle the dev menu in the simulator |

---

## Project Structure

```
Austin-Radar/
├── App.js                    # Root component (providers + navigation)
├── index.js                  # Entry point (registers root component)
├── babel.config.js           # Babel config (reanimated plugin required)
├── app.json                  # Expo configuration
├── package.json              # Dependencies
│
├── src/
│   ├── api/
│   │   ├── mastodonFeed.js   # Live signal fetcher (Mastodon hashtags)
│   │   ├── signalService.js  # Push notification logic + thresholds
│   │   ├── mockSignals.js    # DEV-only test signal injection
│   │   └── supabase.js       # Supabase client (offline mock in DEV)
│   ├── components/
│   │   ├── RadarPulse.js     # Animated pulsing radar overlay
│   │   ├── GemMarker.js      # Custom map markers for community gems
│   │   ├── GemSubmissionModal.js  # Bottom sheet for adding gems
│   │   └── EdgeStateUI.js    # Offline banner + zero state
│   ├── hooks/
│   │   ├── useGems.js        # TanStack Query hook for gem data
│   │   └── useSignalPolling.js # Foreground polling lifecycle
│   ├── navigation/
│   │   └── AppNavigator.js   # Stack navigator with auth gating
│   ├── screens/
│   │   ├── AuthScreen.js     # Login screen with DEV bypass
│   │   ├── MainMapScreen.js  # Core radar map interface
│   │   └── SettingsScreen.js # Polling frequency + mute toggle
│   ├── store/
│   │   └── storage.js        # Storage wrapper (in-memory shim for DEV)
│   ├── theme/
│   │   └── tokens.js         # Design tokens (colors, spacing, typography)
│   └── data/
│       └── proven_winners.json # Seeded "Proven Winners" venue data
│
├── ios/                      # Generated native iOS project
├── android/                  # Generated native Android project
│
├── Code_Rules.md             # NASA Power of Ten coding standards
├── Development_Roadmap.md    # Milestone tracker (DEV/PROD split)
├── Test.md                   # Testing protocols
├── DEBUG_LOG.md              # Historical error log with solutions
├── MODIFICATIONS.md          # Codebase review + change log
└── PRIVACY.md                # App Store privacy policy
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Build | Development Build via `expo-dev-client` |
| Map | `react-native-maps` (native, zero API cost) |
| Backend | Supabase (Postgres + PostGIS) |
| State | TanStack Query + in-memory storage (DEV) |
| Auth | Google OAuth (DEV bypass available) |
| Signals | Mastodon public hashtag API |
| Monitoring | Sentry (disabled in DEV, no credentials required) |

---

## DEV vs PROD

| Feature | DEV | PROD |
|---|---|---|
| Auth | DEV Bypass button on login | Google OAuth required |
| Storage | In-memory (resets on restart) | MMKV (persistent) |
| Supabase | Mock client (seed data only) | Live Postgres connection |
| Signal Alerts | 1 signal = push | 2+ signals required |
| Moderation | Bypass (instant submit) | AI + 3-vote community |
| Sentry | Disabled | Full stack traces |

---

## Environment Variables

Create a `.env` file or set in `app.json` > `extra`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
EXPO_PUBLIC_DEV_MODE=true
```

> **Note**: The app runs fully offline without any env vars — it uses seed data and skips Sentry/Supabase.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `prototype of undefined` crash | MMKV/Nitro init issue — ensure `storage.js` uses in-memory shim for DEV |
| Port 8081 already in use | `lsof -ti :8081 \| xargs kill -9` |
| CocoaPods encoding error | `export LANG=en_US.UTF-8 && export LC_ALL=en_US.UTF-8` |
| Sentry build failure | Sentry plugin is disabled in `app.json` — run `npx expo prebuild --clean` |
| Stale bundle after code change | Press `r` in Metro terminal, or restart with `-c` flag |
| `babel-preset-expo` not found | `npm install --save-dev babel-preset-expo` |

See [DEBUG_LOG.md](DEBUG_LOG.md) for the full error history.

---

## Documentation

- [Code_Rules.md](Code_Rules.md) — NASA Power of Ten standards
- [Development_Roadmap.md](Development_Roadmap.md) — Milestone tracker
- [Test.md](Test.md) — Testing protocols
- [PRIVACY.md](PRIVACY.md) — App Store privacy policy
- [DEBUG_LOG.md](DEBUG_LOG.md) — Error history + solutions
- [MODIFICATIONS.md](MODIFICATIONS.md) — Codebase review log
