import { storage } from '../utils/storage.js';
import { playerService } from '../services/player.js';
import { generateId } from '../utils/helpers.js';

export class LibraryPage {
  constructor() {
    this.likedSongs = storage.loadLikedSongs();
    this.playlists = storage.loadPlaylists();
    this.currentView = 'overview';
    this.selectedPlaylist = null;
  }

  render() {
    if (this.currentView === 'playlist' && this.selectedPlaylist) {
      return this.renderPlaylistView();
    }

    return `
      <div class="space-y-8">
        <section>
          <h2 class="text-4xl font-bold mb-6">Your Library</h2>

          <div class="glass glass-hover rounded-lg p-6 cursor-pointer group transition-all hover:scale-[1.02] mb-6" id="liked-songs-card">
            <div class="flex items-center gap-6">
              <div class="w-24 h-24 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center glow-accent">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold mb-1">Liked Songs</h3>
                <p class="text-white/60">${this.likedSongs.length} songs</p>
              </div>
              <svg class="w-8 h-8 text-white/40 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">Playlists</h2>
            <button id="create-playlist-btn-main" class="glass-hover px-6 py-3 rounded-full flex items-center gap-2 transition-all hover:scale-105">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Create Playlist</span>
            </button>
          </div>

          ${this.playlists.length === 0 ? `
            <div class="glass rounded-lg p-12 text-center">
              <svg class="w-24 h-24 mx-auto mb-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
              <h3 class="text-xl font-semibold mb-2">No playlists yet</h3>
              <p class="text-white/60 mb-6">Create your first playlist to organize your music</p>
              <button id="create-first-playlist" class="bg-accent-primary text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all glow-accent">
                Create Playlist
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              ${this.playlists.map(playlist => this.renderPlaylistCard(playlist)).join('')}
            </div>
          `}
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-6">Recently Played</h2>
          <div class="space-y-2">
            ${this.renderRecentlyPlayed()}
          </div>
        </section>
      </div>

      <div id="create-playlist-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center">
        <div class="glass rounded-2xl p-8 max-w-md w-full m-4 animate-slide-up">
          <h2 class="text-2xl font-bold mb-6">Create Playlist</h2>
          <form id="create-playlist-form">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Playlist Name</label>
                <input
                  type="text"
                  id="playlist-name-input"
                  placeholder="My Awesome Playlist"
                  class="w-full px-4 py-3 glass border border-white/10 rounded-lg focus:outline-none focus:border-accent-primary transition-all"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Description (optional)</label>
                <textarea
                  id="playlist-description-input"
                  placeholder="Add a description..."
                  rows="3"
                  class="w-full px-4 py-3 glass border border-white/10 rounded-lg focus:outline-none focus:border-accent-primary transition-all resize-none"
                ></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="button" id="cancel-create-playlist" class="flex-1 px-6 py-3 glass-hover rounded-lg transition-all">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-6 py-3 bg-accent-primary text-black rounded-lg font-semibold hover:scale-105 transition-all glow-accent">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  renderPlaylistCard(playlist) {
    return `
      <div class="glass glass-hover rounded-lg p-4 cursor-pointer group transition-all hover:scale-105" data-playlist-id="${playlist.id}">
        <div class="w-full aspect-square rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center mb-4">
          <svg class="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        </div>
        <p class="font-semibold truncate mb-1">${playlist.name}</p>
        <p class="text-sm text-white/60 truncate">${playlist.tracks?.length || 0} songs</p>
      </div>
    `;
  }

  renderRecentlyPlayed() {
    const history = storage.loadListeningHistory().slice(0, 10);

    if (history.length === 0) {
      return `
        <div class="glass rounded-lg p-8 text-center text-white/60">
          <p>No recently played tracks</p>
        </div>
      `;
    }

    return history.map((track, index) => `
      <div class="glass glass-hover rounded-lg p-4 flex items-center gap-4 cursor-pointer group" data-track='${JSON.stringify(track)}'>
        <span class="text-white/40 w-6 text-center">${index + 1}</span>
        <div class="w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <img src="${track.albumArtUrl || 'assests/fallback.png'}"
               alt="${track.name}"
               class="w-full h-full object-cover">
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold truncate">${track.name}</p>
          <p class="text-sm text-white/60 truncate">${track.artist}</p>
        </div>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center glow-accent">
            <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderPlaylistView() {
    const playlist = this.playlists.find(p => p.id === this.selectedPlaylist);
    if (!playlist) return this.render();

    return `
      <div class="space-y-8">
        <button id="back-to-library" class="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Back to Library</span>
        </button>

        <div class="flex items-end gap-8">
          <div class="w-52 h-52 rounded-lg bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 flex items-center justify-center">
            <svg class="w-24 h-24 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold mb-2">PLAYLIST</p>
            <h1 class="text-6xl font-bold mb-4">${playlist.name}</h1>
            ${playlist.description ? `<p class="text-white/60 mb-4">${playlist.description}</p>` : ''}
            <p class="text-white/60">${playlist.tracks?.length || 0} songs</p>
          </div>
        </div>

        ${playlist.tracks && playlist.tracks.length > 0 ? `
          <div class="space-y-2">
            ${playlist.tracks.map((track, index) => `
              <div class="glass glass-hover rounded-lg p-4 flex items-center gap-4 cursor-pointer group" data-track='${JSON.stringify(track)}'>
                <span class="text-white/40 w-6 text-center">${index + 1}</span>
                <div class="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img src="${track.albumArtUrl || 'assests/fallback.png'}"
                       alt="${track.name}"
                       class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold truncate">${track.name}</p>
                  <p class="text-sm text-white/60 truncate">${track.artist}</p>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center glow-accent">
                    <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="glass rounded-lg p-12 text-center">
            <p class="text-white/60">This playlist is empty. Add some songs to get started!</p>
          </div>
        `}
      </div>
    `;
  }

  showCreatePlaylistModal() {
    const modal = document.getElementById('create-playlist-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  hideCreatePlaylistModal() {
    const modal = document.getElementById('create-playlist-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  createPlaylist(name, description) {
    const newPlaylist = {
      id: generateId(),
      name,
      description,
      tracks: [],
      createdAt: new Date().toISOString(),
    };

    this.playlists.push(newPlaylist);
    storage.savePlaylists(this.playlists);
    this.hideCreatePlaylistModal();
    this.updateUI();
  }

  viewPlaylist(playlistId) {
    this.selectedPlaylist = playlistId;
    this.currentView = 'playlist';
    this.updateUI();
  }

  backToOverview() {
    this.currentView = 'overview';
    this.selectedPlaylist = null;
    this.updateUI();
  }

  updateUI() {
    const container = document.getElementById('page-content');
    if (container) {
      container.innerHTML = this.render();
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    const createPlaylistBtns = [
      document.getElementById('create-playlist-btn-main'),
      document.getElementById('create-first-playlist'),
    ];

    createPlaylistBtns.forEach(btn => {
      btn?.addEventListener('click', () => this.showCreatePlaylistModal());
    });

    document.getElementById('cancel-create-playlist')?.addEventListener('click', () => {
      this.hideCreatePlaylistModal();
    });

    document.getElementById('create-playlist-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'create-playlist-modal') {
        this.hideCreatePlaylistModal();
      }
    });

    document.getElementById('create-playlist-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('playlist-name-input').value;
      const description = document.getElementById('playlist-description-input').value;
      this.createPlaylist(name, description);
    });

    document.querySelectorAll('[data-playlist-id]').forEach(el => {
      el.addEventListener('click', () => {
        const playlistId = el.dataset.playlistId;
        this.viewPlaylist(playlistId);
      });
    });

    document.getElementById('back-to-library')?.addEventListener('click', () => {
      this.backToOverview();
    });

    document.querySelectorAll('[data-track]').forEach(el => {
      el.addEventListener('click', () => {
        const track = JSON.parse(el.dataset.track);
        playerService.addToQueue(track);
      });
    });
  }
}
