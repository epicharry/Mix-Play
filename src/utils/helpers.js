export function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getAlbumArt(track) {
  if (track.albumArtUrl) return track.albumArtUrl;
  if (track.album?.image) {
    const image = track.album.image.find(img => img.size === 'extralarge' || img.size === 'large');
    return image?.['#text'] || 'assests/fallback.png';
  }
  if (track.image) {
    const image = track.image.find(img => img.size === 'extralarge' || img.size === 'large');
    return image?.['#text'] || 'assests/fallback.png';
  }
  return 'assests/fallback.png';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function normalizeTrack(track, youtubeVideoId = null, albumArtUrl = null) {
  return {
    name: track.name,
    artist: track.artist?.name || track.artist,
    album: track.album?.title || track.album || '',
    duration: parseInt(track.duration) || 0,
    youtubeVideoId: youtubeVideoId || track.youtubeVideoId,
    albumArtUrl: albumArtUrl || getAlbumArt(track),
    playCount: track.playcount || track.listeners || 0,
  };
}
