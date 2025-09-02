// Last.fm API configuration
const LASTFM_API_KEY = 'YOUR_LASTFM_API_KEY'; // Replace with your actual API key
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export class LastFMAPI {
  static async request(params) {
    const url = new URL(LASTFM_BASE_URL);
    
    // Add default parameters
    url.searchParams.append('api_key', LASTFM_API_KEY);
    url.searchParams.append('format', 'json');
    
    // Add custom parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Last.fm API error:', error);
      throw error;
    }
  }

  static async searchTracks(query, limit = 20) {
    return this.request({
      method: 'track.search',
      track: query,
      limit: limit
    });
  }

  static async searchArtists(query, limit = 20) {
    return this.request({
      method: 'artist.search',
      artist: query,
      limit: limit
    });
  }

  static async searchAlbums(query, limit = 20) {
    return this.request({
      method: 'album.search',
      album: query,
      limit: limit
    });
  }

  static async getTrackInfo(artist, track) {
    return this.request({
      method: 'track.getInfo',
      artist: artist,
      track: track
    });
  }

  static async getAlbumInfo(artist, album) {
    return this.request({
      method: 'album.getInfo',
      artist: artist,
      album: album
    });
  }

  static async getArtistInfo(artist) {
    return this.request({
      method: 'artist.getInfo',
      artist: artist
    });
  }

  static async getArtistTopTracks(artist, limit = 10) {
    return this.request({
      method: 'artist.getTopTracks',
      artist: artist,
      limit: limit
    });
  }

  static async getArtistTopAlbums(artist, limit = 10) {
    return this.request({
      method: 'artist.getTopAlbums',
      artist: artist,
      limit: limit
    });
  }
}