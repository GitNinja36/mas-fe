/**
 * Platform logo mapping utility
 */

const PLATFORM_LOGOS: Record<string, string> = {
  blinkit: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/blinkit.png',
  chatgpt: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/chatgpt.jpg',
  cursor: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/cursor.jpeg',
  flipkart: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/flipkart.png',
  instagram: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/Instagram.png',
  linkedin: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/linkedin.png',
  netflix: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/netflix.jpg',
  pinterest: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/pinterest.png',
  'prime video': 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/primevideo.png',
  'prime_video': 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/primevideo.png',
  reddit: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/reddit.png',
  steam: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/steam.png',
  swiggy: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/swiggy.png',
  twitch: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/twitch.png',
  uber: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/uber.png',
  x: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/x-logo.jpg',
  twitter: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/x-logo.jpg',
  youtube: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/youtube.png',
  zomato: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/zomato.png',
  spotify: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/spotify.png',
  tiktok: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/tiktok.png',
  facebook: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/facebook.png',
  discord: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/discord.png',
}

/**
 * Gets platform logo URL by platform name
 */
export function getPlatformLogoUrl(platform: string): string | null {
  const normalizedPlatform = platform.toLowerCase().replace(/_/g, ' ').trim()
  return PLATFORM_LOGOS[normalizedPlatform] || null
}
