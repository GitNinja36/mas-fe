import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useHealthCheck } from '../../hooks/useHealthCheck'
import { useAuth } from '../../context/AuthContext'
import { User, LogOut, Coins, LayoutDashboard, FileText, Menu, X, Plus, ChevronRight } from 'lucide-react'
import iconLogo from '../../assets/IMG_6248.PNG'
import banzaLogo from '../../assets/Banza_Logo.png'

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const healthStatus = useHealthCheck()
  const { isAuthenticated, logout, credits, refreshCredits } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Refresh credits when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && isAuthenticated) {
      const timeoutId = setTimeout(() => {
        refreshCredits()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [isDropdownOpen, isAuthenticated, refreshCredits])

  const isActive = (path: string) => location.pathname === path
  const isHealthy = healthStatus === 'healthy'
  const isChecking = healthStatus === 'checking'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // --- Authenticated Layout (Sidebar) ---
  if (isAuthenticated) {
    return (
      <>
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2" aria-label="Banza home">
            <img src={iconLogo} width={32} height={32} alt="" className="w-8 h-8 object-contain" />
            <img src={banzaLogo} width={72} height={20} alt="Banza" className="h-5 object-contain" />
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Sidebar (Desktop & Mobile Drawer) */}
        <nav className={`fixed top-0 left-0 h-full w-64 bg-[#050505] border-r border-white/5 z-[60] transform transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 pt-20' : '-translate-x-full md:pt-0'}`}>
          <div className="flex flex-col h-full p-6">
            {/* Logo area — clickable, links to home */}
            <Link to="/" className="hidden md:flex items-center gap-2 mb-10 px-2 mt-2 group">
              <img src={iconLogo} width={32} height={32} alt="" className="w-8 h-8 object-contain" />
              <img src={banzaLogo} width={80} height={24} alt="Banza" className="h-6 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* User Profile Summary (Top of Sidebar) */}
            <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF3B00] to-orange-600 flex items-center justify-center text-white font-bold">
                  <User size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">Admin</p>
                  <p className="text-xs text-gray-500 truncate">Pro Account</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 flex-1">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/dashboard') ? 'bg-[#FF3B00] text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <LayoutDashboard size={18} className={isActive('/dashboard') ? 'text-black' : 'group-hover:text-[#FF3B00]'} />
                <span className="text-sm tracking-wide">DASHBOARD</span>
              </Link>

              <Link
                to="/agent"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/agent') ? 'bg-[#FF3B00] text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Plus size={18} className={isActive('/agent') ? 'text-black' : 'group-hover:text-[#FF3B00]'} />
                <span className="text-sm tracking-wide">NEW SURVEY</span>
              </Link>

              <Link
                to="/results"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/results') && !isActive('/agent') ? 'bg-[#FF3B00] text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <FileText size={18} className={isActive('/results') ? 'text-black' : 'group-hover:text-[#FF3B00]'} />
                <span className="text-sm tracking-wide">REPORTS</span>
              </Link>
            </div>

            {/* Bottom Stack */}
            <div className="mt-auto space-y-4">
              {/* Credits */}
              {credits && (
                <Link to="/credits" className="block p-4 rounded-xl bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10 hover:border-[#FF3B00]/40 transition-all group/credits cursor-pointer">
                  <div className="flex items-center gap-2 mb-2 text-gray-400 group-hover/credits:text-white transition-colors">
                    <Coins size={14} className="text-[#FF3B00]" />
                    <span className="text-xs font-mono uppercase">Credits</span>
                  </div>
                  <div className="text-2xl font-bold text-white font-display flex items-center justify-between">
                    {credits.availableCredits.toLocaleString()}
                    <ChevronRight size={14} className="text-[#FF3B00] opacity-0 -translate-x-2 group-hover/credits:opacity-100 group-hover/credits:translate-x-0 transition-all" />
                  </div>
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </div>
        </nav>
      </>
    )
  }

  // --- Public Layout (Horizontal Navbar) ---
  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-[#050505]/80 backdrop-blur-md border-white/5">
      <div className="max-w-7xl mx-auto px-3 h-20 flex justify-between items-center">
        {/* Logo — single link to home, local assets */}
        <Link to="/" className="group flex items-center gap-2" aria-label="Banza home">
          <img src={iconLogo} width={40} height={40} alt="" className="w-10 h-10 object-contain" />
          <img src={banzaLogo} width={100} height={28} alt="Banza" className="h-7 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Public Nav Links (No Numeric Labels) */}
        <div className="hidden md:flex gap-8 text-xs font-mono tracking-widest text-gray-400">
          <button onClick={() => {
            if (location.pathname !== '/') {
              navigate('/')
              setTimeout(() => document.getElementById('core')?.scrollIntoView({ behavior: 'smooth' }), 100)
            } else {
              document.getElementById('core')?.scrollIntoView({ behavior: 'smooth' })
            }
          }} className="transition-colors hover:text-white uppercase">
            Product
          </button>
          <button onClick={() => {
            if (location.pathname !== '/') {
              navigate('/')
              setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100)
            } else {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }
          }} className="transition-colors hover:text-white uppercase">
            Solution
          </button>
          <button onClick={() => {
            if (location.pathname !== '/') {
              navigate('/')
              setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100)
            } else {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
            }
          }} className="transition-colors hover:text-white uppercase">
            Pricing
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* System Status Indicator */}
          {!isChecking && !isActive('/') && (
            <span className={`hidden lg:flex text-[10px] font-mono items-center gap-2 transition-colors duration-300 ${isHealthy ? 'text-green-500' : 'text-red-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
              {isHealthy ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
            </span>
          )}

          <button
            onClick={() => navigate('/login')}
            className="border px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all btn-magnetic border-white/20 text-white hover:bg-white hover:text-black"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  )
}
