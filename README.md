# Streamify - Premium Music Streaming App

A stunning, Spotify-like glassmorphism music streaming web application with premium features and a futuristic design.

## Features

### Design & Aesthetic
- Premium glassmorphism UI with frosted glass cards
- Neon glowing accents and smooth shadows
- Full dark mode with gradient mesh backgrounds
- Smooth animations and transitions throughout
- Responsive design for desktop, tablet, and mobile

### Core Features
- **Music Metadata**: Fetch track, artist, and album information from LastFM API
- **Music Playback**: Stream audio from YouTube using YouTube IFrame API
- **Search**: Search across songs, albums, and artists with real-time results
- **Home Page**: Trending tracks and popular artists with quick play cards
- **Library**: Manage liked songs, playlists, and recently played tracks
- **Playlist Management**: Create, organize, and manage custom playlists

### Player Features
- Sticky bottom player bar with full controls (play/pause, skip, shuffle, repeat, volume)
- Expandable "Now Playing" screen with large album art and blurred background
- Real-time progress tracking
- Queue management
- Smooth playback transitions

### User Experience
- localStorage integration for playlists, liked songs, and listening history
- Responsive navigation with glassmorphism sidebar
- Smooth page transitions
- Premium hover effects and micro-interactions

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom glassmorphism effects
- **APIs**:
  - LastFM API for music metadata
  - YouTube IFrame API for audio playback
- **Storage**: localStorage for user data persistence

## Project Structure

```
project/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Sidebar.js     # Navigation sidebar
│   │   └── Player.js      # Music player component
│   ├── pages/             # Page components
│   │   ├── Home.js        # Home page with trending content
│   │   ├── Search.js      # Search functionality
│   │   └── Library.js     # User library and playlists
│   ├── services/          # Business logic
│   │   ├── api.js         # API integration (LastFM & YouTube)
│   │   └── player.js      # Player service with state management
│   ├── utils/             # Helper functions
│   │   ├── helpers.js     # General utilities
│   │   └── storage.js     # localStorage management
│   ├── styles/            # Styling
│   │   └── main.css       # Main CSS with glassmorphism effects
│   └── main.js            # App entry point
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get API Keys

#### LastFM API Key
1. Go to [LastFM API](https://www.last.fm/api/account/create)
2. Create an account and get your API key
3. Add it to `.env` file

#### YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add it to `.env` file

### 3. Configure Environment Variables

Update `.env` file in the root directory with your API keys:

```env
VITE_LAST_FM_API_KEY=your_lastfm_api_key_here
VITE_YT_API_KEY=your_youtube_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

## Usage

### Navigation
- **Home**: Discover trending tracks and popular artists
- **Search**: Find specific songs, artists, or albums
- **Library**: Access your liked songs, playlists, and recently played tracks

### Playing Music
1. Browse or search for tracks
2. Click on any track to play
3. Use the bottom player bar for playback controls
4. Click album art to expand into full "Now Playing" view

### Creating Playlists
1. Go to Library
2. Click "Create Playlist"
3. Enter playlist name and description
4. Tracks are saved with localStorage

### Keyboard Shortcuts (Player Bar)
- Play/Pause: Click the center play button
- Next Track: Click next button or track will auto-advance
- Previous Track: Click previous button
- Seek: Click on progress bar

## Key Features Explained

### Glassmorphism Design
The app uses modern glassmorphism effects with:
- Frosted glass backgrounds (`backdrop-filter: blur()`)
- Semi-transparent layers
- Subtle borders and shadows
- Smooth hover transitions

### Player Architecture
- Centralized player service with state management
- Event-driven updates using observer pattern
- YouTube IFrame API integration for seamless playback
- Queue management with localStorage persistence

### API Integration
- **LastFM**: Provides rich music metadata, search, and charts
- **YouTube**: Delivers actual audio playback via video IDs
- Efficient API calls with Promise.all for parallel requests

### Responsive Design
- Mobile-first approach
- Tailwind utility classes for responsive breakpoints
- Optimized layouts for all screen sizes
- Touch-friendly UI elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy loading of music data
- Debounced search queries
- Efficient state management
- Minimal re-renders
- Optimized asset loading with Vite

## Preview

The app features:
- Clean, modern glassmorphism interface
- Smooth animations and transitions
- Responsive design across all devices
- Premium Spotify-like experience

## Credits

- **Design Inspiration**: Spotify, Tidal, Deezer
- **Icons**: Heroicons (inline SVG)
- **Font**: Inter (Google Fonts)
- **APIs**: LastFM, YouTube

## License

This project is for educational and demonstration purposes.

---

Built with modern web technologies and premium design principles.
