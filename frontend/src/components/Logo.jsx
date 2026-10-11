import { Scale } from 'lucide-react'

/**
 * NyayaAI brand logo — scales of justice with saffron accent.
 */
export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 26, text: 'text-xl' },
    lg: { icon: 32, text: 'text-2xl' },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-navy-800 shadow-md flex-shrink-0">
        <Scale size={s.icon} className="text-saffron-400" strokeWidth={1.8} />
        {/* Small Ashoka chakra dot */}
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-saffron-300 opacity-80" />
      </div>
      {showText && (
        <div>
          <span className={`font-serif font-bold text-navy-800 ${s.text} leading-none tracking-tight`}>
            Nyaya<span className="text-saffron-500">AI</span>
          </span>
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase leading-none mt-0.5">
            Constitution Assistant
          </p>
        </div>
      )}
    </div>
  )
}
