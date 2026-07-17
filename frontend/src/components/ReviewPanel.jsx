import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import {
  BotIcon,
  CopyIcon,
  DownloadIcon,
  CheckIcon,
  AlertIcon,
  RefreshIcon,
  SparkleIcon,
  PlayIcon,
} from './Icons'

function ReviewPanel({ review, loading, error, onReview, hasCode }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!review) return
    try {
      await navigator.clipboard.writeText(review)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API can fail on insecure contexts — fail silently, button just won't confirm.
    }
  }

  const handleDownload = () => {
    if (!review) return
    const blob = new Blob([review], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'code-review.md'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="panel review-panel">
      <div className="panel-header review-header">
        <div className="panel-header-left">
          <BotIcon width={16} height={16} />
          <span className="panel-title">AI Review</span>
        </div>

        <div className="panel-header-right">
          <button
            type="button"
            className="icon-button"
            onClick={handleCopy}
            disabled={!review}
            title="Copy review"
            aria-label="Copy review"
          >
            {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={handleDownload}
            disabled={!review}
            title="Download as Markdown"
            aria-label="Download as Markdown"
          >
            <DownloadIcon width={16} height={16} />
          </button>
        </div>
      </div>

      <div className="review-body">
        {loading && (
          <div className="state-block fade-in">
            <div className="skeleton-block">
              <div className="skeleton-line skeleton-line-wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line-short" />
              <div className="skeleton-card" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line-wide" />
            </div>
            <p className="typing-indicator">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              Generating review…
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="state-block fade-in error-state">
            <div className="state-icon error-icon">
              <AlertIcon width={28} height={28} />
            </div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button type="button" className="btn btn-secondary" onClick={onReview}>
              <RefreshIcon width={16} height={16} />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && review && (
          <div className="markdown-body fade-in-up">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {review}
            </ReactMarkdown>
          </div>
        )}

        {!loading && !error && !review && (
          <div className="state-block fade-in empty-state">
            <div className="state-icon empty-icon">
              <SparkleIcon width={28} height={28} />
            </div>
            <h3>No review yet</h3>
            <p>
              Write or paste some code on the left, then run a review to get
              instant, senior-level feedback powered by Gemini.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onReview}
              disabled={!hasCode}
            >
              <PlayIcon width={16} height={16} />
              Review My Code
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewPanel