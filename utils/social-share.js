// Social media sharing utilities

export const shareOnFacebook = (url, title) => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

export const shareOnTwitter = (url, title, hashtags = []) => {
  const text = encodeURIComponent(title);
  const hashtagString = hashtags.join(',');
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}${hashtagString ? `&hashtags=${hashtagString}` : ''}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

export const shareOnWhatsApp = (url, title) => {
  const text = encodeURIComponent(`${title} ${url}`);
  const shareUrl = `https://wa.me/?text=${text}`;
  window.open(shareUrl, '_blank');
};

export const shareOnPinterest = (url, imageUrl, description) => {
  const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
  window.open(shareUrl, '_blank', 'width=750,height=550');
};

export const shareOnLinkedIn = (url, title) => {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve();
    } catch (err) {
      document.body.removeChild(textArea);
      return Promise.reject(err);
    }
  }
};

export const generateReferralLink = (baseUrl, referrerId) => {
  return `${baseUrl}?ref=${referrerId}`;
};

export const getReferralIdFromUrl = () => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
};
