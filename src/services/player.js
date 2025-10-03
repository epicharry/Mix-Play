class PlayerService {
  constructor() {
    this.ytPlayer = null;
    this.currentTrack = null;
    this.queue = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.listeners = new Set();
    this.progressInterval = null;
    this.loadYouTubeAPI();
  }

  loadYouTubeAPI() {
    if (window.YT) {
      this.initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      this.initPlayer();
    };
  }

  initPlayer() {
    this.ytPlayer = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: '',
      events: {
        onReady: () => this.notifyListeners(),
        onStateChange: (event) => this.handleStateChange(event),
      },
      playerVars: {
        autoplay: 0,
        controls: 0,
      }
    });
  }

  handleStateChange(event) {
    if (event.data === window.YT.PlayerState.ENDED) {
      this.next();
    } else if (event.data === window.YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      this.startProgressUpdater();
      this.notifyListeners();
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      this.isPlaying = false;
      this.stopProgressUpdater();
      this.notifyListeners();
    }
  }

  async play(track) {
    this.currentTrack = track;

    if (track.youtubeVideoId) {
      this.ytPlayer?.loadVideoById(track.youtubeVideoId);
      this.ytPlayer?.playVideo();
      this.isPlaying = true;
    }

    this.notifyListeners();
  }

  pause() {
    this.ytPlayer?.pauseVideo();
    this.isPlaying = false;
    this.notifyListeners();
  }

  resume() {
    this.ytPlayer?.playVideo();
    this.isPlaying = true;
    this.notifyListeners();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  next() {
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.play(this.queue[this.currentIndex]);
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.play(this.queue[this.currentIndex]);
    }
  }

  setQueue(tracks, startIndex = 0) {
    this.queue = tracks;
    this.currentIndex = startIndex;
    if (tracks.length > 0) {
      this.play(tracks[startIndex]);
    }
  }

  addToQueue(track) {
    this.queue.push(track);
    if (this.currentIndex === -1) {
      this.currentIndex = 0;
      this.play(track);
    }
  }

  getProgress() {
    if (!this.ytPlayer?.getCurrentTime || !this.ytPlayer?.getDuration) {
      return { current: 0, duration: 0, percentage: 0 };
    }

    const current = this.ytPlayer.getCurrentTime();
    const duration = this.ytPlayer.getDuration();
    const percentage = duration > 0 ? (current / duration) * 100 : 0;

    return { current, duration, percentage };
  }

  seek(percentage) {
    const duration = this.ytPlayer?.getDuration();
    if (duration) {
      const seekTime = (percentage / 100) * duration;
      this.ytPlayer.seekTo(seekTime);
    }
  }

  startProgressUpdater() {
    this.stopProgressUpdater();
    this.progressInterval = setInterval(() => {
      this.notifyListeners();
    }, 500);
  }

  stopProgressUpdater() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback({
      currentTrack: this.currentTrack,
      isPlaying: this.isPlaying,
      queue: this.queue,
      currentIndex: this.currentIndex,
      progress: this.getProgress(),
    }));
  }

  getCurrentState() {
    return {
      currentTrack: this.currentTrack,
      isPlaying: this.isPlaying,
      queue: this.queue,
      currentIndex: this.currentIndex,
      progress: this.getProgress(),
    };
  }
}

export const playerService = new PlayerService();
