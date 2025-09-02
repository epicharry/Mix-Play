// YouTube API configuration
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Replace with your actual API key
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export class YouTubeAPI {
  static async searchVideos(query, maxResults = 1) {
    const url = new URL(YOUTUBE_BASE_URL);
    
    url.searchParams.append('key', YOUTUBE_API_KEY);
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('type', 'video');
    url.searchParams.append('q', query);
    url.searchParams.append('maxResults', maxResults);
    url.searchParams.append('videoCategoryId', '10'); // Music category
    url.searchParams.append('order', 'relevance');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('YouTube API error:', error);
      throw error;
    }
  }

  static async getVideoDetails(videoId) {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    
    url.searchParams.append('key', YOUTUBE_API_KEY);
    url.searchParams.append('part', 'snippet,contentDetails');
    url.searchParams.append('id', videoId);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('YouTube API error:', error);
      throw error;
    }
  }

  static formatDuration(duration) {
    // Convert YouTube duration format (PT4M13S) to seconds
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').replace('H', '') || 0;
    const minutes = (match[2] || '').replace('M', '') || 0;
    const seconds = (match[3] || '').replace('S', '') || 0;
    
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  }
}