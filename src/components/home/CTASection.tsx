import { useNavigate } from 'react-router-dom'

export function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="bg-[#050505] z-20 border-white/5 border-t pt-32 pr-6 pb-32 pl-6 relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/agent')}
            className="bg-[#FF3B00] px-20 py-4 font-bold text-sm uppercase tracking-widest w-full sm:w-auto btn-magnetic text-black hover:text-accent rounded-md hover:rounded-full transition-all duration-1000 ease-in-out hover:bg-white"
          >
            Start Now
          </button>
        </div>
      </div>
    </section>
  )
}
