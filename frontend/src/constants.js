/**
 * Shared constants — suggested questions, navigation links, etc.
 */

export const SUGGESTED_QUESTIONS = [
  {
    id: 'sq1',
    text: 'Explain Article 14 in simple English.',
    icon: '⚖️',
    tag: 'Right to Equality',
  },
  {
    id: 'sq2',
    text: 'What are the Fundamental Rights?',
    icon: '🏛️',
    tag: 'Part III',
  },
  {
    id: 'sq3',
    text: 'Explain Article 21 — Right to Life and Personal Liberty.',
    icon: '🕊️',
    tag: 'Life & Liberty',
  },
  {
    id: 'sq4',
    text: 'What is Article 32 and what writs can the Supreme Court issue?',
    icon: '🔨',
    tag: 'Constitutional Remedies',
  },
  {
    id: 'sq5',
    text: 'What are the Directive Principles of State Policy?',
    icon: '📜',
    tag: 'Part IV',
  },
  {
    id: 'sq6',
    text: 'What are the Fundamental Duties of citizens?',
    icon: '🤝',
    tag: 'Article 51A',
  },
]

export const NAV_LINKS = [
  { id: 'home',       label: 'Home',       href: '#home' },
  { id: 'ask',        label: 'Ask NyayaAI', href: '#ask' },
  { id: 'how',        label: 'How It Works', href: '#how-it-works' },
  { id: 'about',      label: 'About',       href: '#about' },
  { id: 'disclaimer', label: 'Disclaimer',  href: '#disclaimer' },
]

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Ask Your Question',
    description: 'Type your question about any article, right, or provision of the Indian Constitution in plain language.',
    icon: '💬',
  },
  {
    step: '02',
    title: 'Retrieve Relevant Text',
    description: 'NyayaAI searches the official Constitution PDF using semantic similarity to find the most relevant passages.',
    icon: '🔍',
  },
  {
    step: '03',
    title: 'Generate a Clear Answer',
    description: 'A language model synthesises the retrieved text into a clear, accurate answer with source page references.',
    icon: '✨',
  },
]
