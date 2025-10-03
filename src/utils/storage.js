export const storage = {
  saveQueue(queue, currentIndex) {
    localStorage.setItem('musicQueue', JSON.stringify(queue));
    localStorage.setItem('currentTrackIndex', currentIndex.toString());
  },

  loadQueue() {
    const queue = localStorage.getItem('musicQueue');
    const index = localStorage.getItem('currentTrackIndex');
    return {
      queue: queue ? JSON.parse(queue) : [],
      currentIndex: index ? parseInt(index) : -1,
    };
  },

  saveLikedSongs(likedSongs) {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  },

  loadLikedSongs() {
    const liked = localStorage.getItem('likedSongs');
    return liked ? JSON.parse(liked) : [];
  },

  savePlaylists(playlists) {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  },

  loadPlaylists() {
    const playlists = localStorage.getItem('playlists');
    return playlists ? JSON.parse(playlists) : [];
  },

  saveListeningHistory(history) {
    localStorage.setItem('listeningHistory', JSON.stringify(history));
  },

  loadListeningHistory() {
    const history = localStorage.getItem('listeningHistory');
    return history ? JSON.parse(history) : [];
  },

  addToHistory(track) {
    const history = this.loadListeningHistory();
    const entry = {
      ...track,
      playedAt: new Date().toISOString(),
    };
    history.unshift(entry);
    if (history.length > 100) {
      history.pop();
    }
    this.saveListeningHistory(history);
  },
};
