import { lastFmApi, youtubeApi } from '../services/api.js';
import { playerService } from '../services/player.js';
import { normalizeTrack, debounce } from '../utils/helpers.js';

export class SearchPage {
  constructor() {
    this.searchResults = {
      tracks: [],
      artists: [],
      albums: [],
    };
    this.searching = false;
    this.searchQuery = '';
    this.debouncedSearch = debounce(this.performSearch.bind(this), 500);
  }

  render() {
    return `
      <div class="space-y-8">
        <div class="sticky top-0 z-10 pb-6 bg-gradient-to-b from-black to-transparent">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              id="search-input"
              placeholder="Search for songs, artists, or albums..."
              class="w-full pl-14 pr-6 py-4 glass border-2 border-white/10 rounded-full text-lg focus:outline-none focus:border-accent-primary transition-all"
              value="${this.searchQuery}"
            >
          </div>
        </div>

        ${this.searching ? this.renderLoading() : this.renderResults()}
      </div>
    `;
  }

  renderLoading() {
    return `
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
      </div>
    `;
  }

  renderResults() {
    if (!this.searchQuery) {
      return `
        <div class="text-center py-20">
          <svg class="w-24 h-24 mx-auto mb-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <h2 class="text-2xl font-bold mb-2">Search for music</h2>
          <p class="text-white/60">Find your favorite songs, artists, and albums</p>
        </div>
      `;
    }

    const { tracks, artists, albums } = this.searchResults;
    const hasResults = tracks.length > 0 || artists.length > 0 || albums.length > 0;

    if (!hasResults) {
      return `
        <div class="text-center py-20">
          <h2 class="text-2xl font-bold mb-2">No results found</h2>
          <p class="text-white/60">Try searching for something else</p>
        </div>
      `;
    }

    return `
      ${tracks.length > 0 ? `
        <section>
          <h2 class="text-2xl font-bold mb-6">Songs</h2>
          <div class="space-y-2">
            ${tracks.slice(0, 10).map((track, index) => this.renderTrackRow(track, index)).join('')}
          </div>
        </section>
      ` : ''}

      ${artists.length > 0 ? `
        <section>
          <h2 class="text-2xl font-bold mb-6">Artists</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            ${artists.map(artist => this.renderArtistCard(artist)).join('')}
          </div>
        </section>
      ` : ''}

      ${albums.length > 0 ? `
        <section>
          <h2 class="text-2xl font-bold mb-6">Albums</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            ${albums.map(album => this.renderAlbumCard(album)).join('')}
          </div>
        </section>
      ` : ''}
    `;
  }

  renderTrackRow(track, index) {
    return `
      <div class="glass glass-hover rounded-lg p-4 flex items-center gap-4 cursor-pointer group" data-track='${JSON.stringify(track)}'>
        <span class="text-white/40 w-6 text-center">${index + 1}</span>
        <div class="w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <img src="${track.image?.find(img => img.size === 'medium')?.['#text'] || 'assests/fallback.png'}"
               alt="${track.name}"
               class="w-full h-full object-cover">
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold truncate">${track.name}</p>
          <p class="text-sm text-white/60 truncate">${track.artist?.name || track.artist}</p>
        </div>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center glow-accent">
            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <button class="p-2 glass-hover rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110" data-action="like">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
    `;
  }

  renderArtistCard(artist) {
    return `
      <div class="glass glass-hover rounded-lg p-4 cursor-pointer group transition-all hover:scale-105">
        <div class="w-full aspect-square rounded-full overflow-hidden mb-4">
          <img src="${artist.image?.find(img => img.size === 'extralarge')?.['#text'] || 'assests/fallback.png'}"
               alt="${artist.name}"
               class="w-full h-full object-cover">
        </div>
        <p class="font-semibold text-center truncate">${artist.name}</p>
        <p class="text-sm text-white/60 text-center">Artist</p>
      </div>
    `;
  }

  renderAlbumCard(album) {
    return `
      <div class="glass glass-hover rounded-lg p-4 cursor-pointer group transition-all hover:scale-105" data-album='${JSON.stringify(album)}'>
        <div class="relative mb-4">
          <div class="w-full aspect-square rounded-lg overflow-hidden">
            <img src="${album.image?.find(img => img.size === 'extralarge')?.['#text'] || 'assests/fallback.png'}"
                 alt="${album.name}"
                 class="w-full h-full object-cover">
          </div>
        </div>
        <p class="font-semibold truncate mb-1">${album.name}</p>
        <p class="text-sm text-white/60 truncate">${album.artist}</p>
      </div>
    `;
  }

  async performSearch(query) {
    if (!query.trim()) {
      this.searchResults = { tracks: [], artists: [], albums: [] };
      return;
    }

    this.searching = true;
    this.updateUI();

    try {
      const [tracks, artists, albums] = await Promise.all([
        lastFmApi.searchTracks(query),
        lastFmApi.searchArtists(query),
        lastFmApi.searchAlbums(query),
      ]);

      this.searchResults = {
        tracks: Array.isArray(tracks) ? tracks : [],
        artists: Array.isArray(artists) ? artists : [],
        albums: Array.isArray(albums) ? albums : [],
      };
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults = { tracks: [], artists: [], albums: [] };
    } finally {
      this.searching = false;
      this.updateUI();
    }
  }

  async handleTrackClick(trackData) {
    try {
      const videoId = await youtubeApi.searchVideo(`${trackData.name} ${trackData.artist?.name || trackData.artist}`);
      const track = normalizeTrack(trackData, videoId);
      playerService.addToQueue(track);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  updateUI() {
    const container = document.getElementById('page-content');
    if (container) {
      container.innerHTML = this.render();
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.debouncedSearch(e.target.value);
      });
    }

    document.querySelectorAll('[data-track]').forEach(el => {
      el.addEventListener('click', async (e) => {
        if (e.target.closest('[data-action="like"]')) return;
        const trackData = JSON.parse(el.dataset.track);
        await this.handleTrackClick(trackData);
      });
    });
  }
}
