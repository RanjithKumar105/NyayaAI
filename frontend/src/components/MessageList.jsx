import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check, BookOpen, AlertTriangle, RefreshCw, FlaskConical } from 'lucide-react'
import LoadingDots from './LoadingDots.jsx'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard access denied */
    }
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy answer"
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-navy-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function SourceBadge({ sources }) {
  if (!sources || (Array.isArray(sources) && sources.length === 0)) return null

  const list = Array.isArray(sources) ? sources : [sources]

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
        <BookOpen size={12} className="text-navy-500" />
        <span className="font-medium text-navy-700">Source References</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {list.map((src, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-50 text-navy-700 border border-navy-100 rounded-full text-[11px] font-medium"
          >
            <BookOpen size={10} />
            {src}
          </span>
        ))}
      </div>
    </div>
  )
}

function DemoBadge() {
  return (
    <div className="flex items-center gap-1.5 mt-3 px-2.5 py-1.5 bg-saffron-50 border border-saffron-200 rounded-lg">
      <FlaskConical size={12} className="text-saffron-600 flex-shrink-0" />
      <p className="text-[11px] text-saffron-700 leading-snug">
        <strong>Demo response</strong> — This is a sample answer for UI testing. Connect your backend to get real AI answers.
      </p>
    </div>
  )
}

/** User message bubble */
function UserBubble({ message }) {
  return (
    <div className="flex justify-end animate-slide-up">
      <div className="max-w-[75%] sm:max-w-[65%]">
        <div className="bg-navy-800 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-3 leading-relaxed shadow-sm">
          {message.text}
        </div>
        <p className="mt-1 text-right text-[10px] text-gray-400">You</p>
      </div>
    </div>
  )
}

/** Assistant loading bubble */
function LoadingBubble() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[80%]">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
          <LoadingDots />
        </div>
        <p className="mt-1 text-[10px] text-gray-400">NyayaAI is thinking…</p>
      </div>
    </div>
  )
}

/** Assistant error bubble */
function ErrorBubble({ message, onRetry }) {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="max-w-[80%] sm:max-w-[70%]">
        <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-700">Request Failed</p>
          </div>
          <p className="text-xs text-red-600 leading-relaxed">{message.error}</p>
          {onRetry && (
            <button
              onClick={() => onRetry(message.originalQuestion)}
              className="mt-3 flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              <RefreshCw size={12} />
              Retry this question
            </button>
          )}
        </div>
        <p className="mt-1 text-[10px] text-gray-400">NyayaAI</p>
      </div>
    </div>
  )
}

/** Assistant answer bubble */
function AssistantBubble({ message }) {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="max-w-[85%] sm:max-w-[75%]">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
          {/* Markdown-rendered answer */}
          <div className="prose-answer">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.answer}</ReactMarkdown>
          </div>

          {/* Sources */}
          <SourceBadge sources={message.sources} />
          {!message.sources && (
            <p className="mt-2 text-[10px] text-gray-400 italic">
              No source references returned for this answer.
            </p>
          )}

          {/* Demo label */}
          {message.isDemo && <DemoBadge />}

          {/* Copy button */}
          <div className="mt-3 flex justify-end">
            <CopyButton text={message.answer} />
          </div>
        </div>
        <p className="mt-1 text-[10px] text-gray-400">NyayaAI</p>
      </div>
    </div>
  )
}

/**
 * MessageList renders the conversation thread.
 */
export default function MessageList({ messages, isLoading, onRetry }) {
  return (
    <div className="flex flex-col gap-6 py-6 px-4 sm:px-6">
      {messages.map((msg) => {
        if (msg.role === 'user') {
          return <UserBubble key={msg.id} message={msg} />
        }
        if (msg.role === 'error') {
          return <ErrorBubble key={msg.id} message={msg} onRetry={onRetry} />
        }
        return <AssistantBubble key={msg.id} message={msg} />
      })}

      {isLoading && <LoadingBubble />}
    </div>
  )
}
