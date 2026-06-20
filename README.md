# Maktaba

A free Urdu book reading app with thousands of local Urdu and PDF books — completely offline, no API calls.

## Features

- **2,000+ Urdu books** from TheLibraryPK (Islamic, novels, poetry, history, fun reads)
- **1,000+ PDF books** across multiple categories
- **100% offline** — all books are bundled locally, zero network requests
- **Dark mode** — Apple system colors for comfortable reading
- **Personal library** — track books as Want to Read, Reading, or Finished
- **Notes & ratings** — add notes and rate books you've read
- **Search** — instant search across all Urdu and PDF books
- **Book requests** — request new books via email
- **Guest access** — skip sign-up and browse immediately

## Tech Stack

- React Native / Expo SDK 54
- Firebase Authentication (email/password)
- AsyncStorage for local data
- expo-image for optimized image loading
- Material 3 icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Build Android APK
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleRelease
```

## Project Structure

```
app/                    # Expo Router screens
  (auth)/               # Login/signup
  (tabs)/               # Home, Search, Shelf, Library, Profile
  shelf/[category].tsx  # Category book list
  book/[id].tsx         # Book detail
src/
  components/           # Reusable UI components
  services/             # Auth, local DB, book data
  context/              # Theme and auth context
  data/                 # Local book JSON data
  constants/            # Theme tokens
```

## APK Output

```
android/app/build/outputs/apk/release/app-release.apk
```

## Support

Email: maktaba.support@gmail.com
