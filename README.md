# Hello World — Expo / React Native / Google Play masterclass

A tiny, standalone Android demonstration app for teaching Google Play Console publishing.

**Included:** `App.js`, `index.js`, `app.json`, `package.json`, `eas.json`, application icon assets, `.gitignore`, and a step-by-step Windows guide.

**Important:** This archive contains **source code**, not a pre-built `.aab`. You generate a signed `.aab` locally on Windows with Android Studio / Gradle.

## Quick start (Windows PowerShell)

```powershell
cd C:\dev\PlayStoreHelloWorld
npm install
npx expo start --go
```

To build the signed AAB locally, see **[docs/BUILD-LOCAL-WINDOWS-FR.md](docs/BUILD-LOCAL-WINDOWS-FR.md)**.

## Before building

- In `app.json`, set `expo.android.package` to the **exact** package ID expected by the target Google Play app.
- Default demo package ID: `com.masterclass.helloworldexpo`.
- Increment `expo.android.versionCode` for future uploads.
- Requires Node.js 22.13+; Expo SDK 57 / React Native 0.86.3 target Android API 36.
- Uses npm only. No workspace and no pnpm.

## Production note

For this classroom example, use **Google Play internal testing**. A bare Hello World app may not meet Google's minimum-functionality requirements for a public production release. Privacy and Data safety answers must reflect the actual final binary.
