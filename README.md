# City Radar Spec (MVP: Austin Radar)

## 1. Tech Stack
- **Framework**: React Native (Expo Managed Workflow)
- **Development**: Expo Go (Fast iterations) / Development Builds (Native dependencies)
- **Map**: `react-native-maps` (Native, zero API cost)
- **Backend**: Supabase (Postgres+PostGIS) / Firebase
- **State/Cache**: TanStack Query + MMKV (Offline-first)
- **Auth**: Mandatory Google OAuth on boot
- **Monitoring**: Sentry (Silent error/performance tracking)
- **Infrastructure**: GitHub Actions (Cron-based scrapers for zero-cost background runs)

## 2. Global Logic
- **Community Gems**: Public, anonymized (no IDs/timestamps). 4-5 stars only. Max 2 compressed photos + legal ownership checkbox.
- **Cold Start**: Seeded cache of "Proven Winners" (Rooftops, Pubs).
- **Core Entities**: Speakeasies (Door instructions + Passwords).
- **Live Radar**: Multi-scraper X/Twitter redundancy.
  - **DEV**: Predefined location matching; 2-signal redundancy rule bypassed by default (push all signals) with a manual "noise opt-out".
  - **PROD**: Requires 2+ signals for confirmed push alerts; uses keyword matching for bars/venues.

## 3. Location & Battery
- **Discovery**: City-wide mapping. Push alerts for urgent/live events only.
- **Battery Sync**: Polling (1m-1h) and Auto-Kill (1h-4h) user-configurable.
- **UX**: Educational pre-prompt for background location justifications.

## 4. Moderation & UX
- **Aesthetic**: "Pulsing Radar" UI (Minimum Functionality compliance).
- **Performance**: Marker Clustering + Bounding Box DB queries.
- **Moderation**: 
  - **DEV**: Open (Moderation Bypass enabled).
  - **PROD**: AI (OpenAI via Supabase Edge Functions) + 3-vote community validation.
- **Fail-Safe**: Silent degradation (Sentry logs the failure, UI hides the component).

## 5. Deployment
- **Velvet Rope**: Invite-only rollout (100 -> 1000 -> 5000).
- **Stale Data**: UI Disclaimer: "Confirm at source; community aggregated."
- **Monetization**: Ad revenue fuels migration to Premium APIs.
- **Legal**: Public `PRIVACY.md` required for background location App Store approval.

## 6. Stretch Goals
- Guest browsing, AI NLP context filtering, Yelp/Places API integration + Resy/OpenTable deep-links, Recency Decay (90 days) + Insider Status.
