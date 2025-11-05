/**
 * Video helper utilities for parsing YouTube, Vimeo, and direct video URLs
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not valid
 */
export function getYouTubeVideoId(url) {
  if (!url) return null;

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract Vimeo video ID from Vimeo URL
 * @param {string} url - Vimeo URL
 * @returns {string|null} - Video ID or null if not valid
 */
export function getVimeoVideoId(url) {
  if (!url) return null;

  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
}

/**
 * Check if URL is a direct video file
 * @param {string} url - URL to check
 * @returns {boolean} - True if direct video file
 */
export function isDirectVideoUrl(url) {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

/**
 * Parse video URL and determine type
 * @param {string} url - Video URL
 * @returns {Object} - { type: 'youtube'|'vimeo'|'direct'|'unknown', id: string|null, url: string }
 */
export function parseVideoUrl(url) {
  if (!url) return { type: 'unknown', id: null, url: null };

  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return {
      type: 'youtube',
      id: youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      url
    };
  }

  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) {
    return {
      type: 'vimeo',
      id: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      url
    };
  }

  if (isDirectVideoUrl(url)) {
    return {
      type: 'direct',
      id: null,
      embedUrl: url,
      url
    };
  }

  return { type: 'unknown', id: null, url };
}

/**
 * Get thumbnail URL for video
 * @param {Object} parsedVideo - Parsed video object
 * @returns {string|null} - Thumbnail URL or null
 */
export function getVideoThumbnail(parsedVideo) {
  if (!parsedVideo || parsedVideo.type === 'unknown') return null;

  switch (parsedVideo.type) {
    case 'youtube':
      return `https://img.youtube.com/vi/${parsedVideo.id}/hqdefault.jpg`;
    case 'vimeo':
      // Vimeo thumbnails require an API call, so we'll use a placeholder
      return null;
    case 'direct':
      return null;
    default:
      return null;
  }
}
