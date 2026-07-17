import { useEffect, useMemo, useState, useCallback } from 'react'
import axios from 'axios'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-java'
import 'prismjs/themes/prism-tomorrow.css'

import Navbar from './components/Navbar'
import EditorPanel from './components/EditorPanel'
import ReviewPanel from './components/ReviewPanel'

import './App.css'

// During `npm run dev`, requests to /ai/* are proxied to the backend by
// vite.config.js, so no CORS setup is required and no backend files are
// touched. For a production build, point this at your deployed API via
// a VITE_API_BASE_URL env var (falls back to same-origin "").
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({ baseURL: API_BASE_URL })

const DEFAULT_CODE = `function sum(a, b) {
  return a + b
}`

const PRISM_LANGUAGE_MAP = {
  javascript: Prism.languages.javascript,
  typescript: Prism.languages.typescript,
  python: Prism.languages.python,
  java: Prism.languages.java,
  cpp: Prism.languages.cpp,
}

function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [language, setLanguage] = useState('javascript')
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')

  // Lightweight backend health check — purely informational for the status
  // badge in the navbar. Does not touch or assume any backend route beyond
  // the existing `GET /`.
  useEffect(() => {
    let cancelled = false

    api
      .get('/')
      .then(() => {
        if (!cancelled) setBackendStatus('online')
      })
      .catch(() => {
        if (!cancelled) setBackendStatus('offline')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const highlight = useCallback(
    (value) => {
      const grammar = PRISM_LANGUAGE_MAP[language] || Prism.languages.javascript
      return Prism.highlight(value, grammar, language)
    },
    [language],
  )

  const counts = useMemo(() => {
    const chars = code.length
    const lines = code.length === 0 ? 0 : code.split('\n').length
    const words = code.trim().length === 0 ? 0 : code.trim().split(/\s+/).length
    return { chars, lines, words }
  }, [code])

  const handleReview = useCallback(async () => {
    if (!code.trim() || loading) return

    setLoading(true)
    setError(null)

    try {
      // Same request contract as before: POST /ai/get-review with { code }.
      const response = await api.post('/ai/get-review', { code })
      const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      setReview(data)
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'The review request failed. Please try again.'
      setError(typeof message === 'string' ? message : 'The review request failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [code, loading])

  const handleClear = useCallback(() => {
    setCode('')
    setReview(null)
    setError(null)
  }, [])

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setCode(text)
    } catch {
      // Clipboard read can be blocked by browser permissions — ignore silently.
    }
  }, [])

  // Ctrl/Cmd + Enter triggers a review from anywhere on the page.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleReview()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleReview])

  return (
    <div className="app-shell">
      <Navbar status={backendStatus} />

      <main className="main-grid">
        <EditorPanel
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          highlight={highlight}
          onReview={handleReview}
          onClear={handleClear}
          onPaste={handlePaste}
          loading={loading}
          counts={counts}
        />

        <ReviewPanel
          review={review}
          loading={loading}
          error={error}
          onReview={handleReview}
          hasCode={code.trim().length > 0}
        />
      </main>
    </div>
  )
}

export default App
