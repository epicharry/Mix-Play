import { lastFmApi, youtubeApi } from '../services/api.js';
import { playerService } from '../services/player.js';
import { normalizeTrack } from '../utils/helpers.js';

export class HomePage {
  constructor() {
    this.topTracks = [];
    this.topArtists = [];
    this.loading = true;
  }

  async init() {
    this.loading = true;
    try {
      [this.topTracks, this.topArtists] = await Promise.all([
        lastFmApi.getTopTracks(),
        lastFmApi.getTopArtists(),
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return `
        <div class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      `;
    }

    return `
      <div class="space-y-12">
        <section>
          <div class="mb-8">
            <h2 class="text-4xl font-bold mb-2">Welcome back</h2>
            <p class="text-white/60">Discover the most popular tracks worldwide</p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            ${this.topTracks.slice(0, 8).map(track => this.renderQuickPlayCard(track)).join('')}
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold">Trending Now</h2>
            <button class="text-white/60 hover:text-white transition-colors">See all</button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            ${this.topTracks.slice(8, 18).map(track => this.renderTrackCard(track)).join('')}
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold">Popular Artists</h2>
            <button class="text-white/60 hover:text-white transition-colors">See all</button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            ${this.topArtists.map(artist => this.renderArtistCard(artist)).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderQuickPlayCard(track) {
    return `
      <div class="glass glass-hover rounded-lg p-4 flex items-center gap-4 cursor-pointer group" data-track='${JSON.stringify(track)}'>
        <div class="w-16 h-16 rounded overflow-hidden flex-shrink-0">
          <img src="${track.image?.find(img => img.size === 'large')?.['#text'] || 'assests/fallback.png'}"
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
      </div>
    `;
  }

  renderTrackCard(track) {
    return `
      <div class="glass glass-hover rounded-lg p-4 cursor-pointer group transition-all hover:scale-105" data-track='${JSON.stringify(track)}'>
        <div class="relative mb-4">
          <div class="w-full aspect-square rounded-lg overflow-hidden">
            <img src="${track.image?.find(img => img.size === 'extralarge')?.['#text'] || 'assests/fallback.png'}"
                 alt="${track.name}"
                 class="w-full h-full object-cover">
          </div>
          <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            <div class="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center glow-accent shadow-xl">
              <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
        <p class="font-semibold truncate mb-1">${track.name}</p>
        <p class="text-sm text-white/60 truncate">${track.artist?.name || track.artist}</p>
      </div>
    `;
  }

  renderArtistCard(artist) {
    return `
      <div class="glass glass-hover rounded-lg p-4 cursor-pointer group transition-all hover:scale-105">
        <div class="relative mb-4">
          <div class="w-full aspect-square rounded-full overflow-hidden">
            <img src="${artist.image?.find(img => img.size === 'extralarge')?.['#text'] || 'assests/fallback.png'}"
                 alt="${artist.name}"
                 class="w-full h-full object-cover">
          </div>
        </div>
        <p class="font-semibold text-center truncate">${artist.name}</p>
        <p class="text-sm text-white/60 text-center">Artist</p>
      </div>
    `;
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

  attachEventListeners() {
    document.querySelectorAll('[data-track]').forEach(el => {
      el.addEventListener('click', async () => {
        const trackData = JSON.parse(el.dataset.track);
        await this.handleTrackClick(trackData);
      });
    });
  }
}
