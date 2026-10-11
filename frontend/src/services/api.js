/**
 * NyayaAI API service
 *
 * Reads configuration from Vite env variables:
 *   VITE_API_BASE_URL  — base URL of the FastAPI backend
 *   VITE_DEMO_MODE     — "true" for sample demo answers; "false" for real backend
 */

import { DEMO_RESPONSES, getFallbackDemoResponse } from './demoData.js'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')
export const IS_DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE).toLowerCase() === 'true'

const TIMEOUT_MS = 45_000 // 45 seconds to account for Colab LLM generation

/**
 * Wraps fetch with an AbortController timeout.
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController()
  const timerId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    return response
  } finally {
    clearTimeout(timerId)
  }
}

/**
 * Sends a question to the real FastAPI backend:
 * POST ${VITE_API_BASE_URL}/ask
 * Body: { "question": "..." }
 */
async function askBackend(question) {
  const endpoint = `${API_BASE_URL}/ask`
  let response

  try {
    response = await fetchWithTimeout(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ question }),
      },
    )
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(
        `Request to ${endpoint} timed out after ${TIMEOUT_MS / 1000}s. Your backend may still be processing or downloading models.`
      )
    }

    const isLocalhost = API_BASE_URL.includes('127.0.0.1') || API_BASE_URL.includes('localhost')
    if (isLocalhost) {
      throw new Error(
        `Cannot connect to backend at ${API_BASE_URL}.\n\n` +
        `• If running Google Colab: 127.0.0.1 points to your local PC, not Colab! You must run a tunnel (e.g. ngrok or localtunnel) in Colab and set VITE_API_BASE_URL to that URL.\n` +
        `• If running locally: ensure your local server is running (e.g. 'python server.py').`
      )
    }

    throw new Error(
      `Could not reach the backend at ${API_BASE_URL}. ` +
      'Please verify that your server is running and the tunnel or network connection is active.'
    )
  }

  if (!response.ok) {
    let detail = ''
    try {
      const errorJson = await response.json()
      detail = errorJson.detail || errorJson.message || ''
    } catch {
      // not JSON error
    }
    throw new Error(
      `Backend returned HTTP ${response.status}${detail ? `: ${detail}` : ''}. Please check backend logs.`
    )
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Invalid response received from backend. Expected JSON object with an "answer" field.')
  }

  if (!data || typeof data.answer !== 'string') {
    throw new Error(
      'Unexpected response format from backend: response is missing the required "answer" string field.'
    )
  }

  return {
    question: data.question || question,
    answer: data.answer,
    sources: Array.isArray(data.sources) ? data.sources : (data.sources ? [data.sources] : null),
    isDemo: false,
  }
}

/**
 * Simulates a response in demo mode with sample labeled content.
 */
async function askDemo(question) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 600))

  const q = question.trim().toLowerCase()
  const match = DEMO_RESPONSES.find(({ keywords }) =>
    keywords.some((kw) => q.includes(kw.toLowerCase())),
  )

  return match
    ? { question, answer: match.answer, sources: match.sources, isDemo: true }
    : { question, answer: getFallbackDemoResponse(question), sources: null, isDemo: true }
}

/**
 * Main export:
 * - In demo mode: returns sample demo response (clearly labeled).
 * - In real mode: executes real POST /ask request; throws on error (never silently mocks).
 */
export async function askQuestion(question) {
  if (!question || !question.trim()) {
    throw new Error('Please enter a question before submitting.')
  }

  if (IS_DEMO_MODE) {
    return askDemo(question)
  }

  return askBackend(question)
}
