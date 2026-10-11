import { useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

export default function ChatInput({ value, onChange, onSend, isLoading, disabled }) {
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [value])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && !disabled && value.trim()) {
        onSend()
      }
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-navy-400 focus-within:ring-2 focus-within:ring-navy-100 transition-all duration-150 shadow-sm">
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the Indian Constitution… (Enter to send, Shift+Enter for new line)"
            disabled={isLoading || disabled}
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed disabled:opacity-60 min-h-[24px]"
            style={{ maxHeight: '160px', overflowY: 'auto' }}
            aria-label="Question input"
          />
          <button
            id="send-btn"
            onClick={onSend}
            disabled={isLoading || disabled || !value.trim()}
            aria-label="Send question"
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 bg-navy-800 hover:bg-navy-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-150 active:scale-90 shadow-sm"
          >
            {isLoading
              ? <Loader2 size={16} className="animate-spin" />
              : <Send size={16} />
            }
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-gray-400 text-center leading-none">
          NyayaAI provides educational information only — not legal advice. Verify with official sources.
        </p>
      </div>
    </div>
  )
}
