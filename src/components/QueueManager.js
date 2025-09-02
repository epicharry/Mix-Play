export class QueueManager {
  constructor() {
    this.queue = [];
    this.currentIndex = -1;
    this.isShuffled = false;
    this.repeatMode = 'off'; // 'off', 'all', 'one'
    this.originalQueue = [];
    this.playerController = null;
    this.uiController = null;
    
    this.setupLikeButton();
  }

  async getPlayerController() {
    if (!this.playerController) {
      const { PlayerController } = await import('./PlayerController.js');
      this.playerController = new PlayerController();
    }
    return this.playerController;
  }

  async getUIController() {
    if (!this.uiController) {
      const { UIController } = await import('./UIController.js');
      this.uiController = new UIController();
    }
    return this.uiController;
  }

  addToQueue(track) {
    // Check if track already exists in queue
    const existingIndex = this.queue.findIndex(t => 
      t.name === track.name && t.artist === track.artist
    );

    if (existingIndex === -1) {
      this.queue.push(track);
      this.currentIndex = this.queue.length - 1;
    } else {
      this.currentIndex = existingIndex;
    }

    this.saveToStorage();
  }

  async playTrack(track) {
    const playerController = await this.getPlayerController();
    const uiController = await this.getUIController();
    
    await playerController.playTrack(track);
    uiController.addToRecentlyPlayed(track);
    
    // Update like button state
    const isLiked = uiController.checkIfTrackIsLiked(track);
    uiController.updateLikeButton(isLiked);
    
    this.saveToStorage();
  }

  async playNext() {
    if (this.queue.length === 0) return;

    if (this.repeatMode === 'one') {
      // Replay current track
      const currentTrack = this.queue[this.currentIndex];
      if (currentTrack) {
        await this.playTrack(currentTrack);
      }
      return;
    }

    let nextIndex = this.currentIndex + 1;

    if (nextIndex >= this.queue.length) {
      if (this.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return; // End of queue
      }
    }

    this.currentIndex = nextIndex;
    const nextTrack = this.queue[this.currentIndex];
    
    if (nextTrack) {
      await this.playTrack(nextTrack);
    }
  }

  async playPrevious() {
    if (this.queue.length === 0) return;

    let prevIndex = this.currentIndex - 1;

    if (prevIndex < 0) {
      if (this.repeatMode === 'all') {
        prevIndex = this.queue.length - 1;
      } else {
        return; // Beginning of queue
      }
    }

    this.currentIndex = prevIndex;
    const prevTrack = this.queue[this.currentIndex];
    
    if (prevTrack) {
      await this.playTrack(prevTrack);
    }
  }

  toggleShuffle() {
    const shuffleBtn = document.getElementById('shuffleBtn');
    
    if (!this.isShuffled) {
      // Enable shuffle
      this.originalQueue = [...this.queue];
      this.shuffleArray(this.queue);
      this.isShuffled = true;
      shuffleBtn.classList.add('active');
    } else {
      // Disable shuffle
      this.queue = [...this.originalQueue];
      this.isShuffled = false;
      shuffleBtn.classList.remove('active');
    }
    
    this.saveToStorage();
  }

  toggleRepeat() {
    const repeatBtn = document.getElementById('repeatBtn');
    
    switch (this.repeatMode) {
      case 'off':
        this.repeatMode = 'all';
        repeatBtn.classList.add('active');
        repeatBtn.style.color = 'var(--accent-green)';
        break;
      case 'all':
        this.repeatMode = 'one';
        repeatBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        `;
        break;
      case 'one':
        this.repeatMode = 'off';
        repeatBtn.classList.remove('active');
        repeatBtn.style.color = '';
        repeatBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg>
        `;
        break;
    }
    
    this.saveToStorage();
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  setupLikeButton() {
    const likeBtn = document.getElementById('likeBtn');
    likeBtn.addEventListener('click', async () => {
      const uiController = await this.getUIController();
      const currentTrack = this.getCurrentTrack();
      
      if (!currentTrack) return;
      
      const isLiked = uiController.checkIfTrackIsLiked(currentTrack);
      
      if (isLiked) {
        uiController.removeFromSavedTracks(currentTrack);
      } else {
        uiController.addToSavedTracks(currentTrack);
      }
    });
  }

  getCurrentTrack() {
    return this.queue[this.currentIndex] || null;
  }

  saveToStorage() {
    localStorage.setItem('musicQueue', JSON.stringify({
      queue: this.queue,
      currentIndex: this.currentIndex,
      isShuffled: this.isShuffled,
      repeatMode: this.repeatMode,
      originalQueue: this.originalQueue
    }));
  }

  loadFromStorage() {
    const saved = localStorage.getItem('musicQueue');
    if (saved) {
      const data = JSON.parse(saved);
      this.queue = data.queue || [];
      this.currentIndex = data.currentIndex || -1;
      this.isShuffled = data.isShuffled || false;
      this.repeatMode = data.repeatMode || 'off';
      this.originalQueue = data.originalQueue || [];
      
      // Update UI states
      this.updateUIStates();
    }
  }

  updateUIStates() {
    // Update shuffle button
    const shuffleBtn = document.getElementById('shuffleBtn');
    if (this.isShuffled) {
      shuffleBtn.classList.add('active');
    }

    // Update repeat button
    const repeatBtn = document.getElementById('repeatBtn');
    if (this.repeatMode !== 'off') {
      repeatBtn.classList.add('active');
      repeatBtn.style.color = 'var(--accent-green)';
      
      if (this.repeatMode === 'one') {
        repeatBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        `;
      }
    }

    // Update current track info if there's a current track
    const currentTrack = this.getCurrentTrack();
    if (currentTrack) {
      document.getElementById('currentTrackName').textContent = currentTrack.name;
      document.getElementById('currentTrackArtist').textContent = currentTrack.artist;
    }
  }
}