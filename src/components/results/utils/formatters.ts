/**
 * Formatting utilities for numbers, percentages, confidence, and time
 */

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatConfidence(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`
  } else {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export function formatLargeNumber(value: number): string {
  return value.toLocaleString('en-US')
}

export function formatTokenCount(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export function formatConfidenceLevel(value: number): string {
  if (value >= 0.8) return 'High'
  if (value >= 0.5) return 'Medium'
  return 'Low'
}

export function formatCoverage(platforms: number, total?: number): number {
  // If total is provided, calculate percentage
  if (total && total > 0) {
    return Math.min((platforms / total) * 100, 100)
  }
  // Otherwise assume 100% if we have platforms (no total available)
  return platforms > 0 ? 100 : 0
}
