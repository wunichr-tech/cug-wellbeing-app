name: Build CUG Wellbeing APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:  # allows manual trigger from GitHub website

jobs:
  build-apk:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      # 1. Check out the code
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. Set up Node.js
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # 3. Install JS dependencies
      - name: Install dependencies
        run: npm install --legacy-peer-deps

      # 4. Build the web app (creates the dist/ folder)
      - name: Build web app
        run: npm run build

      # 5. Install Capacitor CLI
      - name: Install Capacitor CLI
        run: npm install -g @capacitor/cli --legacy-peer-deps

      # 6. Add Android platform
      - name: Add Android platform
        run: npx cap add android

      # 7. Sync web build into Android project
      - name: Sync Capacitor
        run: npx cap sync android

      # 8. Set up Java 17 (required for modern Android builds)
      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      # 9. Set up Android SDK
      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      # 10. Accept Android SDK licenses
      - name: Accept Android licenses
        run: yes | sdkmanager --licenses || true

      # 11. Make Gradle wrapper executable
      - name: Make gradlew executable
        run: chmod +x android/gradlew

      # 12. Build the debug APK
      - name: Build debug APK
        working-directory: android
        run: ./gradlew assembleDebug --no-daemon --stacktrace

      # 13. Upload the APK as a downloadable artifact
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: CUG-Wellbeing-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30

      # 14. Print success message
      - name: Build complete
        run: |
          echo "✅ APK built successfully!"
          echo "📱 Download it from the Actions tab → CUG-Wellbeing-APK"
          ls -lh android/app/build/outputs/apk/debug/app-debug.apk
