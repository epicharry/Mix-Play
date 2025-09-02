export class PlayerController {
  constructor() {
    this.ytPlayer = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.progressInterval = null;
    this.volume = 50;
  }

  initializeYouTubePlayer() {
    this.ytPlayer = new YT.Player('youtubePlayer', {
      height: '0',
      width: '0',
      videoId: '',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: () => {
          console.log('YouTube player ready');
          this.ytPlayer.setVolume(this.volume);
        },
        onStateChange: (event) => this.onPlayerStateChange(event)
      }
    });
  }

  async playTrack(track) {
    if (!this.ytPlayer) {
      console.warn('YouTube player not ready');
      return;
    }

    this.currentTrack = track;
    this.updateUI(track);

    try {
      // Search for the track on YouTube
      const searchQuery = `${track.name} ${track.artist}`;
      const response = await fetch(`/api/youtube?part=snippet&q=${encodeURIComponent(searchQuery)}&maxResults=1&type=video`);
      const data = await response.json();
      
      const videoId = data.items?.[0]?.id?.videoId;
      
      if (videoId) {
        this.ytPlayer.loadVideoById(videoId);
        this.ytPlayer.playVideo();
        this.isPlaying = true;
        this.startProgressUpdater();
        this.updatePlayButton(true);
      } else {
        throw new Error('No video found');
      }
    } catch (error) {
      console.error('Error playing track:', error);
      this.updateUI({ name: 'Error playing track', artist: '' });
    }
  }

  togglePlayPause() {
    if (!this.ytPlayer || !this.currentTrack) return;

    if (this.isPlaying) {
      this.ytPlayer.pauseVideo();
      this.isPlaying = false;
      this.stopProgressUpdater();
      this.updatePlayButton(false);
    } else {
      this.ytPlayer.playVideo();
      this.isPlaying = true;
      this.startProgressUpdater();
      this.updatePlayButton(true);
    }
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.ytPlayer) {
      this.ytPlayer.setVolume(volume);
    }
    this.updateVolumeIcon(volume);
  }

  seekTo(event) {
    if (!this.ytPlayer || !this.currentTrack) return;

    const progressContainer = event.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const duration = this.ytPlayer.getDuration();
    
    if (duration > 0) {
      const seekTime = duration * percentage;
      this.ytPlayer.seekTo(seekTime);
    }
  }

  updateUI(track) {
    document.getElementById('currentTrackName').textContent = track.name;
    document.getElementById('currentTrackArtist').textContent = track.artist;
    
    // Fetch and update album art
    this.updateAlbumArt(track);
  }

  async updateAlbumArt(track) {
    try {
      const response = await fetch(`/api/getAlbumArt?artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}`);
      const data = await response.json();
      
      const trackImage = document.getElementById('currentTrackImage');
      if (data.imageUrl && data.imageUrl !== 'assests/fallback.png') {
        trackImage.src = data.imageUrl;
      } else {
        trackImage.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400';
      }
    } catch (error) {
      console.error('Error fetching album art:', error);
      document.getElementById('currentTrackImage').src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400';
    }
  }

  updatePlayButton(playing) {
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    if (playing) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
    }
  }

  updateVolumeIcon(volume) {
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeHigh = volumeBtn.querySelector('.volume-high');
    
    if (volume == 0) {
      volumeHigh.innerHTML = '<path d="M16 21c3.5-1.6 6-5.1 6-9s-2.5-7.4-6-9v2c2.5 1.4 4 4.1 4 7s-1.5 5.6-4 7v2zM12 4L7 9H3v6h4l5 5V4z"/>';
    } else if (volume < 50) {
      volumeHigh.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
    } else {
      volumeHigh.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
  }

  startProgressUpdater() {
    this.stopProgressUpdater();
    this.progressInterval = setInterval(() => {
      if (this.ytPlayer && this.ytPlayer.getCurrentTime && this.ytPlayer.getDuration) {
        const currentTime = this.ytPlayer.getCurrentTime();
        const duration = this.ytPlayer.getDuration();

        if (duration > 0) {
          const progressPercent = (currentTime / duration) * 100;
          document.getElementById('progressBar').style.width = `${progressPercent}%`;
          document.getElementById('progressHandle').style.left = `${progressPercent}%`;
          
          document.getElementById('currentTime').textContent = this.formatTime(currentTime);
          document.getElementById('totalTime').textContent = this.formatTime(duration);
        }
      }
    }, 1000);
  }

  stopProgressUpdater() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      // Import QueueManager to handle next track
      import('./QueueManager.js').then(({ QueueManager }) => {
        const queueManager = new QueueManager();
        queueManager.playNext();
      });
    } else if (event.data === YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      this.startProgressUpdater();
      this.updatePlayButton(true);
    } else if (event.data === YT.PlayerState.PAUSED) {
      this.isPlaying = false;
      this.stopProgressUpdater();
      this.updatePlayButton(false);
    }
  }
}