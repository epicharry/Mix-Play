import { PlayerController } from './components/PlayerController.js';
import { SearchController } from './components/SearchController.js';
import { UIController } from './components/UIController.js';
import { QueueManager } from './components/QueueManager.js';

class SpotifyApp {
  constructor() {
    this.playerController = new PlayerController();
    this.searchController = new SearchController();
    this.uiController = new UIController();
    this.queueManager = new QueueManager();
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadSavedQueue();
    this.setupYouTubeAPI();
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        this.uiController.switchView(e.target.closest('.nav-item').dataset.view);
      });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      if (e.target.value.trim()) {
        this.uiController.switchView('search');
        this.searchController.performSearch(e.target.value.trim());
      }
    });

    // Player controls
    document.getElementById('playBtn').addEventListener('click', () => {
      this.playerController.togglePlayPause();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
      this.queueManager.playNext();
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
      this.queueManager.playPrevious();
    });

    document.getElementById('shuffleBtn').addEventListener('click', () => {
      this.queueManager.toggleShuffle();
    });

    document.getElementById('repeatBtn').addEventListener('click', () => {
      this.queueManager.toggleRepeat();
    });

    // Volume control
    const volumeSlider = document.getElementById('volumeSlider');
    volumeSlider.addEventListener('input', (e) => {
      this.playerController.setVolume(e.target.value);
    });

    // Progress bar
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.addEventListener('click', (e) => {
      this.playerController.seekTo(e);
    });
  }

  setupYouTubeAPI() {
    window.onYouTubeIframeAPIReady = () => {
      this.playerController.initializeYouTubePlayer();
    };
  }

  loadSavedQueue() {
    this.queueManager.loadFromStorage();
  }
}

// Initialize the app
new SpotifyApp();