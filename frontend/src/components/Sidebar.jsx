import { Plus, MessageSquare, Trash2, ChevronLeft, Clock } from 'lucide-react'
import Logo from './Logo.jsx'

function ConversationItem({ conversation, isActive, onClick, onDelete }) {
  const preview = conversation.messages.find((m) => m.role === 'user')?.text || 'New conversation'

  return (
    <div
      className={`group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
        isActive ? 'bg-navy-800 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <MessageSquare size={14} className={`mt-0.5 flex-shrink-0 ${isActive ? 'text-saffron-400' : 'text-gray-400'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-gray-700'}`}>
          {preview.length > 50 ? preview.slice(0, 50) + '…' : preview}
        </p>
        <p className={`text-[10px] mt-0.5 ${isActive ? 'text-white/50' : 'text-gray-400'}`}>
          {conversation.messages.filter((m) => m.role === 'assistant').length} answer(s)
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(conversation.id) }}
        className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-100 ${
          isActive ? 'hover:bg-white/20 text-white/60' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
        }`}
        title="Delete conversation"
        aria-label="Delete conversation"
      >
        <Trash2 size={12} />
      </button>
    </div>
  )
}

export default function Sidebar({ conversations, activeId, onNew, onSelect, onDelete, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 md:relative md:z-auto
          w-72 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        aria-label="Conversation sidebar"
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 pt-3 pb-2">
          <button
            id="new-chat-btn"
            onClick={onNew}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-navy-800 hover:bg-navy-700 text-white text-sm font-medium rounded-xl transition-all duration-150 active:scale-[0.98] shadow-sm"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {conversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <Clock size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No conversations yet.</p>
              <p className="text-[11px] text-gray-300 mt-1">Click "New Chat" to begin.</p>
            </div>
          ) : (
            <div className="space-y-0.5 mt-1">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeId}
                  onClick={() => onSelect(conv.id)}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 text-[10px] text-gray-400 text-center">
          Educational use only · Not legal advice
        </div>
      </aside>
    </>
  )
}
