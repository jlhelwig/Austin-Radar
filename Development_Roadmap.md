# Austin Radar: Development Roadmap

This guide outlines the logical sequence for building **Austin Radar**. Each milestone follows the `Code_Rules.md` and `README.md` architected previously.

---

## 🟢 Milestone 1: The Gateway (Auth & Navigation)
*Goal: Get the user authenticated and into an empty map.*

### 🛠 Tasks
- [ ] **Google OAuth Integration**: Implement the `expo-auth-session` flow.
- [ ] **API Client**: Initialize the Supabase client in `src/api/supabase.js`.
- [ ] **Base Navigation**: Set up a Stack Navigator with `AuthScreen` and `MainMapScreen`.
- [ ] **MMKV Storage**: Setup a wrapper to store the `userToken` and `hasCompletedOnboarding` flag.

**💡 AI Tip**: Ask me: *"Implement the Google Auth flow using expo-auth-session and link it to our Supabase client."*

---

## 🟡 Milestone 2: The Core Radar (Map & UI)
*Goal: The unique Pulsing Radar view and "Proven Winners" markers.*

### 🛠 Tasks
- [ ] **Map Initialization**: Render `react-native-maps` with a custom dark/neon theme.
- [ ] **Pulsing UI**: Create the "Radar" pulse animation component in `src/components`.
- [ ] **Seeded Markers**: Load the "Proven Winners" (Rooftops, Pubs) from a local JSON onto the map.
- [ ] **Bounding Box**: Implement a function to only fetch pins from Supabase that are inside the current viewport.

**💡 AI Tip**: Ask me: *"Create the MapView component with marker clustering and the pulsing radar overlay animation."*

---

## 🟠 Milestone 3: The Gem Pipeline (Submissions)
*Goal: Allow users to contribute 4/5-star spots.*

### 🛠 Tasks
- [ ] **Submission Modal**: A clean bottom-sheet UI for adding a Gem.
- [ ] **Photo Compression**: Use `expo-image-manipulator` to aggressively shrink photos before upload.
- [ ] **Legal Check**: Implement the "I own this" checkbox logic.
- [ ] **Privacy Scrub**: Ensure timestamps/IDs are stripped before the record hits Supabase.

**💡 AI Tip**: Ask me: *"Build the Gem submission screen with image compression and the legal ownership checkbox logic."*

---

## 🔴 Milestone 4: Live Radar (Scrapers & Alerts)
*Goal: Real-time celebrity and event notifications.*

### 🛠 Tasks
- [ ] **Background Task**: Register the Expo `TM.Task` for 15-min location polling.
- [ ] **Battery Settings**: Build the settings UI so users can select their Kill-Switch and Polling frequency.
- [ ] **Signal Logic**: Implement notification triggers.
    - **Dev**: Bypass 2-signal rule by default; include "Noise Opt-Out" setting.
    - **Prod**: Trigger push ONLY if 2+ signals match a location (keywords/venues).
- [ ] **Scraper Logic**: (GitHub Actions) Script the X/Twitter scraping logic for our city-variable.

**💡 AI Tip**: Ask me: *"Implement the background location task with the user-configurable battery auto-kill switch."*

---

## 🟣 Milestone 5: Polish & Security
*Goal: Production hardening.*

### 🛠 Tasks
- [ ] **AI Moderation (PROD)**: Hook Gem submissions into OpenAI Moderation via **Supabase Edge Functions**.
    - **Dev**: Implement a "Moderation Bypass" flag for rapid testing and iteration.
- [ ] **Sentry Integration**: Initialize Sentry for silent-fail reporting.
- [ ] **App Store Assets**: Configuration of `app.json` icons, splash screen, and naming.

**💡 AI Tip**: Ask me: *"Integrate Sentry monitoring and OpenAI moderation into our production submission pipeline."*

---

## 🚀 How to use this file
1. **Commit often**: After finishing a task, commit your progress.
2. **Follow the Rules**: Ensure every new file follows the 60-line function limit from `Code_Rules.md`.
3. **Test as you go**: Use `Test.md` to verify each milestone before moving to the next.
