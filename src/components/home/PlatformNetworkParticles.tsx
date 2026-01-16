import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

interface PlatformNetworkParticlesProps {
  className?: string
}

export function PlatformNetworkParticles({ className = '' }: PlatformNetworkParticlesProps) {
  const [init, setInit] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Restart particles every 30 seconds to prevent mess
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
    }, 30000) // 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const options = {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          area: 100
        },
        limit: {
          mode: 'delete' as const,
          value: 100
        }
      },
      color: {
        value: ['#E50914', '#FF0000', '#1DA1F2', '#0A66C2', '#FF4500', '#1DB954', '#E4405F', '#808080']
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 1
      },
      size: {
        value: { min: 2, max: 4 }
      },
      links: {
        enable: true,
        distance: 150,
        color: 'rgba(255, 255, 255, 0.2)',
        opacity: 0.5,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none' as const,
        random: false,
        straight: false,
        outModes: {
          default: 'out' as const
        }
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab'
        },
        onClick: {
          enable: true,
          mode: 'push'
        }
      },
      modes: {
        grab: {
          distance: 100,
          links: {
            opacity: 0.8
          }
        },
        push: {
          quantity: 1
        }
      }
    },
    background: {
      color: {
        value: 'transparent'
      }
    }
  }

  if (!init) {
    return null
  }

  return (
    <div className={`w-full h-full ${className}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Particles
        key={refreshKey}
        id={`platform-network-particles-${refreshKey}`}
        options={options}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
