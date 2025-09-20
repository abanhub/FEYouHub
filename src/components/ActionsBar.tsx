import { useMemo, useState } from "react";
import { ListPlus, Share2, Flag, ThumbsUp, ThumbsDown, BookmarkPlus, Clock } from "lucide-react";

type Props = {
  videoId: string;
  views?: number;
  publishedAt?: string | Date;
  viewsLabel?: string; // fallback label, e.g., "754K Views"
  ageLabel?: string; // fallback label, e.g., "1 week ago"
  onAddTo?: () => void;
  onReport?: () => void;
  onShare?: () => void;
};

function formatViews(v?: number) {
  if (!v && v !== 0) return "";
  if (v < 1000) return `${v}`;
  if (v < 1_000_000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K`;
  if (v < 1_000_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  return `${(v / 1_000_000_000).toFixed(1)}B`;
}

function timeAgoLabel(input?: string | Date) {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  const diff = Math.max(0, Date.now() - date.getTime());
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const wk = Math.floor(day / 7);
  const mo = Math.floor(day / 30);
  const yr = Math.floor(day / 365);
  if (yr) return `${yr} year${yr>1?"s":""} ago`;
  if (mo) return `${mo} month${mo>1?"s":""} ago`;
  if (wk) return `${wk} week${wk>1?"s":""} ago`;
  if (day) return `${day} day${day>1?"s":""} ago`;
  if (hr) return `${hr} hour${hr>1?"s":""} ago`;
  if (min) return `${min} minute${min>1?"s":""} ago`;
  return `just now`;
}

export default function ActionsBar({ videoId, views, publishedAt, viewsLabel, ageLabel, onAddTo, onReport, onShare }: Props) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const shareUrl = useMemo(() => `${window.location.origin}/v/${videoId}`, [videoId]);

  const doShare = async () => {
    if (onShare) return onShare();
    try { await navigator.clipboard.writeText(shareUrl); } catch {}
  };

  const viewsText = viewsLabel || (typeof views === 'number' ? `${formatViews(views)} Views` : "");
  const ageText = ageLabel || timeAgoLabel(publishedAt);

  return (
    <div className="w-full border-t border-zinc-800 bg-black/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-4 text-zinc-300 text-sm">
          {viewsText && <div className="flex items-center gap-1"><span className="font-medium">{viewsText}</span></div>}
          {ageText && <div className="flex items-center gap-1"><Clock size={16} /><span>{ageText}</span></div>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:text-white" onClick={onAddTo} aria-label="Add to">
            <ListPlus size={18} />
            <span className="text-sm">Add to</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:text-white" onClick={doShare} aria-label="Share">
            <Share2 size={18} />
            <span className="text-sm">Share</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:text-white" onClick={onReport} aria-label="Report">
            <Flag size={18} />
            <span className="text-sm">Report</span>
          </button>
          <div className="flex items-center gap-2 ml-2">
            <button className={`inline-flex items-center gap-1 px-3 h-9 rounded-md border ${liked?"border-amber-500 text-amber-400":"border-zinc-700 text-zinc-200"} bg-zinc-900 hover:border-zinc-600 hover:text-white`} onClick={() => { setLiked(v=>!v); if (!disliked && !liked) {} if (disliked) setDisliked(false); }} aria-label="Like">
              <ThumbsUp size={18} />
              <span className="text-sm">Like</span>
            </button>
            <button className={`inline-flex items-center gap-1 px-3 h-9 rounded-md border ${disliked?"border-amber-500 text-amber-400":"border-zinc-700 text-zinc-200"} bg-zinc-900 hover:border-zinc-600 hover:text-white`} onClick={() => { setDisliked(v=>!v); if (liked) setLiked(false); }} aria-label="Dislike">
              <ThumbsDown size={18} />
              <span className="text-sm">Dislike</span>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <button className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:text-white" aria-label="Watch later">
              <BookmarkPlus size={18} />
              <span className="text-sm">Watch later</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

