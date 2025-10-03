import './styles/main.css';
import { Sidebar } from './components/Sidebar.js';
import { Player } from './components/Player.js';
import { HomePage } from './pages/Home.js';
import { SearchPage } from './pages/Search.js';
import { LibraryPage } from './pages/Library.js';

class App {
  constructor() {
    this.currentPage = 'home';
    this.sidebar = new Sidebar(this.navigate.bind(this));
    this.player = new Player();
    this.pages = {
      home: new HomePage(),
      search: new SearchPage(),
      library: new LibraryPage(),
    };

    this.init();
  }

  async init() {
    this.renderLayout();
    await this.navigate('home');
  }

  renderLayout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="gradient-mesh min-h-screen">
        ${this.sidebar.render()}

        <main class="ml-64 h-screen flex flex-col">
          <div id="page-content" class="flex-1 overflow-y-auto p-8 pb-32">
            <div class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
            </div>
          </div>
        </main>

        <div id="player-container"></div>

        <div id="youtube-player"></div>
      </div>
    `;

    this.sidebar.attachEventListeners();
    this.player.updateUI();

    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    createPlaylistBtn?.addEventListener('click', () => {
      this.navigate('library');
      setTimeout(() => {
        this.pages.library.showCreatePlaylistModal();
      }, 100);
    });
  }

  async navigate(page) {
    this.currentPage = page;
    this.sidebar.setCurrentPage(page);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="gradient-mesh min-h-screen">
        ${this.sidebar.render()}

        <main class="ml-64 h-screen flex flex-col">
          <div id="page-content" class="flex-1 overflow-y-auto p-8 pb-32">
            <div class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
            </div>
          </div>
        </main>

        <div id="player-container"></div>

        <div id="youtube-player"></div>
      </div>
    `;

    this.sidebar.attachEventListeners();
    this.player.updateUI();

    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    createPlaylistBtn?.addEventListener('click', () => {
      this.navigate('library');
      setTimeout(() => {
        this.pages.library.showCreatePlaylistModal();
      }, 100);
    });

    const pageInstance = this.pages[page];

    if (pageInstance.init) {
      await pageInstance.init();
    }

    const pageContent = document.getElementById('page-content');
    if (pageContent && pageInstance) {
      pageContent.innerHTML = pageInstance.render();
      if (pageInstance.attachEventListeners) {
        pageInstance.attachEventListeners();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
