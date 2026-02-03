import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface PricingTier {
  name: string
  price: string
  badge?: string
  description: string
  features: string[]
  bestFor: string
  ctaText: string
}

const TIERS: PricingTier[] = [
  {
    name: 'Validate',
    price: '$29',
    description: 'For founders who validate before they build. Turn early ideas into informed direction within minutes.',
    features: [
      '3 validation reports per month',
      'Recommended panel size (50-100 AI twins)',
      'Single and multi-question surveys',
      'Standard cohort selection',
      'Decision verdict + reasoning',
      'Confidence & dominance signals',
      'Follow-up question suggestions',
      'Shareable reports',
    ],
    bestFor: 'Solopreneurs and early-stage founders testing initial concepts.',
    ctaText: 'Start validating',
  },
  {
    name: 'Build',
    price: '$99',
    badge: 'Most Popular',
    description: 'Serious validation for teams making real product decisions. Reduce risk before committing time, capital, and roadmap.',
    features: [
      'Everything in Validate, plus:',
      '12 validation reports per month',
      'Advanced cohort filtering',
      'Larger panels for stronger signal',
      'Deeper reasoning synthesis',
      'Multi-question decision reports',
      'Cross-question insights',
      'Priority compute',
      'Faster report generation',
      'Team sharing',
    ],
    bestFor: 'Product teams, growth leaders, and startups shipping new features.',
    ctaText: 'Build with confidence',
  },
  {
    name: 'Ship',
    price: '$299',
    description: 'For companies that validate every major move. Operate with conviction across pricing, positioning, features, and market strategy.',
    features: [
      'Everything in Build, plus:',
      '50 validation reports per month',
      'High-depth AI twin panels',
      'Swarm intelligence mode',
      'Trend detection across validations',
      'Decision dashboards',
      'Advanced confidence diagnostics',
      'Premium reasoning visibility',
      'Priority processing',
      'Dedicated support',
    ],
    bestFor: 'High-velocity teams where every decision impacts growth.',
    ctaText: 'Ship with certainty',
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'Decision intelligence tailored to your organization. Built for companies running continuous validation across products, markets, and customer segments.',
    features: [
      'Unlimited or high-volume validations',
      'Custom AI twin cohorts',
      'Strategic sampling design',
      'API access (optional)',
      'Workflow integrations',
      'Dedicated infrastructure',
      'Enterprise-grade security',
      'SLA-backed reliability',
      'White-glove onboarding',
    ],
    bestFor: 'Enterprises, agencies, and research-driven organizations.',
    ctaText: 'Contact Sales',
  },
]

export function PricingSection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleCta = () => {
    if (isAuthenticated) {
      navigate('/agent')
    } else {
      navigate('/login')
    }
  }

  return (
    <section id="pricing" className="skew-target py-20 px-6 bg-[#050505] relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#FF3B00] font-mono text-[10px] tracking-widest uppercase mb-3 block">Flexible Plans</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">Pricing</h2>
          <p className="text-gray-400 text-sm">Choose the plan that fits your validation velocity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl p-5 flex flex-col transition-all duration-300 group hover:-translate-y-2 ${tier.badge
                ? 'bg-gradient-to-b from-[#FF3B00]/10 to-[#0a0a0a] border border-[#FF3B00]/30 shadow-[0_0_30px_rgba(255,59,0,0.1)]'
                : 'bg-[#0a0a0a] border border-white/10 hover:border-white/20'
                }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF3B00] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg shadow-[#FF3B00]/20">
                  {tier.badge}
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-display font-bold text-lg text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold text-white tracking-tight">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="text-xs font-normal text-gray-500">/mo</span>}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed min-h-[32px]">{tier.description}</p>
              </div>

              <div className="flex-grow mb-5 space-y-3">
                <div className="h-px bg-white/5 w-full" />
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Features</p>
                <ul className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300 group/item">
                      <span className="text-[#FF3B00] mt-1 shrink-0 text-[10px]">●</span>
                      <span className={`text-[11px] pt-1 leading-snug ${feature.endsWith('plus:') ? 'font-semibold text-white' : 'text-gray-400 group-hover/item:text-gray-300 transition-colors'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="mb-3">
                  <p className="text-[10px] text-gray-500 mb-0.5">Best for:</p>
                  <p className="text-[11px] text-gray-300 line-clamp-2 leading-snug">{tier.bestFor}</p>
                </div>

                <button
                  onClick={handleCta}
                  className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${tier.badge
                    ? 'bg-[#FF3B00] text-black hover:bg-[#ff5722] hover:shadow-[0_0_20px_rgba(255,59,0,0.3)]'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                >
                  {tier.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* One-time validation card */}
        <div className="mt-8 rounded-xl border border-white/10 bg-gradient-to-r from-[#0a0a0a] to-[#080808] p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF3B00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display font-bold text-xl text-white mb-1">Need just one validation?</h3>
              <p className="text-gray-400 text-sm mb-4 max-w-xl">Run a single decision-grade validation anytime without a subscription.</p>

              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 sm:gap-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">$12</span>
                  <span className="text-xs text-gray-500">/ validation</span>
                </div>
                <div className="h-px w-full sm:w-px sm:h-10 bg-white/10" />
                <p className="text-xs text-gray-400 max-w-xs text-center sm:text-left py-1">
                  Perfect for quick idea checks, pricing tests, or messaging validation.
                </p>
              </div>
            </div>

            <button
              onClick={handleCta}
              className="shrink-0 bg-white hover:bg-gray-100 text-black font-bold px-8 py-4 rounded-lg transition-colors whitespace-nowrap uppercase tracking-widest text-xs shadow-lg shadow-white/5"
            >
              Run a validation
            </button>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center mt-12">
          <p className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600">
            Decisions shouldn&apos;t take months
          </p>
        </div>
      </div>
    </section>
  )
}
