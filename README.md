<p align="center">
  <img src="assets/maktaba-icon.png" width="120" alt="Maktaba Logo">
</p>

<h1 align="center">Maktaba</h1>

<p align="center">
  <b>مکتبہ</b> — A free Urdu book reading app with 3,000+ local books. Fully offline, no API calls.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/android-7.0+-green" alt="Android">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="License">
</p>

---

## About

Maktaba is a lightweight, offline-first Urdu book reader built with React Native and Expo. All books are bundled locally — zero network requests, instant loading, works without internet.

## Features

- **3,000+ Urdu books** — Islamic, novels, poetry, history, humor, and more
- **1,000+ PDF books** across multiple categories
- **100% offline** — no API calls, no tracking, works in airplane mode
- **Light & Dark mode** — warm earthy color palette, Apple-inspired design
- **Personal library** — track books as Want to Read, Reading, or Finished
- **Notes & ratings** — add notes and rate books you've read
- **Instant search** — search across all Urdu and PDF books
- **Book requests** — request new books via email
- **Guest access** — skip sign-up and browse immediately
- **Lightweight** — 21-26MB per APK (down from 83MB)

## Screenshots

> _Add screenshots here before release_

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 54 |
| Navigation | Expo Router |
| Auth | Firebase Authentication |
| Storage | AsyncStorage (local) |
| Images | expo-image (disk + memory caching) |
| Icons | Material Icons |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for building)

### Install

```bash
git clone https://github.com/Zaidx-me/maktaba.git
cd maktaba
npm install
```

### Development

```bash
npx expo start
```

### Build APK

```bash
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleRelease
```

APK output: `android/app/build/outputs/apk/release/`

## Project Structure

```
app/
  (auth)/login.tsx          # Login / Sign up
  (tabs)/
    index.tsx               # Home screen
    search.tsx              # Search
    shelf.tsx               # Collections
    library.tsx             # Personal library
    profile.tsx             # Profile & settings
  shelf/[category].tsx      # Category book list
  book/[id].tsx             # Book detail
  reader/[id].tsx           # PDF reader
src/
  components/               # Reusable UI (BookCard, SearchBar, etc.)
  services/                 # Auth, local DB, book data
  context/                  # Theme provider
  data/                     # Local book JSON data
  constants/                # Theme tokens, spacing, typography
```

## APK Sizes

| Architecture | Size |
|-------------|------|
| arm64-v8a (modern phones) | ~26 MB |
| armeabi-v7a (older phones) | ~21 MB |

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open a Pull Request

## Support

Email: maktaba.support@gmail.com

## License

MIT
