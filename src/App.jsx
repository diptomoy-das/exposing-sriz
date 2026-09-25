import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

function isMobileDevice() {
  return (
    typeof window !== 'undefined' &&
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= 768 ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))
  )
}

function enterFullscreenMode() {
  const elem = document.documentElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(() => {})
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
}

function exitFullscreenMode() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const audioCtxRef = useRef(null)
  const gainNodeRef = useRef(null)

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    exitFullscreenMode()
    document.body.style.overflow = ''
  }, [])

  const handlePlaySound = useCallback(() => {
    const isMobile = isMobileDevice()
    const targetGain = isMobile ? 25.0 : 15.0 // 2500% volume for phone speakers

    if (!audioRef.current) {
      const audio = new Audio('/sound.mp3')
      audio.crossOrigin = 'anonymous'
      audio.volume = 1.0
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        exitFullscreenMode()
        document.body.style.overflow = ''
      })
      audioRef.current = audio

      // Web Audio API setup with Compressor + Gain for extreme phone volume
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass) {
        try {
          const ctx = new AudioContextClass()
          const source = ctx.createMediaElementSource(audio)

          // Dynamic compressor acting as loudness maximizer for mobile speakers
          const compressor = ctx.createDynamicsCompressor()
          compressor.threshold.setValueAtTime(-24, ctx.currentTime)
          compressor.knee.setValueAtTime(30, ctx.currentTime)
          compressor.ratio.setValueAtTime(12, ctx.currentTime)
          compressor.attack.setValueAtTime(0.003, ctx.currentTime)
          compressor.release.setValueAtTime(0.25, ctx.currentTime)

          const gainNode = ctx.createGain()
          gainNode.gain.setValueAtTime(targetGain, ctx.currentTime)

          source.connect(compressor)
          compressor.connect(gainNode)
          gainNode.connect(ctx.destination)

          audioCtxRef.current = ctx
          gainNodeRef.current = gainNode
        } catch {
          // Fallback to standard volume if audio context fails
        }
      }
    }

    if (isPlaying) {
      stopPlayback()
    } else {
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume()
        }
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(targetGain, audioCtxRef.current?.currentTime || 0)
      }
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
      document.body.style.overflow = 'hidden'
      enterFullscreenMode()
    }
  }, [isPlaying, stopPlayback])

  useEffect(() => {
    const onFullscreenChange = () => {
      const isFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement)
      if (!isFullscreen && isPlaying) {
        stopPlayback()
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }
  }, [isPlaying, stopPlayback])

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
          <div className="hero__giant-text" aria-label="Meyebaj">
            MEYEBAJ
          </div>
        </div>
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
                aria-label={isPlaying ? 'Stop call recordings' : 'Hear call recordings'}
              >
                {isPlaying ? (
                  <>
                    <svg className="play-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    STOP RECORDINGS
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
                    HEAR CALL RECORDINGS
                  </>
                )}
              </button>
            </div>

            <div className="video-overlay-bar">
              <span className="video-timestamp">
                {isPlaying ? 'PLAYING AUDIO (MAX BOOSTED)' : '00:04:12 / 12:45'}
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

      {/* ===== FULLSCREEN FREEZE (SHOWS ONLY HERO.JPG) ===== */}
      {isPlaying && (
        <div
          className="fullscreen-freeze"
          onClick={handlePlaySound}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen hero image"
        >
          <img
            src="/hero.jpg"
            alt="Hero Fullscreen Freeze"
            className="fullscreen-freeze__img"
          />
        </div>
      )}
    </>
  )
}

export default App
