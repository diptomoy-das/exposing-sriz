import { useState, useRef, useCallback } from 'react'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const handlePlaySound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sound.mp3')
      audioRef.current.volume = 1.0
      audioRef.current.addEventListener('ended', () => setIsPlaying(false))
    }

    if (isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    } else {
      audioRef.current.volume = 1.0
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isPlaying])

  return (
    <>
      {/* Film grain overlay */}
      <div className="grain" aria-hidden="true"></div>

      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="hero">
        <div className="hero__scanline" aria-hidden="true"></div>

        <div className="hero__image-wrapper">
          <img
            className="hero__image"
            src="/hero.jpg"
            alt="Meyebaj Hero"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="hero__overlay" aria-hidden="true"></div>
        <div className="hero__vignette" aria-hidden="true"></div>

        <div className="hero__content">
          <p className="hero__subtitle">MEYEBAJ • THE TRUTH WILL BE REVEALED</p>
          <h1 className="hero__title">
            <span>EXPOSING SRIZ DEBNATH</span>
          </h1>
          <p className="hero__tagline">
            Every secret has an expiration date. Every mask eventually falls.
            The countdown has begun.
          </p>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <div className="divider"></div>

      <section className="content-section" id="about">
        <span className="section-badge">About</span>
        <h2 className="section-title">What Is Meyebaj?</h2>
        <p className="section-text">
          Meyebaj is the reckoning — a force that strips away the façade and
          lays bare the truth hiding in plain sight. It doesn't ask for
          permission, and it doesn't wait for the right moment. When the
          evidence speaks, Meyebaj amplifies it.
        </p>
        <p className="section-text">
          This is not a witch hunt. This is accountability. Every claim backed
          by proof. Every allegation grounded in reality. The era of unchecked
          deception ends here.
        </p>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section" id="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Transparency</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Lies Tolerated</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Receipts Collected</div>
          </div>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="quote-section" id="quote">
        <p className="quote-text">
          Meyebaj doesn't destroy reputations — it reveals who built them on lies.
        </p>
        <p className="quote-attribution">— Meyebaj</p>
      </section>

      <div className="divider"></div>

      {/* ===== VIDEO SECTION ===== */}
      <section className="video-section" id="video">
        <div className="video-container">
          <span className="section-badge">Confidential Footage</span>
          <h2 className="section-title">WATCH THIS VIDEO TO KNOW MORE</h2>
          <p className="video-description">
            Uncut footage and recorded testimony detailing the timeline of events.
            Click below to play the audio tape in full volume.
          </p>

          <div className="video-player-frame">
            <div className="video-rec-badge" aria-hidden="true">
              <span className="video-rec-dot"></span> REC • EVIDENCE FILE #0764
            </div>

            <img
              src="/hero.jpg"
              alt="Investigation Video Thumbnail"
              className="video-thumbnail-img"
            />
            <div className="video-thumbnail-overlay" aria-hidden="true"></div>

            <div className="video-btn-center">
              <button
                className={`play-btn ${isPlaying ? 'play-btn--playing' : ''}`}
                onClick={handlePlaySound}
                id="play-sound-btn"
                aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
              >
                {isPlaying ? (
                  <>
                    <svg className="play-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    STOP AUDIO
                    <div className="visualizer" aria-hidden="true">
                      <div className="visualizer__bar"></div>
                      <div className="visualizer__bar"></div>
                      <div className="visualizer__bar"></div>
                      <div className="visualizer__bar"></div>
                      <div className="visualizer__bar"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <svg className="play-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5.14v14.72a1 1 0 0 0 1.5.86l11-7.36a1 1 0 0 0 0-1.72l-11-7.36A1 1 0 0 0 8 5.14z" />
                    </svg>
                    PLAY MEYEBAJ AUDIO
                  </>
                )}
              </button>
            </div>

            <div className="video-overlay-bar">
              <span className="video-timestamp">
                {isPlaying ? 'PLAYING AUDIO (100% VOL)' : '00:04:12 / 12:45'}
              </span>
              <span className="video-tag">1080P • LEAKED FOOTAGE</span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer__brand">MEYEBAJ</div>
        <p className="footer__text">The truth needs no defence.</p>
      </footer>
    </>
  )
}

export default App
