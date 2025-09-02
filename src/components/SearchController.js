export class SearchController {
  constructor() {
    this.searchResults = {
      tracks: [],
      artists: [],
      albums: []
    };
  }

  async performSearch(query) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '<div class="loading">Searching...</div>';

    try {
      const [trackData, artistData, albumData] = await Promise.all([
        this.searchTracks(query),
        this.searchArtists(query),
        this.searchAlbums(query)
      ]);

      this.searchResults = {
        tracks: trackData.results?.trackmatches?.track || [],
        artists: artistData.results?.artistmatches?.artist || [],
        albums: albumData.results?.albummatches?.album || []
      };

      this.renderSearchResults();
    } catch (error) {
      console.error('Search error:', error);
      searchResultsContainer.innerHTML = '<div class="loading">Error searching. Please try again.</div>';
    }
  }

  async searchTracks(query) {
    const response = await fetch(`/api/lastfm?method=track.search&track=${encodeURIComponent(query)}`);
    return response.json();
  }

  async searchArtists(query) {
    const response = await fetch(`/api/lastfm?method=artist.search&artist=${encodeURIComponent(query)}`);
    return response.json();
  }

  async searchAlbums(query) {
    const response = await fetch(`/api/lastfm?method=album.search&album=${encodeURIComponent(query)}`);
    return response.json();
  }

  renderSearchResults() {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    // Render tracks
    if (this.searchResults.tracks.length > 0) {
      const tracksSection = this.createSearchSection('Songs', this.searchResults.tracks.slice(0, 10), 'track');
      container.appendChild(tracksSection);
    }

    // Render artists
    if (this.searchResults.artists.length > 0) {
      const artistsSection = this.createSearchSection('Artists', this.searchResults.artists.slice(0, 6), 'artist');
      container.appendChild(artistsSection);
    }

    // Render albums
    if (this.searchResults.albums.length > 0) {
      const albumsSection = this.createSearchSection('Albums', this.searchResults.albums.slice(0, 8), 'album');
      container.appendChild(albumsSection);
    }

    if (this.searchResults.tracks.length === 0 && 
        this.searchResults.artists.length === 0 && 
        this.searchResults.albums.length === 0) {
      container.innerHTML = '<div class="loading">No results found. Try a different search term.</div>';
    }
  }

  createSearchSection(title, items, type) {
    const section = document.createElement('div');
    section.className = 'search-section';

    const header = document.createElement('h2');
    header.textContent = title;
    section.appendChild(header);

    const list = document.createElement('div');
    list.className = type === 'track' ? 'search-list' : 'grid-container';

    items.forEach(item => {
      if (type === 'track') {
        list.appendChild(this.createTrackItem(item));
      } else if (type === 'artist') {
        list.appendChild(this.createArtistCard(item));
      } else if (type === 'album') {
        list.appendChild(this.createAlbumCard(item));
      }
    });

    section.appendChild(list);
    return section;
  }

  createTrackItem(track) {
    const item = document.createElement('div');
    item.className = 'search-item';
    
    const imageUrl = track.image?.find(img => img.size === 'medium')?.['#text'] || 
                     'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400';

    item.innerHTML = `
      <img src="${imageUrl}" alt="${track.name}">
      <div class="search-item-info">
        <div class="search-item-title">${track.name}</div>
        <div class="search-item-subtitle">${track.artist}</div>
      </div>
      <button class="control-btn play-button-overlay">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </button>
    `;

    item.addEventListener('click', () => {
      this.playTrack(track);
    });

    return item;
  }

  createArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'track-card';
    
    const imageUrl = artist.image?.find(img => img.size === 'extralarge')?.['#text'] || 
                     'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400';

    card.innerHTML = `
      <img src="${imageUrl}" alt="${artist.name}">
      <h3>${artist.name}</h3>
      <p>Artist</p>
    `;

    card.addEventListener('click', () => {
      this.showArtistDetails(artist);
    });

    return card;
  }

  createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'track-card';
    
    const imageUrl = album.image?.find(img => img.size === 'extralarge')?.['#text'] || 
                     'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400';

    card.innerHTML = `
      <img src="${imageUrl}" alt="${album.name}">
      <h3>${album.name}</h3>
      <p>${album.artist}</p>
    `;

    card.addEventListener('click', () => {
      this.showAlbumDetails(album);
    });

    return card;
  }

  async playTrack(track) {
    // Import PlayerController and QueueManager to handle playback
    const { QueueManager } = await import('./QueueManager.js');
    const queueManager = new QueueManager();
    
    queueManager.addToQueue(track);
    queueManager.playTrack(track);
  }

  async showArtistDetails(artist) {
    // This could be expanded to show artist's top tracks, albums, etc.
    console.log('Show artist details for:', artist.name);
  }

  async showAlbumDetails(album) {
    try {
      const response = await fetch(`/api/lastfm?method=album.getInfo&artist=${encodeURIComponent(album.artist)}&album=${encodeURIComponent(album.name)}`);
      const albumData = await response.json();
      
      if (albumData.album && albumData.album.tracks) {
        const tracks = Array.isArray(albumData.album.tracks.track) 
          ? albumData.album.tracks.track 
          : [albumData.album.tracks.track];
        
        this.showAlbumTracklist(album, tracks);
      }
    } catch (error) {
      console.error('Error fetching album details:', error);
    }
  }

  showAlbumTracklist(album, tracks) {
    const container = document.getElementById('searchResults');
    
    container.innerHTML = `
      <div class="album-view">
        <div class="album-header">
          <img src="${album.image?.find(img => img.size === 'extralarge')?.['#text'] || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'}" alt="${album.name}">
          <div class="album-info">
            <span class="album-type">Album</span>
            <h1>${album.name}</h1>
            <p>${album.artist} • ${tracks.length} songs</p>
          </div>
        </div>
        <div class="album-actions">
          <button class="play-album-btn" id="playAlbumBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </button>
        </div>
        <div class="tracklist">
          ${tracks.map((track, index) => `
            <div class="track-row" data-track='${JSON.stringify({...track, artist: album.artist})}'>
              <div class="track-number">${index + 1}</div>
              <div class="track-info">
                <div class="track-title">${track.name}</div>
                <div class="track-artist">${album.artist}</div>
              </div>
              <div class="track-duration">${this.formatDuration(track.duration)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add event listeners for track rows
    container.querySelectorAll('.track-row').forEach(row => {
      row.addEventListener('click', () => {
        const trackData = JSON.parse(row.dataset.track);
        this.playTrack(trackData);
      });
    });

    // Add event listener for play album button
    document.getElementById('playAlbumBtn').addEventListener('click', () => {
      if (tracks.length > 0) {
        const firstTrack = { ...tracks[0], artist: album.artist };
        this.playTrack(firstTrack);
      }
    });
  }

  formatDuration(duration) {
    if (!duration || duration === '0') return '--:--';
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}