import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import HomePage from './components/HomePage.jsx'
import ChatPage from './components/ChatPage.jsx'

/**
 * App — top-level router.
 * Two views: 'home' and 'chat'.
 * Transition from home → chat can carry an initial question.
 */
export default function App() {
  const [view, setView] = useState('home')
  const [initialQuestion, setInitialQuestion] = useState('')

  const openChat = (question = '') => {
    setInitialQuestion(question)
    setView('chat')
  }

  const goHome = () => {
    setView('home')
    setInitialQuestion('')
  }

  if (view === 'chat') {
    return (
      <ChatPage
        initialQuestion={initialQuestion}
        onGoHome={goHome}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onAskClick={() => openChat('')} />
      <HomePage onAskQuestion={openChat} />
    </div>
  )
}
