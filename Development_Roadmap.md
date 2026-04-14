# Austin Radar: Development Roadmap (DEV/PROD Split)

This guide outlines the logical sequence for building **Austin Radar**. Each milestone follows the `Code_Rules.md` and `README.md` mission-critical standards.

---

## ✅ Milestone 1: The Gateway (Auth & Navigation) [COMPLETED]
*Goal: Get the user authenticated and into an empty map with DEV bypass support.*

### 🛠 [DEV] Tasks
- [x] **Folder Structure**: Establish standard `src/` directory hierarchy.
- [x] **Design Tokens**: Initialize `src/theme/tokens.js` for neon/dark aesthetic consistency.
- [x] **Supabase Client**: Initialize the Supabase client in `src/api/supabase.js` (with polyfill).
- [x] **Persistent Navigation**: Set up a Stack Navigator with **Auth Bypass** logic using MMKV storage.
- [x] **Storage Wrapper**: Implement `src/store/storage.js` for persistent credentials.

### 🛠 [PROD] Tasks
- [ ] **Google OAuth Integration**: Finalize `expo-auth-session` with production Client IDs.
- [ ] **Sentry Hardening**: Enable full stack-trace reporting and session tracking.

---

## ✅ Milestone 2: The Core Radar (Map & UI) [COMPLETED]
*Goal: The unique Pulsing Radar view and "Proven Winners" markers.*

### 🛠 [DEV] Tasks
- [x] **Map Initialization**: Render `react-native-maps` with Austin-centered view.
- [x] **Pulsing UI**: Create high-performance `RadarPulse.js` using Native Driver.
- [x] **Seeded Markers**: Load the "Proven Winners" (Rooftops, Pubs) from local JSON onto the map.
- [x] **Gem Markers**: Implement `GemMarker.js` with category-specific neon styling.
- [x] **Bounding Box Logic**: Filter seeded markers based on viewport change.

### 🛠 [PROD] Tasks
- [ ] **PostGIS Integrations**: Replace local JSON filtering with Supabase RPC calls for real-time geospatial fetching.
- [ ] **Heatmap Layer**: (Optional) Aggregate density of signals for a broader "Radar" feel.

---

## 🟡 Milestone 3: The Gem Pipeline (Submissions)
*Goal: Allow users to contribute 4/5-star spots.*

### 🛠 [DEV] Tasks
- [ ] **Submission Modal**: Implement the bottom-sheet UI for adding a Gem.
- [ ] **Dev Moderation Bypass**: Allow instant submission for trusted Dev accounts.
- [ ] **Star Filter**: Enforce the "4-5 star" submission rule at the UI level.

### 🛠 [PROD] Tasks
- [ ] **Photo Compression**: Use `expo-image-manipulator` for aggressive client-side optimization.
- [ ] **AI Moderation**: Hook submissions into **Supabase Edge Functions** (OpenAI Moderation endpoint).
- [ ] **Legal Loop**: Finalize the "I own this" and EXIF-scrubbing logic for production storage.

---

## 🔴 Milestone 4: Live Radar (Signals & Alerts)
*Goal: Real-time event notifications via Mastodon/Low-cost APIs.*

### 🛠 [DEV] Tasks
- [ ] **Signal Ingestion**: Implement the parser for Mastodon/RSS event feeds.
- [ ] **Dev Push Bypass**: Set "Single-Signal" alert triggers for debugging.
- [ ] **Noise Opt-Out**: Build the settings toggle to mute high-frequency Dev signals.

### 🛠 [PROD] Tasks
- [ ] **Background Task**: Register the Expo `TM.Task` for 15-min background polling.
- [ ] **2-Signal Rule**: Implement the production logic requiring 1+ signal redundancy before push alerts.
- [ ] **Battery Kill-Switch**: Implement the 4-hour hard termination logic for background tasks.

---

## 🟣 Milestone 5: Polish & Security
*Goal: Production hardening and App Store readiness.*

### 🛠 [DEV] Tasks
- [ ] **Mock Scenarios**: Create scripts to simulate high-traffic "Radar Pulse" events.
- [ ] **UI Polish**: Finalize edge-case layouts (offline modes, zero-state map).

### 🛠 [PROD] Tasks
- [ ] **Community Validation**: Implement the 3-vote "Unlock" logic for unverified gems.
- [ ] **App Store Assets**: Configuration of `app.json` icons, splash screen, and naming.
- [ ] **Privacy Update**: Final review of `PRIVACY.md` against background location usage.

---

## 🚀 How to use this file
1. **Follow the Rules**: Ensure every new file follows the 60-line function limit from `Code_Rules.md`.
2. **Pushback First**: Adhere to Rule 18; if a production task seems risky in Dev, flag it.
3. **Test as you go**: Use `Test.md` to verify each milestone before moving to the next.
