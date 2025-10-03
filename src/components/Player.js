import { playerService } from '../services/player.js';
import { formatDuration } from '../utils/helpers.js';

export class Player {
  constructor() {
    this.state = {
      currentTrack: null,
      isPlaying: false,
      progress: { current: 0, duration: 0, percentage: 0 },
      volume: 100,
      isExpanded: false,
    };

    this.unsubscribe = playerService.subscribe(this.handlePlayerUpdate.bind(this));
  }

  handlePlayerUpdate(playerState) {
    this.state = { ...this.state, ...playerState };
    this.updateUI();
  }

  render() {
    return `
      <div class="fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-30 backdrop-blur-3xl">
        <div class="container mx-auto px-6 py-4">
          ${this.renderPlayerBar()}
        </div>
      </div>

      <div id="now-playing-modal" class="fixed inset-0 bg-black/95 backdrop-blur-3xl z-40 ${this.state.isExpanded ? '' : 'hidden'} animate-slide-up">
        ${this.renderNowPlaying()}
      </div>
    `;
  }

  renderPlayerBar() {
    const { currentTrack, isPlaying, progress } = this.state;

    if (!currentTrack) {
      return `
        <div class="flex items-center justify-center text-white/50">
          <p>No track playing</p>
        </div>
      `;
    }

    return `
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-14 h-14 rounded-lg overflow-hidden glass cursor-pointer" id="expand-player">
            <img src="${currentTrack.albumArtUrl}" alt="${currentTrack.name}" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-white truncate">${currentTrack.name}</p>
            <p class="text-sm text-white/60 truncate">${currentTrack.artist}</p>
          </div>
          <button id="like-button" class="p-2 glass-hover rounded-full transition-all hover:scale-110">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>

        <div class="flex-1 flex flex-col items-center gap-2 max-w-2xl">
          <div class="flex items-center gap-4">
            <button id="shuffle-btn" class="p-2 glass-hover rounded-full transition-all hover:scale-110">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
            <button id="prev-btn" class="p-2 glass-hover rounded-full transition-all hover:scale-110">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
              </svg>
            </button>
            <button id="play-pause-btn" class="p-4 bg-white text-black rounded-full transition-all hover:scale-110 glow-accent">
              ${isPlaying ? `
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              ` : `
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
              `}
            </button>
            <button id="next-btn" class="p-2 glass-hover rounded-full transition-all hover:scale-110">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
              </svg>
            </button>
            <button id="repeat-btn" class="p-2 glass-hover rounded-full transition-all hover:scale-110">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>

          <div class="w-full flex items-center gap-2">
            <span class="text-xs text-white/60 min-w-[40px]">${formatDuration(progress.current)}</span>
            <div class="flex-1 h-1 glass rounded-full overflow-hidden cursor-pointer" id="progress-bar">
              <div class="h-full bg-accent-primary transition-all" style="width: ${progress.percentage}%" id="progress-fill"></div>
            </div>
            <span class="text-xs text-white/60 min-w-[40px]">${formatDuration(progress.duration)}</span>
          </div>
        </div>

        <div class="flex items-center gap-4 flex-1 justify-end">
          <button class="p-2 glass-hover rounded-full transition-all hover:scale-110">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"/>
            </svg>
            <input type="range" min="0" max="100" value="${this.state.volume}" class="w-24 h-1" id="volume-slider">
          </div>
        </div>
      </div>
    `;
  }

  renderNowPlaying() {
    const { currentTrack, isPlaying, progress } = this.state;

    if (!currentTrack) return '';

    return `
      <div class="gradient-mesh h-full flex flex-col">
        <div class="p-6">
          <button id="close-now-playing" class="p-2 glass-hover rounded-full transition-all hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div class="relative group">
            <img
              src="${currentTrack.albumArtUrl}"
              alt="${currentTrack.name}"
              class="w-96 h-96 rounded-2xl shadow-2xl object-cover animate-float"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div class="mt-12 text-center max-w-2xl">
            <h1 class="text-5xl font-bold mb-4">${currentTrack.name}</h1>
            <p class="text-2xl text-white/60 mb-2">${currentTrack.artist}</p>
            ${currentTrack.album ? `<p class="text-xl text-white/40">${currentTrack.album}</p>` : ''}
          </div>

          <div class="mt-12 w-full max-w-4xl">
            <div class="w-full flex items-center gap-4 mb-6">
              <span class="text-sm text-white/60 min-w-[50px]">${formatDuration(progress.current)}</span>
              <div class="flex-1 h-2 glass rounded-full overflow-hidden cursor-pointer" id="progress-bar-expanded">
                <div class="h-full bg-accent-primary transition-all" style="width: ${progress.percentage}%"></div>
              </div>
              <span class="text-sm text-white/60 min-w-[50px]">${formatDuration(progress.duration)}</span>
            </div>

            <div class="flex items-center justify-center gap-8">
              <button class="p-3 glass-hover rounded-full transition-all hover:scale-110">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
              <button id="prev-btn-expanded" class="p-3 glass-hover rounded-full transition-all hover:scale-110">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
                </svg>
              </button>
              <button id="play-pause-btn-expanded" class="p-6 bg-white text-black rounded-full transition-all hover:scale-110 glow-accent">
                ${isPlaying ? `
                  <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                ` : `
                  <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                  </svg>
                `}
              </button>
              <button id="next-btn-expanded" class="p-3 glass-hover rounded-full transition-all hover:scale-110">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
                </svg>
              </button>
              <button class="p-3 glass-hover rounded-full transition-all hover:scale-110">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateUI() {
    const container = document.getElementById('player-container');
    if (container) {
      container.innerHTML = this.render();
      this.attachEventListeners();
    }
  }

  attachEventListeners() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseBtnExpanded = document.getElementById('play-pause-btn-expanded');
    const prevBtn = document.getElementById('prev-btn');
    const prevBtnExpanded = document.getElementById('prev-btn-expanded');
    const nextBtn = document.getElementById('next-btn');
    const nextBtnExpanded = document.getElementById('next-btn-expanded');
    const expandPlayer = document.getElementById('expand-player');
    const closeNowPlaying = document.getElementById('close-now-playing');
    const progressBar = document.getElementById('progress-bar');
    const progressBarExpanded = document.getElementById('progress-bar-expanded');

    playPauseBtn?.addEventListener('click', () => playerService.togglePlay());
    playPauseBtnExpanded?.addEventListener('click', () => playerService.togglePlay());
    prevBtn?.addEventListener('click', () => playerService.previous());
    prevBtnExpanded?.addEventListener('click', () => playerService.previous());
    nextBtn?.addEventListener('click', () => playerService.next());
    nextBtnExpanded?.addEventListener('click', () => playerService.next());

    expandPlayer?.addEventListener('click', () => {
      this.state.isExpanded = true;
      this.updateUI();
    });

    closeNowPlaying?.addEventListener('click', () => {
      this.state.isExpanded = false;
      this.updateUI();
    });

    const handleProgressClick = (e, element) => {
      const rect = element.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      playerService.seek(percent);
    };

    progressBar?.addEventListener('click', (e) => handleProgressClick(e, progressBar));
    progressBarExpanded?.addEventListener('click', (e) => handleProgressClick(e, progressBarExpanded));
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
