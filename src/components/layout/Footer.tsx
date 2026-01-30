import { useState } from 'react'
import { toast } from 'react-toastify'

export function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    toast.success(`Thank you! We'll contact you at ${email}`)
    setEmail('')
  }

  return (
    <footer className="bg-[#020202] pt-15 pb-10 px-6 border-t relative overflow-hidden border-white/10">
      {/* Background Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none select-none pointer-events-none opacity-5">
        <span className="text-[15vw] font-display font-black whitespace-nowrap-ml-10 text-white">
          BANZA
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        {/* Left: Email Signup */}
        <div>
          <h3 className="text-2xl font-display font-bold mb-6 text-white">Reach out to us</h3>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@company.com"
              className="border px-4 py-3 rounded text-sm w-64 focus:outline-none focus:border-accent bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="bg-[#FF3B00] px-6 py-3 rounded font-bold text-sm transition-colors text-black hover:bg-white"
            >
              SEND
            </button>
          </form>
        </div>

        {/* Right: Links */}
        <div className="flex gap-12 text-sm text-gray-500 font-mono tracking-wider uppercase">
          <div className="flex flex-col gap-3">
            <span className="text-white">Legal</span>
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto mt-20 pt-6 border-t flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase border-white/5 text-gray-600">
        <span>© 2025 Banza is a part of Hailstone Software Development Ltd. All rights reserved.</span>
        <span className="mt-2 md:mt-0">Dubai, AE</span>
      </div>
    </footer>
  )
}
