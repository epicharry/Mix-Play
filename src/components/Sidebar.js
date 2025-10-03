export class Sidebar {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.currentPage = 'home';
  }

  render() {
    return `
      <aside class="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 p-6 flex flex-col z-10">
        <div class="mb-8">
          <h1 class="text-3xl font-bold neon-glow mb-1">Streamify</h1>
          <p class="text-sm text-white/50">Premium Music</p>
        </div>

        <nav class="flex-1 space-y-2">
          ${this.renderNavItem('home', `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          `, 'Home')}

          ${this.renderNavItem('search', `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          `, 'Search')}

          ${this.renderNavItem('library', `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          `, 'Your Library')}
        </nav>

        <div class="mt-auto">
          <button id="create-playlist-btn" class="w-full glass-hover rounded-lg px-4 py-3 text-left flex items-center gap-3 transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>Create Playlist</span>
          </button>

          <div class="mt-4 glass-hover rounded-lg p-4 transition-all">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full glass flex items-center justify-center text-lg font-bold glow-accent">
                U
              </div>
              <div class="flex-1">
                <p class="font-semibold text-sm">Music Lover</p>
                <p class="text-xs text-white/50">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    `;
  }

  renderNavItem(page, icon, label) {
    const isActive = this.currentPage === page;
    return `
      <button
        data-page="${page}"
        class="nav-item w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? 'bg-accent-primary text-white glow-accent'
            : 'glass-hover text-white/70 hover:text-white'
        }"
      >
        ${icon}
        <span class="font-semibold">${label}</span>
      </button>
    `;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  attachEventListeners() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        this.onNavigate(page);
      });
    });
  }
}
