# 🎵 Spotify-like Music Player

A modern, responsive music player web application inspired by Spotify's design. Built with vanilla JavaScript and integrates Last.fm API for music metadata and YouTube API for audio streaming.

## ✨ Features

- **Modern Spotify-like UI**: Dark theme with clean, intuitive design
- **Multi-API Integration**: Last.fm for music data + YouTube for streaming
- **Smart Search**: Search tracks, artists, and albums with instant results
- **Queue Management**: Add songs to queue with next/previous navigation
- **Playback Controls**: Play/pause, shuffle, repeat modes
- **Volume Control**: Adjustable volume with visual feedback
- **Recently Played**: Track your listening history
- **Your Library**: Save and manage your favorite tracks
- **Album View**: Browse complete album tracklists
- **Responsive Design**: Optimized for desktop and mobile devices

## 🏗️ Architecture

The application follows a clean, modular architecture:

```
src/
├── components/
│   ├── PlayerController.js    # YouTube player and audio control
│   ├── SearchController.js    # Search functionality and results
│   ├── UIController.js        # View management and navigation
│   └── QueueManager.js        # Queue and playback state management
├── styles/
│   ├── main.css              # Core styles and layout
│   └── album-view.css        # Album-specific styling
├── api/
│   ├── lastfm.js             # Last.fm API wrapper
│   └── youtube.js            # YouTube API wrapper
└── main.js                   # Application entry point

```

## 🚀 Getting Started

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API Keys**:
   - Get a Last.fm API key from [Last.fm API](https://www.last.fm/api)
   - Get a YouTube Data API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Update the API keys in `src/api/lastfm.js` and `src/api/youtube.js`

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🎮 Usage

- **Search**: Use the search bar to find tracks, artists, or albums
- **Play Music**: Click any track to start playing
- **Queue Management**: Use next/previous buttons to navigate your queue
- **Shuffle & Repeat**: Toggle shuffle and repeat modes
- **Save Tracks**: Click the heart icon to save tracks to your library
- **Volume Control**: Adjust volume using the slider in the bottom right

## 🛠️ Technologies

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **APIs**: Last.fm API, YouTube Data API v3, YouTube Iframe API
- **Build Tool**: Vite
- **Design**: CSS Grid, Flexbox, CSS Custom Properties
- **Storage**: localStorage for queue and preferences

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Desktop (1024px+): Full sidebar and all features
- Tablet (768px-1023px): Condensed layout
- Mobile (320px-767px): Optimized mobile experience

## 🎨 Design System

- **Colors**: Dark theme with green accents (Spotify-inspired)
- **Typography**: Inter font family with multiple weights
- **Spacing**: 8px grid system for consistent spacing
- **Components**: Reusable UI components with hover states
- **Animations**: Smooth transitions and micro-interactions