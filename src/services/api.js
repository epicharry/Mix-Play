const LASTFM_API_KEY = import.meta.env.VITE_LAST_FM_API_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YT_API_KEY;

export const lastFmApi = {
  async searchTracks(query) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=20`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results?.trackmatches?.track || [];
  },

  async searchArtists(query) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results?.artistmatches?.artist || [];
  },

  async searchAlbums(query) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results?.albummatches?.album || [];
  },

  async getTrackInfo(artist, track) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&api_key=${LASTFM_API_KEY}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data.track;
  },

  async getAlbumInfo(artist, album) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getInfo&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&api_key=${LASTFM_API_KEY}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return data.album;
  },

  async getTopTracks() {
    const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${LASTFM_API_KEY}&format=json&limit=20`;
    const response = await fetch(url);
    const data = await response.json();
    return data.tracks?.track || [];
  },

  async getTopArtists() {
    const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${LASTFM_API_KEY}&format=json&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    return data.artists?.artist || [];
  },
};

export const youtubeApi = {
  async searchVideo(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items?.[0]?.id?.videoId || null;
  },

  async getChannelImage(artistName) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(artistName)}&type=channel&maxResults=1&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items?.[0]?.snippet?.thumbnails?.high?.url || null;
  },
};
