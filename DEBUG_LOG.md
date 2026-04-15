# Debug & Troubleshooting Log: Austin Radar

This document tracks significant technical hurdles, error messages, and their resolution strategies during the development of the Austin Radar application.

---

## 🛑 Environment & Connectivity

### 1. Package Version Drift
- **Error**: "The following packages should be updated for best compatibility... react-native-maps@1.27.2 - expected version: 1.20.1"
- **Cause**: Project dependencies drifted from the Expo SDK 54 baseline during external updates.
- **Solution**: Executed `npx expo install --fix` to force alignment with the validated Expo SDK peer dependencies.

### 2. Physical Device Connection (Firewall)
- **Error**: "Request timed out" when scanning QR code in Expo Go.
- **Cause**: macOS Firewall blocking incoming connections to the Node.js process on port 8081.
- **Solution**: Added `/opt/homebrew/bin/node` to allowed incoming connections in System Settings.

### 3. Tunnel Mode Failure (Ngrok)
- **Error**: `CommandError: TypeError: Cannot read properties of undefined (reading 'body')`
- **Cause**: External service outage at Ngrok or CLI version mismatch.
- **Solution**: Pivoted from Tunnel mode to local iOS Simulator testing (requiring Xcode installation).

---

## 📱 Native & Runtime Issues

### 4. Nitro Modules Incompatibility
- **Error**: `Runtime not ready: nitromodules are not supported in expo go`
- **Cause**: `react-native-mmkv` (v3+) relies on the Nitro bridge, which is not pre-compiled into the standard Expo Go sandbox.
- **Solution**: Transitioned the workflow from **Expo Go** to a **Development Build** using `expo-dev-client` and `npx expo run:ios`.

### 5. App Entry Not Found
- **Error**: `app entry not found`
- **Cause**: A mismatch between the Metro bundler's expectation and the `package.json` entry point while transitioning between environments.
- **Solution**: Standardized `index.js` by adding `import 'expo-dev-client'` at the top and ensuring `registerRootComponent` correctly links to the main `App.js`.

### 6. CocoaPods Encoding Crash
- **Error**: `Unicode Normalization not appropriate for ASCII-8BIT (Encoding::CompatibilityError)`
- **Cause**: Ruby (CocoaPods) environment in the terminal defaulted to ASCII instead of UTF-8.
- **Solution**: Forced the shell environment using:
  ```bash
  export LANG=en_US.UTF-8
  export LC_ALL=en_US.UTF-8
  ```

### 7. Sentry Build Blocker
- **Error**: `error: An organization ID or slug is required (provide with --org)` during `xcodebuild`.
- **Cause**: The Sentry Expo plugin automatically attempts to upload debug symbols during the build phase, which fails without cloud credentials.
- **Solution**: Temporarily disabled the Sentry plugin in `app.json` to allow local native compilation.

---

## 🛠 Active Solution Summary
| Hurdle | Current Status |
| :--- | :--- |
| **Expo Go Compatibility** | 🛑 DEPLETED (Moved to Dev Client) |
| **MMKV / Nitro Support** | ✅ RESOLVED (Native build) |
| **Firewall / Network** | 🛠 BYPASSED (Via Simulator) |
| **Sentry Hardware** | ⏸ PAUSED (Until PROD Milestone) |

> [!TIP]
> Always use `npx expo run:ios` moving forward to ensure all native modules are properly linked and running in the "NASA-grade" environment.
