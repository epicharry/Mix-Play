export class UIController {
  constructor() {
    this.currentView = 'home';
    this.setupMobileMenu();
  }

  switchView(viewName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Update content views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
      targetView.classList.add('active');
      this.currentView = viewName;
    }

    // Clear search input if not on search view
    if (viewName !== 'search') {
      document.getElementById('searchInput').value = '';
    }

    // Load view-specific content
    this.loadViewContent(viewName);
  }

  loadViewContent(viewName) {
    switch (viewName) {
      case 'home':
        this.loadHomeContent();
        break;
      case 'search':
        // Search content is loaded by SearchController
        break;
      case 'library':
        this.loadLibraryContent();
        break;
    }
  }

  loadHomeContent() {
    const recentlyPlayedContainer = document.getElementById('recentlyPlayed');
    
    // Load recently played from localStorage
    const recentTracks = this.getRecentlyPlayed();
    
    if (recentTracks.length === 0) {
      recentlyPlayedContainer.innerHTML = `
        <div class="empty-state">
          <p>Start listening to see your recently played tracks here.</p>
        </div>
      `;
      return;
    }

    recentlyPlayedContainer.innerHTML = recentTracks.map(track => `
      <div class="track-card" data-track='${JSON.stringify(track)}'>
        <img src="${track.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'}" alt="${track.name}">
        <h3>${track.name}</h3>
        <p>${track.artist}</p>
      </div>
    `).join('');

    // Add click listeners
    recentlyPlayedContainer.querySelectorAll('.track-card').forEach(card => {
      card.addEventListener('click', () => {
        const trackData = JSON.parse(card.dataset.track);
        this.playTrackFromHome(trackData);
      });
    });
  }

  loadLibraryContent() {
    const libraryView = document.getElementById('libraryView');
    const savedTracks = this.getSavedTracks();
    
    if (savedTracks.length === 0) {
      libraryView.innerHTML = `
        <h1>Your Library</h1>
        <div class="empty-state">
          <p>Your saved tracks and playlists will appear here.</p>
          <p>Start exploring music to build your library!</p>
        </div>
      `;
      return;
    }

    libraryView.innerHTML = `
      <h1>Your Library</h1>
      <div class="library-content">
        <div class="search-list">
          ${savedTracks.map(track => `
            <div class="search-item" data-track='${JSON.stringify(track)}'>
              <img src="${track.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'}" alt="${track.name}">
              <div class="search-item-info">
                <div class="search-item-title">${track.name}</div>
                <div class="search-item-subtitle">${track.artist}</div>
              </div>
              <button class="control-btn play-button-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add click listeners
    libraryView.querySelectorAll('.search-item').forEach(item => {
      item.addEventListener('click', () => {
        const trackData = JSON.parse(item.dataset.track);
        this.playTrackFromLibrary(trackData);
      });
    });
  }

  async playTrackFromHome(track) {
    const { QueueManager } = await import('./QueueManager.js');
    const queueManager = new QueueManager();
    queueManager.addToQueue(track);
    queueManager.playTrack(track);
  }

  async playTrackFromLibrary(track) {
    const { QueueManager } = await import('./QueueManager.js');
    const queueManager = new QueueManager();
    queueManager.addToQueue(track);
    queueManager.playTrack(track);
  }

  setupMobileMenu() {
    // Add mobile menu toggle functionality if needed
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile-specific UI adjustments
      this.setupMobileNavigation();
    }
  }

  setupMobileNavigation() {
    // This could be expanded for mobile hamburger menu
    console.log('Mobile navigation setup');
  }

  addToRecentlyPlayed(track) {
    let recentTracks = this.getRecentlyPlayed();
    
    // Remove if already exists
    recentTracks = recentTracks.filter(t => 
      !(t.name === track.name && t.artist === track.artist)
    );
    
    // Add to beginning
    recentTracks.unshift(track);
    
    // Keep only last 20 tracks
    recentTracks = recentTracks.slice(0, 20);
    
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentTracks));
    
    // Refresh home view if currently active
    if (this.currentView === 'home') {
      this.loadHomeContent();
    }
  }

  getRecentlyPlayed() {
    const saved = localStorage.getItem('recentlyPlayed');
    return saved ? JSON.parse(saved) : [];
  }

  addToSavedTracks(track) {
    let savedTracks = this.getSavedTracks();
    
    // Check if already saved
    const exists = savedTracks.some(t => 
      t.name === track.name && t.artist === track.artist
    );
    
    if (!exists) {
      savedTracks.push(track);
      localStorage.setItem('savedTracks', JSON.stringify(savedTracks));
      
      // Update like button state
      this.updateLikeButton(true);
      
      // Refresh library view if currently active
      if (this.currentView === 'library') {
        this.loadLibraryContent();
      }
    }
  }

  removeFromSavedTracks(track) {
    let savedTracks = this.getSavedTracks();
    savedTracks = savedTracks.filter(t => 
      !(t.name === track.name && t.artist === track.artist)
    );
    
    localStorage.setItem('savedTracks', JSON.stringify(savedTracks));
    this.updateLikeButton(false);
    
    // Refresh library view if currently active
    if (this.currentView === 'library') {
      this.loadLibraryContent();
    }
  }

  getSavedTracks() {
    const saved = localStorage.getItem('savedTracks');
    return saved ? JSON.parse(saved) : [];
  }

  updateLikeButton(isLiked) {
    const likeBtn = document.getElementById('likeBtn');
    if (isLiked) {
      likeBtn.style.color = var('--accent-green');
      likeBtn.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
      likeBtn.style.color = var('--text-secondary');
      likeBtn.querySelector('svg').setAttribute('fill', 'none');
    }
  }

  checkIfTrackIsLiked(track) {
    const savedTracks = this.getSavedTracks();
    return savedTracks.some(t => 
      t.name === track.name && t.artist === track.artist
    );
  }
}