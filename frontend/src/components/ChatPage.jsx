import { useState, useRef, useEffect, useCallback } from 'react'
import { Menu, Trash2, Home, FlaskConical, Wifi, WifiOff } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import MessageList from './MessageList.jsx'
import ChatInput from './ChatInput.jsx'
import { SUGGESTED_QUESTIONS } from '../constants.js'
import { askQuestion, IS_DEMO_MODE } from '../services/api.js'

let msgIdCounter = 0
const newId = () => `msg-${++msgIdCounter}`

let convIdCounter = 0
const newConvId = () => `conv-${++convIdCounter}`

function EmptyState({ onSuggestion }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-16 h-16 bg-navy-50 border border-navy-100 rounded-2xl flex items-center justify-center mb-5">
        <span className="text-3xl">⚖️</span>
      </div>
      <h2 className="font-serif text-xl font-bold text-navy-800 mb-2">Ask NyayaAI</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
        Ask any question about the Constitution of India — articles, rights, duties, and more.
      </p>

      <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
          <button
            key={q.id}
            id={`chat-suggestion-${q.id}`}
            onClick={() => onSuggestion(q.text)}
            className="group text-left px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 hover:border-navy-300 hover:text-navy-800 hover:bg-navy-50 transition-all duration-150 shadow-card active:scale-[0.98]"
          >
            <span className="mr-1.5">{q.icon}</span>
            {q.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ChatPage({ initialQuestion, onGoHome }) {
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const bottomRef = useRef(null)
  const initialQuestionSent = useRef(false)

  // Get the active conversation object
  const activeConv = conversations.find((c) => c.id === activeConvId)
  const messages = activeConv?.messages || []

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Create a new conversation
  const createNewConversation = useCallback(() => {
    const id = newConvId()
    setConversations((prev) => [{ id, messages: [] }, ...prev])
    setActiveConvId(id)
    setInputValue('')
    return id
  }, [])

  // Ensure there's an active conversation on mount
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Send the initialQuestion once (if provided from home page click)
  useEffect(() => {
    if (initialQuestion && !initialQuestionSent.current && activeConvId) {
      initialQuestionSent.current = true
      sendMessage(initialQuestion)
    }
  }, [initialQuestion, activeConvId]) // eslint-disable-line react-hooks/exhaustive-deps

  const addMessage = (convId, message) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, messages: [...c.messages, message] } : c,
      ),
    )
  }

  const sendMessage = useCallback(async (questionText) => {
    const q = (questionText ?? inputValue).trim()
    if (!q || isLoading) return

    // Ensure there's an active conversation
    let convId = activeConvId
    if (!convId) {
      convId = createNewConversation()
    }

    setInputValue('')
    setIsLoading(true)

    // Add user message
    const userMsg = { id: newId(), role: 'user', text: q }
    addMessage(convId, userMsg)

    try {
      const result = await askQuestion(q)
      const assistantMsg = {
        id: newId(),
        role: 'assistant',
        answer: result.answer,
        sources: result.sources,
        isDemo: result.isDemo || false,
      }
      addMessage(convId, assistantMsg)
    } catch (err) {
      const errorMsg = {
        id: newId(),
        role: 'error',
        error: err.message,
        originalQuestion: q,
      }
      addMessage(convId, errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, activeConvId, createNewConversation])

  const handleRetry = useCallback((question) => {
    sendMessage(question)
  }, [sendMessage])

  const handleNewChat = () => {
    createNewConversation()
    setSidebarOpen(false)
  }

  const handleSelectConv = (id) => {
    setActiveConvId(id)
    setSidebarOpen(false)
  }

  const handleDeleteConv = (id) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id)
      if (activeConvId === id) {
        if (updated.length > 0) {
          setActiveConvId(updated[0].id)
        } else {
          // Create a fresh one
          const freshId = newConvId()
          setTimeout(() => {
            setConversations((p) => [{ id: freshId, messages: [] }, ...p])
            setActiveConvId(freshId)
          }, 0)
        }
      }
      return updated
    })
  }

  const handleClearChat = () => {
    if (!activeConvId) return
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, messages: [] } : c)),
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeConvId}
        onNew={handleNewChat}
        onSelect={handleSelectConv}
        onDelete={handleDeleteConv}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Chat header */}
        <header className="flex items-center gap-3 px-4 sm:px-6 py-3.5 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          {/* Mobile: sidebar toggle */}
          <button
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-navy-800 hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-navy-800 text-sm truncate">
              {messages.length > 0
                ? messages.find((m) => m.role === 'user')?.text?.slice(0, 60) + (messages.find((m) => m.role === 'user')?.text?.length > 60 ? '…' : '')
                : 'NyayaAI — Constitution Assistant'}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Demo / Live badge */}
            {IS_DEMO_MODE ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-saffron-50 text-saffron-700 border border-saffron-200 rounded-full text-[11px] font-medium">
                <FlaskConical size={11} />
                Demo
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-medium">
                <Wifi size={11} />
                Live
              </span>
            )}

            {/* Clear chat */}
            {messages.length > 0 && (
              <button
                id="clear-chat-btn"
                onClick={handleClearChat}
                title="Clear chat"
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 size={16} />
              </button>
            )}

            {/* Go home */}
            <button
              id="go-home-btn"
              onClick={onGoHome}
              title="Go to home page"
              className="p-2 rounded-lg text-gray-400 hover:text-navy-800 hover:bg-gray-100 transition-colors"
              aria-label="Go to home page"
            >
              <Home size={16} />
            </button>
          </div>
        </header>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isLoading ? (
            <EmptyState onSuggestion={(q) => sendMessage(q)} />
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onRetry={handleRetry}
              />
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => sendMessage()}
          isLoading={isLoading}
          disabled={false}
        />
      </div>
    </div>
  )
}
