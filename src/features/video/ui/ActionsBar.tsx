import { useMemo, useState } from "react";
import { ListPlus, Share2, Flag, ThumbsUp, ThumbsDown, BookmarkPlus, Clock } from "lucide-react";

type Props = {
  videoId: string;
  views?: number;
  publishedAt?: string | Date;
  viewsLabel?: string;
  ageLabel?: string;
  onAddTo?: () => void;
  onReport?: () => void;
  onShare?: () => void;
};

function formatViews(value?: number) {
  if (value === undefined || value === null) return "";
  if (value < 1000) return `${value}`;
  if (value < 1_000_000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  return `${(value / 1_000_000_000).toFixed(1)}B`;
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
  if (yr) return `${yr} year${yr > 1 ? "s" : ""} ago`;
  if (mo) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  if (wk) return `${wk} week${wk > 1 ? "s" : ""} ago`;
  if (day) return `${day} day${day > 1 ? "s" : ""} ago`;
  if (hr) return `${hr} hour${hr > 1 ? "s" : ""} ago`;
  if (min) return `${min} minute${min > 1 ? "s" : ""} ago`;
  return "just now";
}

export default function ActionsBar({
  videoId,
  views,
  publishedAt,
  viewsLabel,
  ageLabel,
  onAddTo,
  onReport,
  onShare,
}: Props) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const shareUrl = useMemo(
    () => (typeof window === "undefined" ? "" : `${window.location.origin}/v/${videoId}`),
    [videoId]
  );

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    if (!shareUrl) return;
    try {
      await navigator.clipboard?.writeText(shareUrl);
    } catch (error) {
      console.warn("Failed to copy share URL", error);
    }
  };

  const handleLike = () => {
    setLiked((previous) => {
      const next = !previous;
      if (next) {
        setDisliked(false);
      }
      return next;
    });
  };

  const handleDislike = () => {
    setDisliked((previous) => {
      const next = !previous;
      if (next) {
        setLiked(false);
      }
      return next;
    });
  };

  const viewsText = viewsLabel || (typeof views === "number" ? `${formatViews(views)} Views` : "");
  const ageText = ageLabel || timeAgoLabel(publishedAt);

  return (
    <div className="w-full border-t border-zinc-800 bg-black/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 text-sm text-zinc-300">
          {viewsText && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{viewsText}</span>
            </div>
          )}
          {ageText && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{ageText}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-zinc-200 hover:border-zinc-600 hover:text-white"
            onClick={onAddTo}
            aria-label="Add to playlist"
            type="button"
          >
            <ListPlus size={18} />
            <span className="text-sm">Add to</span>
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-zinc-200 hover:border-zinc-600 hover:text-white"
            onClick={handleShare}
            aria-label="Share video"
            type="button"
          >
            <Share2 size={18} />
            <span className="text-sm">Share</span>
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-zinc-200 hover:border-zinc-600 hover:text-white"
            onClick={onReport}
            aria-label="Report video"
            type="button"
          >
            <Flag size={18} />
            <span className="text-sm">Report</span>
          </button>
          <div className="ml-2 flex items-center gap-2">
            <button
              className={`inline-flex h-9 items-center gap-1 rounded-md border bg-zinc-900 px-3 ${
                liked ? "border-amber-500 text-amber-400" : "border-zinc-700 text-zinc-200 hover:border-zinc-600 hover:text-white"
              }`}
              onClick={handleLike}
              aria-label="Like video"
              type="button"
            >
              <ThumbsUp size={18} />
              <span className="text-sm">Like</span>
            </button>
            <button
              className={`inline-flex h-9 items-center gap-1 rounded-md border bg-zinc-900 px-3 ${
                disliked
                  ? "border-amber-500 text-amber-400"
                  : "border-zinc-700 text-zinc-200 hover:border-zinc-600 hover:text-white"
              }`}
              onClick={handleDislike}
              aria-label="Dislike video"
              type="button"
            >
              <ThumbsDown size={18} />
              <span className="text-sm">Dislike</span>
            </button>
          </div>
          <div className="ml-2 hidden items-center gap-2 sm:flex">
            <button
              className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-zinc-200 hover:border-zinc-600 hover:text-white"
              aria-label="Watch later"
              type="button"
            >
              <BookmarkPlus size={18} />
              <span className="text-sm">Watch later</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

