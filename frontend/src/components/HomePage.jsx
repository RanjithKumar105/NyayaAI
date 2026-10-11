import { ArrowRight, BookOpen, Shield, Scale } from 'lucide-react'
import { SUGGESTED_QUESTIONS, HOW_IT_WORKS_STEPS } from '../constants.js'
import Logo from './Logo.jsx'

function SuggestedCard({ question, onClick }) {
  return (
    <button
      id={`suggestion-${question.id}`}
      onClick={() => onClick(question.text)}
      className="group text-left p-4 bg-white border border-gray-200 rounded-xl shadow-card hover:shadow-card-md hover:border-navy-300 hover:bg-navy-50 transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">{question.icon}</span>
        <div>
          <span className="inline-block mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded-full">
            {question.tag}
          </span>
          <p className="text-sm text-gray-700 leading-snug group-hover:text-navy-800 font-medium transition-colors">
            {question.text}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-navy-600 opacity-0 group-hover:opacity-100 transition-opacity">
        Ask this question <ArrowRight size={12} />
      </div>
    </button>
  )
}

function HowItWorksStep({ step }) {
  return (
    <div className="relative flex flex-col items-center text-center p-6">
      <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mb-4 shadow-card-md">
        <span className="text-2xl">{step.icon}</span>
      </div>
      <span className="absolute top-4 right-4 text-xs font-bold text-gray-200 font-mono">{step.step}</span>
      <h3 className="font-semibold text-navy-800 text-base mb-2">{step.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
    </div>
  )
}

export default function HomePage({ onAskQuestion }) {
  return (
    <main>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-navy-700 pt-24 pb-28 px-4">
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron-500 opacity-5 blur-3xl" />
          <div className="absolute bottom-0 -left-12 w-72 h-72 rounded-full bg-navy-400 opacity-10 blur-2xl" />
          {/* Ashoka wheel subtle background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white opacity-[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white opacity-[0.04]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white/80 mb-8 backdrop-blur-sm">
            <Scale size={14} className="text-saffron-400" />
            Powered by RAG · Grounded in the Official Constitution
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-balance mb-6">
            Understand the<br />
            <span className="text-saffron-400">Constitution</span> of India.
          </h1>

          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Explore constitutional articles, fundamental rights, and legal provisions — explained in clear, accessible language with references to official sources.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              id="hero-ask-btn"
              href="#ask"
              onClick={(e) => { e.preventDefault(); onAskQuestion('') }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-saffron-500 hover:bg-saffron-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-sm"
            >
              Ask NyayaAI
              <ArrowRight size={16} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-all duration-200 text-sm backdrop-blur-sm"
            >
              <BookOpen size={15} />
              How It Works
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/50 text-xs">
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-saffron-400" />
              Grounded in the official Constitution PDF
            </div>
            <div className="flex items-center gap-1.5">
              <Scale size={12} className="text-saffron-400" />
              Educational use · Not legal advice
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen size={12} className="text-saffron-400" />
              Sources cited with page references
            </div>
          </div>
        </div>
      </section>

      {/* ── Suggested Questions ─────────────────────────────── */}
      <section id="ask" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy-800 mb-3">
              Explore the Constitution
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Click any question below to ask NyayaAI, or type your own question in the chat interface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUGGESTED_QUESTIONS.map((q) => (
              <SuggestedCard key={q.id} question={q} onClick={onAskQuestion} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl font-bold text-navy-800 mb-3">
              How NyayaAI Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              NyayaAI uses Retrieval-Augmented Generation (RAG) to ground every answer in the actual text of the Constitution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[3.5rem] left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-navy-100 via-saffron-300 to-navy-100" />
            {HOW_IT_WORKS_STEPS.map((step) => (
              <HowItWorksStep key={step.step} step={step} />
            ))}
          </div>

          {/* Technical note */}
          <div className="mt-10 p-6 bg-navy-50 border border-navy-100 rounded-2xl">
            <h3 className="font-semibold text-navy-800 text-sm mb-2">Technical Details</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              The backend uses a ChromaDB vector store to index the Constitution of India PDF. At query time, semantically similar chunks are retrieved and passed to a language model along with the user's question. The model generates an answer that is grounded only in the retrieved text — it does not invent articles, sections, or quotations.
            </p>
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────── */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy-800 mb-5">About NyayaAI</h2>
          <p className="text-gray-600 leading-relaxed mb-4 text-sm">
            <strong className="text-navy-800">NyayaAI</strong> (from Sanskrit <em>Nyāya</em> — justice, logic) is an AI-powered educational tool that makes the Constitution of India accessible to every citizen. Using RAG technology, it retrieves relevant constitutional text and provides clear, plain-language explanations.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Built with a FastAPI backend, ChromaDB vector database, and a modern React frontend. Designed to bridge the gap between complex constitutional language and everyday understanding.
          </p>
        </div>
      </section>

      {/* ── Disclaimer ──────────────────────────────────────── */}
      <section id="disclaimer" className="py-16 px-4 bg-amber-50 border-t border-amber-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <Shield size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-amber-900 text-base mb-2">Legal Disclaimer</h2>
              <div className="text-sm text-amber-800 space-y-2 leading-relaxed">
                <p>
                  NyayaAI is an <strong>educational tool</strong> designed to help users understand the Constitution of India. The information provided is for general educational purposes only and does not constitute legal advice.
                </p>
                <p>
                  For important legal matters, always consult a qualified legal professional and verify information against the <strong>official Constitution of India</strong> published by the Government of India.
                </p>
                <p>
                  NyayaAI may make errors. The AI system is not a substitute for a qualified lawyer. Do not rely solely on NyayaAI for any legal decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="py-8 px-4 bg-navy-950 text-center">
        <Logo size="sm" showText={true} />
        <p className="mt-4 text-xs text-white/30">
          © {new Date().getFullYear()} NyayaAI. Educational use only. Not legal advice.
        </p>
        <p className="mt-1 text-xs text-white/20">
          Constitution data sourced from the official Government of India publication.
        </p>
      </footer>
    </main>
  )
}
