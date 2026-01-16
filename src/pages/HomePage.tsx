import { Navigation } from '../components/layout/Navigation'
import { Footer } from '../components/layout/Footer'
import { cn } from '@/lib/utils'
import {
  HeroSection,
  MarqueeSection,
  BentoFeatures,
  PipelineSection,
  DeveloperSection,
  CTASection
} from '../components/home'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative antialiased">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        {/* Spotlight Section */}
        <div className="relative bg-black">
          {/* Grid Background */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 select-none z-0",
              "[background-size:40px_40px]",
              "[background-image:linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)]"
            )}
          />
          
          {/* Animated Spotlight Beam */}
          <div className="pointer-events-none absolute inset-0 z-[1] overflow-visible">
            {/* Main Spotlight Beam - Moving Left to Right */}
            <div 
              className="absolute animate-spotlight-drift"
              style={{
                top: '0px',
                left: '0px',
                width: '800px',
                height: '600px',
                background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(255,255,255,0.5) 0%, transparent 70%)',
              }}
            />
            
            {/* Secondary Beam - Moving Right to Left */}
            <div 
              className="absolute animate-spotlight-drift-reverse"
              style={{
                top: '0px',
                right: '0px',
                width: '700px',
                height: '550px',
                background: 'radial-gradient(ellipse 45% 75% at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 70%)',
              }}
            />
            
            {/* Ambient Base Glow */}
            <div 
              className="absolute top-0 left-0 right-0 h-[600px]"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 60%)',
              }}
            />
          </div>
          
          <HeroSection />
          <MarqueeSection />
        </div>

        {/* Rest of the sections without spotlight */}
        <div className="bg-[#050505]">
          <BentoFeatures />
          <PipelineSection />
          <DeveloperSection />
          <CTASection />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
