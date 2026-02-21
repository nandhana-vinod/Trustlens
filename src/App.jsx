import { useState, useCallback, useRef } from 'react'
import './App.css'
import { analyzeImageWithGemini, ENV_API_KEY } from './geminiApi'

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']

function App() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [apiKey, setApiKey] = useState(ENV_API_KEY || localStorage.getItem('gemini_api_key') || '')
  const [showApiKeyInput, setShowApiKeyInput] = useState(!ENV_API_KEY && !localStorage.getItem('gemini_api_key'))
  const fileInputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file) return
    if (!SUPPORTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a JPEG, PNG, WebP, GIF, or BMP image.')
      return
    }
    setError(null)
    setResult(null)
    setImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e) => {
    handleFile(e.target.files[0])
  }, [handleFile])

  const handleAnalyze = async () => {
    if (!image) return
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key first.')
      setShowApiKeyInput(true)
      return
    }

    setAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      const analysisResult = await analyzeImageWithGemini(image, apiKey.trim())
      setResult(analysisResult)
    } catch (err) {
      setError(err.message || 'Analysis failed. Please check your API key and try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim())
      setShowApiKeyInput(false)
      setError(null)
    }
  }

  const handleReset = () => {
    setImage(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getVerdict = () => {
    if (!result) return null
    const v = result.verdict?.toLowerCase()
    if (v?.includes('ai-generated') || v?.includes('ai generated')) return 'ai'
    if (v?.includes('modified') || v?.includes('manipulated') || v?.includes('edited')) return 'modified'
    if (v?.includes('authentic') || v?.includes('real') || v?.includes('genuine')) return 'authentic'
    return 'unknown'
  }

  const verdict = getVerdict()

  return (
    <div className="app">
      {/* Background orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-name">TrustLens</span>
            <span className="logo-tag">AI Authenticity Detector</span>
          </div>
        </div>
        <button className="api-key-btn" onClick={() => setShowApiKeyInput(!showApiKeyInput)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          API Key
        </button>
      </header>

      {/* API Key Panel */}
      {showApiKeyInput && (
        <div className="api-key-panel">
          <div className="api-key-content">
            <h3>🔑 Gemini API Key</h3>
            <p>Enter your <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio</a> API key to enable analysis.</p>
            <div className="api-key-input-row">
              <input
                type="password"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                className="api-key-input"
              />
              <button className="save-btn" onClick={handleSaveApiKey}>Save</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <div className="hero">
          <h1 className="hero-title">
            Detect <span className="gradient-text">AI-Generated</span> Images
          </h1>
          <p className="hero-subtitle">
            Upload any photo and our Gemini-powered AI will analyze it for signs of artificial generation or manipulation.
          </p>
        </div>

        <div className="workspace">
          {/* Upload Panel */}
          <div className="panel upload-panel">
            <div
              className={`drop-zone ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-image' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Uploaded" className="image-preview" />
                  <div className="image-overlay">
                    <button className="change-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                      Change Image
                    </button>
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); handleReset() }}>
                      Remove
                    </button>
                  </div>
                  {image && (
                    <div className="image-meta">
                      <span>{image.name}</span>
                      <span>{(image.size / 1024).toFixed(1)} KB</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="drop-content">
                  <div className="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3>Drop your image here</h3>
                  <p>or <span className="click-link">browse files</span></p>
                  <div className="format-tags">
                    {['JPEG', 'PNG', 'WebP', 'GIF', 'BMP'].map(f => (
                      <span key={f} className="format-tag">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />

            <button
              className={`analyze-btn ${analyzing ? 'loading' : ''}`}
              onClick={handleAnalyze}
              disabled={!image || analyzing}
            >
              {analyzing ? (
                <>
                  <div className="spinner" />
                  Analyzing with Gemini...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Analyze Image
                </>
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="panel results-panel">
            {!result && !error && !analyzing && (
              <div className="results-placeholder">
                <div className="placeholder-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Analysis Results</h3>
                <p>Upload an image and click Analyze to see whether it is AI-generated, modified, or authentic.</p>
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-dot ai-dot" />
                    AI-Generated Detection
                  </div>
                  <div className="feature-item">
                    <span className="feature-dot modified-dot" />
                    Manipulation Analysis
                  </div>
                  <div className="feature-item">
                    <span className="feature-dot authentic-dot" />
                    Authenticity Verification
                  </div>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="analyzing-state">
                <div className="scanning-animation">
                  <div className="scan-line" />
                  <div className="scan-grid">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="scan-cell" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
                <h3>Analyzing Image...</h3>
                <p>Gemini Flash 2.5 is examining your image for AI artifacts, manipulation traces, and authenticity markers.</p>
                <div className="progress-steps">
                  <div className="step active">Preprocessing</div>
                  <div className="step-arrow">→</div>
                  <div className="step active">AI Pattern Analysis</div>
                  <div className="step-arrow">→</div>
                  <div className="step">Verdict</div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3>Analysis Error</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={handleAnalyze} disabled={!image}>Retry</button>
              </div>
            )}

            {result && !analyzing && (
              <div className="results-content">
                <div className={`verdict-badge verdict-${verdict}`}>
                  <div className="verdict-icon">
                    {verdict === 'ai' && '🤖'}
                    {verdict === 'modified' && '✏️'}
                    {verdict === 'authentic' && '✅'}
                    {verdict === 'unknown' && '❓'}
                  </div>
                  <div className="verdict-text">
                    <div className="verdict-label">Verdict</div>
                    <div className="verdict-value">{result.verdict}</div>
                  </div>
                </div>

                {result.confidence && (
                  <div className="confidence-section">
                    <div className="confidence-header">
                      <span>Confidence</span>
                      <span className="confidence-value">{result.confidence}</span>
                    </div>
                    <div className="confidence-bar">
                      <div
                        className={`confidence-fill fill-${verdict}`}
                        style={{ width: result.confidence }}
                      />
                    </div>
                  </div>
                )}

                <div className="analysis-section">
                  <h4>Detailed Analysis</h4>
                  <p className="analysis-text">{result.analysis}</p>
                </div>

                {result.indicators && result.indicators.length > 0 && (
                  <div className="indicators-section">
                    <h4>Key Indicators</h4>
                    <ul className="indicators-list">
                      {result.indicators.map((indicator, i) => (
                        <li key={i} className={`indicator-item indicator-${verdict}`}>
                          <span className="indicator-bullet" />
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="new-analysis-btn" onClick={handleReset}>
                  Analyze Another Image
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Powered by <strong>Gemini Flash 2.5</strong> · TrustLens AI Detector</p>
      </footer>
    </div>
  )
}

export default App
