import { useMemo, useState } from "react";
import { ThumbsUp, ThumbsDown, Heart, Plus, Share2, Flag, Rss, CheckCircle2 } from "lucide-react";

type Channel = {
  name: string;
  avatarUrl?: string;
  verified?: boolean;
  videosCount?: number;
  subscribersCount?: number;
  subscribed?: boolean;
};

type Props = {
  videoId: string;
  title: string;
  viewsLabel: string; // e.g., "64.9K Views"
  ageLabel: string;   // e.g., "4 years ago"
  likeCount?: number;
  dislikeCount?: number;
  channel: Channel;
  description?: string;
  categories?: string[];
  onShare?: (url: string) => void;
};

export default function UnderVideoMeta({ videoId, title, viewsLabel, ageLabel, likeCount = 0, dislikeCount = 0, channel, description, categories = [], onShare }: Props) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [subscribed, setSubscribed] = useState(!!channel.subscribed);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const shareUrl = useMemo(() => `${window.location.origin}/v/${videoId}`, [videoId]);

  const copyShare = async () => {
    if (onShare) return onShare(shareUrl);
    try { await navigator.clipboard.writeText(shareUrl); } catch {}
  };

  const likeDisplay = likeCount + (liked ? 1 : 0) - (disliked && likeCount > 0 ? 1 : 0);
  const dislikeDisplay = dislikeCount + (disliked ? 1 : 0) - (liked && dislikeCount > 0 ? 1 : 0);
  const hasDescription = Boolean(description && description.trim().length > 0);
  const hasCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <div className="w-full text-zinc-200">
      <h2 className="text-xl md:text-2xl font-semibold mb-2">{title}</h2>
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
        <span>{viewsLabel}</span>
        <span className="opacity-50">•</span>
        <span>{ageLabel}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-zinc-600" onClick={() => { setLiked(v=>!v); if (disliked) setDisliked(false); }}>
            <ThumbsUp size={18} />
            <span className="text-sm">{likeDisplay}</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-zinc-600" onClick={() => { setDisliked(v=>!v); if (liked) setLiked(false); }}>
            <ThumbsDown size={18} />
            <span className="text-sm">{dislikeDisplay}</span>
          </button>
          <button className={`inline-flex items-center gap-2 px-3 h-9 rounded-full border ${favorite?"border-amber-500 text-amber-400":"border-zinc-700 text-zinc-200"} bg-zinc-900 hover:border-zinc-600`} onClick={() => setFavorite(v=>!v)}>
            <Heart size={18} />
            <span className="text-sm">Favorites</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-zinc-600">
            <Plus size={18} />
            <span className="text-sm">Add to</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-zinc-600" onClick={copyShare}>
            <Share2 size={18} />
            <span className="text-sm">Share</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 h-9 rounded-full border border-zinc-700 bg-zinc-900 hover:border-zinc-600">
            <Flag size={18} />
            <span className="text-sm">Report</span>
          </button>
        </div>
        {/* <div>
          <button className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-zinc-600 bg-transparent hover:bg-zinc-900">
            <Rss size={18} />
            <span className="font-medium">Subscribe</span>
          </button>
        </div> */}
      </div>

      <div className="flex items-center justify-between gap-3 py-4 border-y border-zinc-800">
        <div className="flex items-center gap-3">
          <img src={channel.avatarUrl || "https://i.pravatar.cc/56"} alt={channel.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">{channel.name}</span>
              {channel.verified && <CheckCircle2 size={16} className="text-sky-400" />}
            </div>
            <div className="text-sm text-zinc-400">
              {channel.videosCount ? `${channel.videosCount} Videos` : null}
              {channel.videosCount && channel.subscribersCount ? " | " : null}
              {channel.subscribersCount ? `${channel.subscribersCount.toLocaleString()} Subscribers` : null}
            </div>
          </div>
        </div>
        <div className="hidden sm:block">
          <button onClick={() => setSubscribed(v=>!v)} className={`inline-flex items-center gap-2 px-4 h-10 rounded-md border ${subscribed?"border-zinc-700 bg-zinc-800 text-zinc-200":"border-zinc-600 bg-transparent"} hover:bg-zinc-900`}>
            <Rss size={18} />
            <span className="font-medium">{subscribed?"Subscribed":"Subscribe"}</span>
          </button>
        </div>
      </div>

      {hasDescription && (
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-sm text-zinc-200 whitespace-pre-wrap break-words">
            <p className={`${descriptionExpanded ? '' : 'line-clamp-[8]'}`}>{description}</p>
          </div>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-brand-orange hover:text-brand-orange/80"
            onClick={() => setDescriptionExpanded((v) => !v)}
          >
            {descriptionExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      )}

      {hasCategories && (
        <div className="mt-4">
          <div className="text-zinc-400 mb-2">Keywords</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <span key={`${c}-${i}`} className="inline-flex items-center px-3 h-8 rounded-md border border-zinc-700 bg-zinc-900 text-sm">{c}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button className="text-zinc-400 hover:text-zinc-200 text-sm tracking-wide">VIEW MORE</button>
      </div>

      <div className="mt-4 border-t border-zinc-800" />
    </div>
  );
}
