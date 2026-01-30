import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Shield, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'
import { verifyOtp, resendOtp } from '../lib/authApi'
import { useAuth } from '../context/AuthContext'

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    // Get email from location state or localStorage
    const stateEmail = location.state?.email
    const storedEmail = localStorage.getItem('pendingEmail')
    
    if (stateEmail) {
      setEmail(stateEmail)
      localStorage.setItem('pendingEmail', stateEmail)
    } else if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // No email found, redirect to login
      navigate('/login')
    }
  }, [location, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      const result = await verifyOtp(email, otp)
      setSuccess(true)
      
      // Update auth context (now async)
      await login(result.user.email, result.user.username)
      
      // Clear pending email
      localStorage.removeItem('pendingEmail')
      
      // Navigate to dashboard or original destination after a brief delay
      setTimeout(() => {
        const returnPath = location.state?.from || '/dashboard'
        navigate(returnPath, { replace: true })
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP. Please try again.')
      setOtp('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    setError('')
    
    try {
      await resendOtp(email)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Back Button */}
      <div className="pt-6 px-6">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to email</span>
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
            Enter the OTP sent to your email
          </p>

          {/* Form Card */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 space-y-6">
            {/* Verification Code Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showOtp ? 'text' : 'password'}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-[#050505] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B00] transition-colors text-center text-2xl tracking-widest font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Email Display */}
            <p className="text-sm text-gray-400 text-center">
              Code sent to <span className="text-white">{email}</span>
            </p>

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>OTP sent to your email address</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-[#FF3B00] hover:bg-[#FF3B00]/90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP →'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm text-gray-400 hover:text-[#FF3B00] transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending...' : "Didn't receive code? Resend"}
              </button>
            </div>
          </div>

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
