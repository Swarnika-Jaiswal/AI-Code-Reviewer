import Editor from 'react-simple-code-editor'
import {
  PlayIcon,
  LoaderIcon,
  ClipboardPasteIcon,
  TrashIcon,
  ChevronDownIcon,
} from './Icons'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
]

function EditorPanel({
  code,
  setCode,
  language,
  setLanguage,
  highlight,
  onReview,
  onClear,
  onPaste,
  loading,
  counts,
}) {
  const canReview = code.trim().length > 0 && !loading

  return (
    <section className="panel editor-panel">
      <div className="panel-header">
        <div className="panel-header-left">
          <span className="filename-dot filename-dot-red" />
          <span className="filename-dot filename-dot-yellow" />
          <span className="filename-dot filename-dot-green" />
          <span className="panel-title">source.{language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'typescript' ? 'ts' : 'js'}</span>
        </div>

        <div className="panel-header-right">
          <div className="select-wrap">
            <select
              className="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon width={14} height={14} className="select-chevron" />
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onPaste}
            title="Paste from clipboard"
            aria-label="Paste from clipboard"
          >
            <ClipboardPasteIcon width={16} height={16} />
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={onClear}
            title="Clear editor"
            aria-label="Clear editor"
          >
            <TrashIcon width={16} height={16} />
          </button>
        </div>
      </div>

      <div className="editor-scroll">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={highlight}
          padding={20}
          tabSize={2}
          insertSpaces
          className="code-editor"
          textareaClassName="code-editor-textarea"
          placeholder="Paste or write your code here…"
        />
      </div>

      <div className="panel-footer">
        <div className="counters">
          <span className="counter-pill">{counts.lines} lines</span>
          <span className="counter-pill">{counts.words} words</span>
          <span className="counter-pill">{counts.chars} chars</span>
        </div>

        <div className="footer-actions">
          <span className="kbd-hint">
            <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to review
          </span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onReview}
            disabled={!canReview}
          >
            {loading ? (
              <>
                <LoaderIcon width={16} height={16} />
                Reviewing…
              </>
            ) : (
              <>
                <PlayIcon width={16} height={16} />
                Review Code
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

export default EditorPanel