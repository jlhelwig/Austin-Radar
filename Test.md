# Austin Radar: Testing Protocols

## 1. Components
- **Background Location**: Validate polling (X min/Y miles) and 4-hour hard termination.
- **Battery**: Log % drop: 4h active vs background.
- **Silent Fail**: Mock null scraper/API data; verify UI hides without errors.
- **Offline**: Disable data; verify MMKV "Proven Winners" render.

## 2. Live Logic
- **Thresholds**: 1 signal = No push; 2 signals = Push triggered.
- **AI Intent (Stretch)**: Filter noise ("I wish...") from intent ("He is here").
- **Discovery**: Ensure city-wide markers render correctly.
- **Urgent Alerts**: Verify push only for live sightings/closing events.

## 3. Data/Security
- **Rating**: 1-3 stars must be UI-blocked.
- **Media**: Validate client-side compression + 2-photo quota.
- **Anonymity**: Ensure API responses skip UUIDs/Timestamps.
- **PROD Moderation**: AI Safety Net checks + 3-vote community unlock.

## 4. UI/Scaling
- **Bounds**: Verify pins fetch only for current viewport.
- **Clustering**: Test frame rates for 100+ dense pins.
- **Auth**: Validate Google OAuth intercept on boot + Supabase record creation.
