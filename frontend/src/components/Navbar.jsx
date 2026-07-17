import { SparkleIcon } from './Icons'

/**
 * Top navigation bar.
 * `status` is one of: 'checking' | 'online' | 'offline'
 */
function Navbar({ status }) {
  const statusConfig = {
    checking: { label: 'Connecting…', className: 'checking' },
    online: { label: 'Backend Online', className: 'online' },
    offline: { label: 'Backend Offline', className: 'offline' },
  }

  const current = statusConfig[status] || statusConfig.checking

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo-mark">
          <SparkleIcon width={20} height={20} />
        </div>
        <div className="logo-text">
          <span className="logo-title">AI Code Reviewer</span>
          <span className="logo-subtitle">Instant, senior-level code feedback</span>
        </div>
      </div>

      <div className="navbar-right">
        <span className="badge badge-model">
          <SparkleIcon width={14} height={14} />
          Gemini
        </span>

        <span className={`badge badge-status ${current.className}`}>
          <span className="status-dot" />
          {current.label}
        </span>
      </div>
    </header>
  )
}

export default Navbar