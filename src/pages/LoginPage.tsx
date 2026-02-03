import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Mail, ArrowLeft } from 'lucide-react'
import { login } from '../lib/authApi'
import { isAllowedLoginEmail } from '../utils/gmailValidator'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!isAllowedLoginEmail(email)) {
        throw new Error('Please use a valid Gmail or @banza.xyz email address')
      }
      await login(email)
      // Store email for OTP page
      localStorage.setItem('pendingEmail', email)
      // Navigate to OTP verification page
      navigate('/verify-otp', { state: { email } })
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Back Button */}
      <div className="pt-6 px-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/davtv5r1c/image/upload/v1768230956/image_fullvo.png"
                alt="Logo"
                className="w-8 h-8"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white text-center mb-2 font-display">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Enter your email to receive a secure OTP
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B00] transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF3B00] hover:bg-[#FF3B00]/90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send OTP →'}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#FF3B00] hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer text */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Secure authentication with OTP verification
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
