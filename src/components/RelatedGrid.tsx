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

function formatTime(sec?: number) {
  if (!sec && sec !== 0) return "";
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  const m = Math.floor((sec / 60) % 60).toString();
  const h = Math.floor(sec / 3600);
  return h > 0 ? `${h}:${m.padStart(2, "0")}:${s}` : `${m}:${s}`;
}

type Item = { videoId: string; title: string; duration?: number };

export default function RelatedGrid({ items, onSelect }: { items: Item[]; onSelect?: (id: string) => void }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="cv-related">
      <div className="cv-related-grid">
        {items.map((it, idx) => {
          const rid = extractYouTubeId(it.videoId);
          const thumb = `https://i.ytimg.com/vi/${rid}/hqdefault.jpg`;
          return (
            <button key={`${rid}-${idx}`} className="cv-rel-item" onClick={() => {
              if (onSelect) onSelect(rid);
              else window.location.assign(`/v/${rid}`);
            }}>
              <div className="cv-rel-thumb">
                <img src={thumb} alt={it.title} loading="lazy" />
                {typeof it.duration === 'number' && (
                  <span className="cv-rel-duration">{formatTime(it.duration)}</span>
                )}
              </div>
              <div className="cv-rel-meta">
                <div className="cv-rel-title" title={it.title}>{it.title}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

