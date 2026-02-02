import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function CTASection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <section className="bg-[#050505] z-20 border-white/5 border-t pt-15 pr-6 pb-15 pl-6 relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/survey')
              } else {
                navigate('/login')
              }
            }}
            className="group relative bg-[#FF3B00] px-20 py-4 font-bold text-sm uppercase tracking-widest transition-all w-full sm:w-auto btn-magnetic hover:bg-[#ff5722] hover:scale-105 active:scale-95 text-black overflow-hidden rounded-lg shadow-[0_0_20px_rgba(255,59,0,0.3)] hover:shadow-[0_0_40px_rgba(255,59,0,0.5)]"
          >
            <span className="relative z-10">Validate an Idea</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
          </button>
        </div>
      </div>
    </section>
  )
}
