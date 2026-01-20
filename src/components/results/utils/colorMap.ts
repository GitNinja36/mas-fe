/**
 * Color mapping utilities for platforms, severity levels, and signal categories
 */

export function getPlatformColor(platform: string): string {
  const platformColors: Record<string, string> = {
    youtube: '#FF0000',
    spotify: '#1DB954',
    swiggy: '#FF6B35',
    blinkit: '#00B8D4',
    prime_video: '#00A8E1',
    netflix: '#E50914',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    linkedin: '#0077B5',
    facebook: '#1877F2',
    reddit: '#FF4500',
    discord: '#5865F2',
    steam: '#1B2838',
    twitch: '#9146FF',
    tiktok: '#000000',
  }
  
  return platformColors[platform.toLowerCase()] || '#FF3B00'
}

export function getSeverityColor(severity: string): { bg: string; border: string; text: string } {
  const severityMap: Record<string, { bg: string; border: string; text: string }> = {
    low: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400'
    },
    medium: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400'
    },
    high: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400'
    }
  }
  
  return severityMap[severity.toLowerCase()] || severityMap.medium
}

export function getSignalCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    AUTHENTICITY: '#10B981', // green
    CONVENIENCE: '#3B82F6', // blue
    PASSIVITY: '#8B5CF6', // purple
    VIDEO: '#EF4444', // red
    AUDIO: '#F59E0B', // amber
    PRICE: '#06B6D4', // cyan
    QUALITY: '#EC4899', // pink
  }
  
  return categoryColors[category] || '#FF3B00'
}

export function getTrendColor(trend: string): string {
  const trendColors: Record<string, string> = {
    positive: '#10B981', // green
    stable: '#6B7280', // gray
    negative: '#EF4444', // red
  }
  
  return trendColors[trend.toLowerCase()] || '#6B7280'
}
