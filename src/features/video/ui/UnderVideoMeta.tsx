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
  viewsLabel: string;
  ageLabel: string;
  likeCount?: number;
  dislikeCount?: number;
  channel: Channel;
  description?: string;
  categories?: string[];
  onShare?: (url: string) => void;
};

const UnderVideoMeta = ({
  videoId,
  title,
  viewsLabel,
  ageLabel,
  likeCount = 0,
  dislikeCount = 0,
  channel,
  description,
  categories = [],
  onShare,
}: Props) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [subscribed, setSubscribed] = useState(Boolean(channel.subscribed));
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const shareUrl = useMemo(
    () => (typeof window === "undefined" ? "" : `${window.location.origin}/v/${videoId}`),
    [videoId]
  );

  const copyShare = async () => {
    if (!shareUrl) return;
    if (onShare) {
      onShare(shareUrl);
      return;
    }
    try {
      await navigator.clipboard?.writeText(shareUrl);
    } catch (error) {
      console.warn("Failed to copy share url", error);
    }
  };

  const likeDisplay = likeCount + (liked ? 1 : 0) - (disliked && likeCount > 0 ? 1 : 0);
  const dislikeDisplay = dislikeCount + (disliked ? 1 : 0) - (liked && dislikeCount > 0 ? 1 : 0);
  const hasDescription = Boolean(description?.trim());
  const hasCategories = categories.length > 0;

  return (
    <div className="w-full text-zinc-200">
      <h2 className="mb-2 text-xl font-semibold md:text-2xl">{title}</h2>
      <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
        <span>{viewsLabel}</span>
        <span className="opacity-50">•</span>
        <span>{ageLabel}</span>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 hover:border-zinc-600"
            onClick={() => {
              setLiked((value) => {
                const next = !value;
                if (next) setDisliked(false);
                return next;
              });
            }}
            type="button"
          >
            <ThumbsUp size={18} />
            <span className="text-sm">{likeDisplay}</span>
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 hover:border-zinc-600"
            onClick={() => {
              setDisliked((value) => {
                const next = !value;
                if (next) setLiked(false);
                return next;
              });
            }}
            type="button"
          >
            <ThumbsDown size={18} />
            <span className="text-sm">{dislikeDisplay}</span>
          </button>
          <button
            className={`inline-flex h-9 items-center gap-2 rounded-full border bg-zinc-900 px-3 ${
              favorite ? "border-amber-500 text-amber-400" : "border-zinc-700 text-zinc-200 hover:border-zinc-600"
            }`}
            onClick={() => setFavorite((value) => !value)}
            type="button"
          >
            <Heart size={18} />
            <span className="text-sm">Favorites</span>
          </button>
          <button className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 hover:border-zinc-600" type="button">
            <Plus size={18} />
            <span className="text-sm">Add to</span>
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 hover:border-zinc-600"
            onClick={copyShare}
            type="button"
          >
            <Share2 size={18} />
            <span className="text-sm">Share</span>
          </button>
          <button className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 hover:border-zinc-600" type="button">
            <Flag size={18} />
            <span className="text-sm">Report</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-y border-zinc-800 py-4">
        <div className="flex items-center gap-3">
          <img
            src={channel.avatarUrl || "https://i.pravatar.cc/56"}
            alt={channel.name}
            className="h-12 w-12 rounded-full object-cover"
          />
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
          <button
            onClick={() => setSubscribed((value) => !value)}
            className={`inline-flex h-10 items-center gap-2 rounded-md border px-4 ${
              subscribed ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-600 bg-transparent"
            } hover:bg-zinc-900`}
            type="button"
          >
            <Rss size={18} />
            <span className="font-medium">{subscribed ? "Subscribed" : "Subscribe"}</span>
          </button>
        </div>
      </div>

      {hasDescription && (
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="whitespace-pre-wrap break-words text-sm text-zinc-200">
            <p className={descriptionExpanded ? undefined : "line-clamp-[8]"}>{description}</p>
          </div>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-brand-orange hover:text-brand-orange/80"
            onClick={() => setDescriptionExpanded((value) => !value)}
          >
            {descriptionExpanded ? "Show less" : "Show more"}
          </button>
        </div>
      )}

      {hasCategories && (
        <div className="mt-4">
          <div className="mb-2 text-zinc-400">Keywords</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="inline-flex h-8 items-center rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <button className="text-sm tracking-wide text-zinc-400 hover:text-zinc-200" type="button">
          VIEW MORE
        </button>
      </div>

      <div className="mt-4 border-t border-zinc-800" />
    </div>
  );
};

export default UnderVideoMeta;

