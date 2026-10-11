import { useState } from 'react'
import { Menu, X, MessageSquare } from 'lucide-react'
import Logo from './Logo.jsx'
import { NAV_LINKS } from '../constants.js'
import { IS_DEMO_MODE } from '../services/api.js'

export default function Navbar({ onAskClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex-shrink-0">
            <Logo size="sm" showText={true} />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-navy-800 transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {IS_DEMO_MODE && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse-slow" />
                Demo Mode
              </span>
            )}
            <button
              id="nav-ask-btn"
              onClick={onAskClick}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white text-sm font-medium rounded-lg transition-all duration-150 shadow-sm hover:shadow-md active:scale-95"
            >
              <MessageSquare size={15} />
              Ask NyayaAI
            </button>
            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-btn"
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-navy-800 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-navy-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                id="mobile-ask-btn"
                onClick={() => { setMenuOpen(false); onAskClick() }}
                className="mt-2 flex items-center gap-2 px-3 py-2.5 bg-navy-800 text-white text-sm font-medium rounded-lg"
              >
                <MessageSquare size={15} />
                Ask NyayaAI
              </button>
              {IS_DEMO_MODE && (
                <div className="mt-2 px-3 py-2 bg-saffron-50 text-saffron-700 text-xs font-medium rounded-lg border border-saffron-200">
                  ⚡ Demo Mode Active — No backend required
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
