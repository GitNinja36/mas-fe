const PLATFORM_LOGOS = [
  { name: 'Blinkit', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/blinkit.png' },
  { name: 'ChatGPT', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/chatgpt.jpg' },
  { name: 'Cursor', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/cursor.jpeg' },
  { name: 'Flipkart', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/flipkart.png' },
  { name: 'Instagram', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/Instagram.png' },
  { name: 'LinkedIn', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/linkedin.png' },
  { name: 'Netflix', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/netflix.jpg' },
  { name: 'Pinterest', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/pinterest.png' },
  { name: 'Prime Video', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/primevideo.png' },
  { name: 'Reddit', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/reddit.png' },
  { name: 'Steam', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/steam.png' },
  { name: 'Swiggy', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/swiggy.png' },
  { name: 'Twitch', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/twitch.png' },
  { name: 'Uber', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/uber.png' },
  { name: 'X', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/x-logo.jpg' },
  { name: 'YouTube', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/youtube.png' },
  { name: 'Zomato', url: 'https://d1t3e5rrrumqz2.cloudfront.net/app-assets/platform_logos/zomato.png' }
]

export function MarqueeSection() {
  return (
    <div className="border-y bg-[#080808] py-8 relative z-20 overflow-hidden marquee-mask w-full border-white/5">
      {/* Label */}
      <div className="text-center mb-10">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest font-medium">
          Powered by cross-app behavior signals from
        </p>
      </div>
      
      {/* Logo Marquee */}
      <div className="flex whitespace-nowrap animate-marquee w-[max-content]">
        {/* Three copies for seamless loop */}
        {[0, 1, 2].map((groupIndex) => (
          <div key={groupIndex} className="flex gap-12 px-10 items-center">
            {PLATFORM_LOGOS.map((platform, index) => (
              <img
                key={`${groupIndex}-${index}`}
                src={platform.url}
                alt={platform.name}
                className="h-10 w-auto object-contain opacity-60 hover:opacity-200 transition-opacity rounded-full"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
