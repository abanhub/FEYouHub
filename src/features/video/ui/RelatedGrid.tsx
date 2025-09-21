import "../styles/custom-video.css";

const extractYouTubeId = (input?: string): string => {
  if (!input) return "";
  const clean = input.trim();
  const idMatch = clean.match(/[A-Za-z0-9_-]{11}/);
  if (idMatch) return idMatch[0];
  try {
    const url = new URL(clean);
    if (url.hostname.includes("youtube.com")) {
      const paramId = url.searchParams.get("v");
      if (paramId) return paramId;
    }
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1);
    }
  } catch (error) {
    console.warn("Invalid YouTube URL", error);
  }
  return clean;
};

const formatTime = (seconds?: number) => {
  if (seconds === undefined || seconds === null) return "";
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  const mins = Math.floor((seconds / 60) % 60).toString();
  const hours = Math.floor(seconds / 3600);
  return hours > 0 ? `${hours}:${mins.padStart(2, "0")}:${secs}` : `${mins}:${secs}`;
};

type Item = { videoId: string; title: string; duration?: number };

type Props = {
  items: Item[];
  onSelect?: (id: string) => void;
};

const RelatedGrid = ({ items, onSelect }: Props) => {
  if (!items.length) return null;

  return (
    <div className="cv-related">
      <div className="cv-related-grid">
        {items.map((item, index) => {
          const relatedId = extractYouTubeId(item.videoId);
          const thumb = `https://i.ytimg.com/vi/${relatedId}/hqdefault.jpg`;
          const handleClick = () => {
            if (onSelect) {
              onSelect(relatedId);
              return;
            }
            window.location.assign(`/v/${relatedId}`);
          };

          return (
            <button key={`${relatedId}-${index}`} className="cv-rel-item" onClick={handleClick}>
              <div className="cv-rel-thumb">
                <img src={thumb} alt={item.title} loading="lazy" />
                {typeof item.duration === "number" && (
                  <span className="cv-rel-duration">{formatTime(item.duration)}</span>
                )}
              </div>
              <div className="cv-rel-meta">
                <div className="cv-rel-title" title={item.title}>
                  {item.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedGrid;

