import { useEffect, useMemo, useRef, useState } from "react";
import { Settings, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Share2, SkipForward } from "lucide-react";
import "./custom-video.css";

function extractYouTubeId(input?: string) {
  if (!input) return "";
  const clean = input.trim();
  const idMatch = clean.match(/[A-Za-z0-9_-]{11}/);
  if (idMatch) return idMatch[0];
  try {
    const url = new URL(clean);
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
    }
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1);
    }
  } catch {}
  return clean;
}

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady?: () => void }
}

function formatTime(sec: number) {
  if (!isFinite(sec)) return "0:00";
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  const m = Math.floor((sec / 60) % 60).toString();
  const h = Math.floor(sec / 3600);
  return h > 0 ? `${h}:${m.padStart(2, "0")}:${s}` : `${m}:${s}`;
}

type Props = {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  nextVideoId?: string;
  onNext?: (id: string) => void;
};

export default function CustomVideo({ videoId, title = "", autoplay = false, nextVideoId, onNext }: Props) {
  const id = useMemo(() => extractYouTubeId(videoId), [videoId]);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hoverTimer, setHoverTimer] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rates, setRates] = useState<number[]>([0.25, 0.5, 1, 1.25, 1.5, 2]);
  const [rate, setRate] = useState<number>(1);
  const [qualities, setQualities] = useState<string[]>([]);
  const [quality, setQuality] = useState<string>("");
  const barRef = useRef<HTMLDivElement>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const [resumeTime, setResumeTime] = useState<number | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let disposed = false;
    function create() {
      if (disposed) return;
      playerRef.current = new window.YT.Player(containerRef.current!.querySelector(".cv-iframe-host") as HTMLElement, {
        height: "100%",
        width: "100%",
        videoId: id,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          fs: 0,
        },
        events: {
          onReady: () => {
            setReady(true);
            setDuration(playerRef.current.getDuration());
            setMuted(playerRef.current.isMuted());
            // Autoplay if requested (may be blocked by browser policies)
            if (autoplay) {
              try { playerRef.current.playVideo(); } catch {}
            }
            // Resume point from localStorage
            try {
              const key = `cv:resume:${id}`;
              const sec = Number(localStorage.getItem(key) || "0");
              if (sec > 5 && isFinite(sec)) {
                setResumeTime(sec);
                setShowResume(true);
              }
            } catch {}
          },
          onStateChange: (e: any) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.PLAYING) { setPlaying(true); setEnded(false); setBuffering(false); }
            else if (e.data === YT.PlayerState.PAUSED) { setPlaying(false); setBuffering(false); }
            else if (e.data === YT.PlayerState.ENDED) {
              setPlaying(false); setEnded(true); setBuffering(false);
              // Immediately reset to start and pause to avoid YouTube suggestion overlay
              try { playerRef.current.seekTo(0, true); playerRef.current.pauseVideo(); } catch {}
              try { localStorage.removeItem(`cv:resume:${id}`); } catch {}
            }
            else if (e.data === YT.PlayerState.BUFFERING) { setBuffering(true); }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      create();
    } else {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(s);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); create(); };
    }

    const idInt = window.setInterval(() => {
      try {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          setCurrent(playerRef.current.getCurrentTime());
          setDuration(playerRef.current.getDuration());
          try {
            const availRates = playerRef.current.getAvailablePlaybackRates?.();
            if (availRates && availRates.length) setRates(availRates);
            const curRate = playerRef.current.getPlaybackRate?.();
            if (curRate) setRate(curRate);
            const qLevels = playerRef.current.getAvailableQualityLevels?.();
            if (qLevels && qLevels.length) setQualities(qLevels);
            const curQ = playerRef.current.getPlaybackQuality?.();
            if (curQ) setQuality(curQ);
            // Persist resume position periodically
            try {
              if (!ended) {
                const key = `cv:resume:${id}`;
                localStorage.setItem(key, String(playerRef.current.getCurrentTime()));
              }
            } catch {}
          } catch {}
        }
      } catch {}
    }, 500);

    return () => {
      disposed = true;
      window.clearInterval(idInt);
      try { playerRef.current?.destroy?.(); } catch {}
    };
  }, [id]);

  const togglePlay = () => {
    if (!ready || !playerRef.current) return;
    if (ended) { playerRef.current.seekTo(0, true); setEnded(false); }
    if (playing) playerRef.current.pauseVideo(); else playerRef.current.playVideo();
  };
  const toggleMute = () => {
    if (!ready || !playerRef.current) return;
    if (muted) { playerRef.current.unMute(); setMuted(false); } else { playerRef.current.mute(); setMuted(true); }
  };
  const onSeek = (pct: number) => {
    if (!ready || !playerRef.current || !duration) return;
    playerRef.current.seekTo((pct / 100) * duration, true);
  };
  const goFullscreen = () => {
    const el = containerRef.current;
    el?.requestFullscreen?.();
  };

  const onResume = () => {
    if (resumeTime && ready && playerRef.current) {
      try { playerRef.current.seekTo(resumeTime, true); playerRef.current.playVideo(); } catch {}
      setShowResume(false);
    }
  };
  const onDismissResume = () => setShowResume(false);

  const share = async () => {
    try {
      const shareUrl = `${window.location.origin}/v/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  const onNextClick = () => {
    if (!nextVideoId) return;
    const nextId = extractYouTubeId(nextVideoId);
    try { onNext?.(nextId); } catch {}
    // If no handler, reload player in-place
    if (playerRef.current && nextId) {
      try {
        playerRef.current.loadVideoById(nextId);
        setShowResume(false);
        setResumeTime(null);
      } catch {}
    }
  };

  const percent = duration ? (current / duration) * 100 : 0;

  const onMouseMove = () => {
    setShowControls(true);
    if (hoverTimer) window.clearTimeout(hoverTimer);
    setHoverTimer(window.setTimeout(() => setShowControls(false), 2000));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const within = containerRef.current.contains(document.activeElement) || document.activeElement === document.body;
      if (!within) return;
      if (e.key === " " || e.code === "Space") { e.preventDefault(); togglePlay(); }
      else if (e.key === "m" || e.key === "M") { toggleMute(); }
      else if (e.key === "f" || e.key === "F") { goFullscreen(); }
      else if (e.key === "ArrowRight") { onSeek(Math.min(100, ((current + 5) / (duration || 1)) * 100)); }
      else if (e.key === "ArrowLeft") { onSeek(Math.max(0, ((current - 5) / (duration || 1)) * 100)); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, duration, ready, playing]);

  const onBarMouseMove = (e: React.MouseEvent) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const p = (x / rect.width) * 100;
    setHoverPct(p);
  };
  const onBarLeave = () => setHoverPct(null);
  const onBarClick = (e: React.MouseEvent) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const p = (x / rect.width) * 100;
    onSeek(p);
  };

  const setPlaybackRate = (r: number) => {
    try { playerRef.current?.setPlaybackRate?.(r); setRate(r); } catch {}
  };
  const setPlaybackQuality = (q: string) => {
    try { playerRef.current?.setPlaybackQuality?.(q); setQuality(q); } catch {}
  };

  return (
    <div className="cv-container" ref={containerRef} onMouseMove={onMouseMove}>
      {/* {(title || nextVideoId) && (
        <div className="cv-header">
          <div className="cv-title" title={title}>{title}</div>
          <div className="cv-actions">
            <button className="cv-btn" onClick={share} aria-label="Share"><Share2 size={16} /></button>
            {nextVideoId && (
              <button className="cv-btn" onClick={onNextClick} aria-label="Next"><SkipForward size={16} /></button>
            )}
          </div>
        </div>
      )} */}
      <div className="cv-player" onDoubleClick={goFullscreen}>
        <div className="cv-iframe-host" />
        {showResume && resumeTime != null && (
          <div className="cv-resume">
            <div className="cv-resume-card">
              <div className="cv-resume-title">Resume playback?</div>
              <div className="cv-resume-sub">Continue from {formatTime(resumeTime)}.</div>
              <div className="cv-resume-actions">
                <button className="cv-btn" onClick={onResume} aria-label="Resume">Resume</button>
                <button className="cv-btn" onClick={onDismissResume} aria-label="Start Over">Start Over</button>
              </div>
            </div>
          </div>
        )}
        {(ended || !playing) && (
          <button className="cv-bigplay" onClick={togglePlay} aria-label={ended ? "Replay" : "Play"}>
            {ended ? <RotateCcw size={44} /> : <Play size={44} />}
          </button>
        )}
        {buffering && <div className="cv-spinner" aria-label="Buffering" />}
        {showControls && (
          <div className="cv-controls">
            <button className="cv-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="cv-timeline" onMouseMove={onBarMouseMove} onMouseLeave={onBarLeave} onClick={onBarClick}>
              <div className="cv-bar" ref={barRef}>
                <div className="cv-bar-bg" />
                <div className="cv-bar-fill" style={{ width: `${percent}%` }} />
                {hoverPct != null && (
                  <div className="cv-tooltip" style={{ left: `${hoverPct}%` }}>
                    {formatTime((hoverPct / 100) * duration)}
                  </div>
                )}
              </div>
            </div>
            <div className="cv-time">{formatTime(current)} / {formatTime(duration)}</div>
            <button className="cv-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button className="cv-btn" onClick={share} aria-label="Share">
              <Share2 size={18} />
            </button>
            {nextVideoId && (
              <button className="cv-btn" onClick={onNextClick} aria-label="Next">
                <SkipForward size={18} />
              </button>
            )}
            <div className="cv-settings-wrap">
              <button className="cv-btn" aria-label="Settings" onClick={() => setShowSettings(s => !s)}><Settings size={18} /></button>
              {showSettings && (
                <div className="cv-settings">
                  <div className="cv-settings-section">
                    <div className="cv-settings-title">Speed</div>
                    <div className="cv-settings-list">
                      {rates.map((r) => (
                        <button key={r} className={`cv-settings-item ${r===rate?"active":""}`} onClick={() => setPlaybackRate(r)}>{r}x</button>
                      ))}
                    </div>
                  </div>
                  {qualities.length > 0 && (
                    <div className="cv-settings-section">
                      <div className="cv-settings-title">Quality</div>
                      <div className="cv-settings-list">
                        {qualities.map((q) => (
                          <button key={q} className={`cv-settings-item ${q===quality?"active":""}`} onClick={() => setPlaybackQuality(q)}>{q}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="cv-btn" onClick={goFullscreen} aria-label="Fullscreen"><Maximize size={18} /></button>
          </div>
        )}
        {copied && <div className="cv-toast">Link copied</div>}
      </div>
    </div>
  );
}
