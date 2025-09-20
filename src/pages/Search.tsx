import NetworkBar from "@/components/NetworkBar";
import LegacyHeader from "@/components/Header";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import { Play, Eye, Clock } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChannel, searchVideos, type ChannelInfo, type SearchItem } from "@/services/api";
import { useSkeletonTestMode } from "@/hooks/use-test-mode";
import { SearchResultSkeleton, ChannelPanelSkeleton } from "@/components/SearchSkeleton";

const SearchPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [visible, setVisible] = useState(15);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data: results = [], isLoading, isError } = useQuery<SearchItem[]>({
    queryKey: ["search", q],
    queryFn: async () => (q ? await searchVideos(q, 15) : []),
    enabled: q.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const videoResults = useMemo(
    () => results.filter((item) => item.kind === "video"),
    [results]
  );

  const channelResults = useMemo(
    () => results.filter((item) => item.kind === "channel"),
    [results]
  );

  const formatCount = (value?: number | string | null): string | null => {
    if (value === undefined || value === null) return null;
    if (typeof value === "number" && Number.isFinite(value)) {
      return Intl.NumberFormat().format(value);
    }
    const raw = String(value).trim();
    if (!raw) return null;
    const numeric = Number(raw.replace(/[ ,]/g, ""));
    if (!Number.isNaN(numeric) && /^[0-9.,\s]+$/.test(raw)) {
      return Intl.NumberFormat().format(numeric);
    }
    return raw;
  };

  const formatCountLabel = (value?: number | string | null, unit?: string) => {
    const formatted = formatCount(value);
    if (!formatted) return null;
    if (typeof value === "string" && /[a-zA-Z]/.test(value)) {
      return formatted;
    }
    return unit ? `${formatted} ${unit}` : formatted;
  };

  useEffect(() => {
    setVisible(15);
  }, [q]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + 5, videoResults.length || v));
        }
      },
      { root: null, rootMargin: "200px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [videoResults.length]);

  const top15 = useMemo(() => videoResults.slice(0, Math.min(15, videoResults.length)), [videoResults]);

  const primaryChannelResult = useMemo(() => channelResults[0] ?? null, [channelResults]);
  const dominant = useMemo(() => {
    if (top15.length < 1) return null;
    const counts = new Map<string, { id: string; name: string; count: number }>();
    for (const v of top15) {
      const id = v.channel?.id || "";
      const name = v.channel?.name || "";
      if (!id) continue;
      const prev = counts.get(id) || { id, name, count: 0 };
      prev.count += 1;
      counts.set(id, prev);
    }
    let best: { id: string; name: string; count: number } | null = null;
    counts.forEach((val) => {
      if (!best || val.count > best.count) best = val;
    });
    if (!best) return null;
    const pct = best.count / Math.max(1, top15.length);
    if (pct > 0.5) return best;
    if (primaryChannelResult) {
      return {
        id: primaryChannelResult.channel?.id || primaryChannelResult.id,
        name: primaryChannelResult.channel?.name || primaryChannelResult.title,
        count: 1,
      };
    }
    return null;
  }, [top15, primaryChannelResult]);

  const { data: channelInfo } = useQuery<ChannelInfo | undefined>({
    queryKey: ["channel", dominant?.id],
    queryFn: async () => (dominant?.id ? await getChannel(dominant.id, 9) : undefined),
    enabled: !!dominant?.id,
    staleTime: 10 * 60 * 1000,
  });

  const channelThumbs = useMemo(
    () => (channelInfo?.videos ?? []).filter((v: any) => v && typeof v.id === "string" && v.id.length > 0).slice(0, 9),
    [channelInfo]
  );

  const displayChannel = useMemo(() => {
    if (!channelInfo && !primaryChannelResult) return undefined;

    const fallbackId = primaryChannelResult?.channel?.id || primaryChannelResult?.id;
    const fallbackName = primaryChannelResult?.channel?.name || primaryChannelResult?.title;
    const fallbackThumb = primaryChannelResult?.thumbnail;
    const fallbackSubs = primaryChannelResult?.subscriber_count;
    const fallbackDesc = primaryChannelResult?.channel_description;
    const fallbackVerified = primaryChannelResult?.channel?.badges?.includes?.("VERIFIED");

    const merged: ChannelInfo = {
      id: channelInfo?.id || fallbackId || '',
      name: channelInfo?.name || fallbackName || '',
      description: channelInfo?.description || fallbackDesc,
      thumbnail: channelInfo?.thumbnail || fallbackThumb,
      banner: channelInfo?.banner,
      subscriber_count: channelInfo?.subscriber_count ?? fallbackSubs,
      video_count: channelInfo?.video_count,
      view_count: channelInfo?.view_count,
      verified: channelInfo?.verified ?? fallbackVerified,
      videos: channelInfo?.videos,
    };

    return merged;
  }, [channelInfo, primaryChannelResult]);

  const showChannel = !!displayChannel || !!channelInfo;
  const [descExpanded, setDescExpanded] = useState(false);

  const compact = (n: number | string | undefined) => {
    if (n === undefined || n === null) return "0";
    const num = typeof n === "string" ? Number(n) : n;
    if (!isFinite(num)) return "0";
    return Intl.NumberFormat(undefined, { notation: "compact" }).format(num);
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return "";
    const then = new Date(iso).getTime();
    if (isNaN(then)) return "";
    const now = Date.now();
    const diff = Math.max(0, now - then);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const list = videoResults.slice(0, Math.min(visible, videoResults.length));
  const testSkeleton = useSkeletonTestMode();
  const pendingResults = (q.length > 0) && (isLoading || testSkeleton);
  const layoutHasAside = showChannel || pendingResults;

  return (
    <div className="min-h-screen bg-black text-white">
      <NetworkBar />
      <LegacyHeader />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Search</h1>
        <p className="text-zinc-400 mb-6">Query: {q || "(empty)"}</p>

        {!q && <div className="text-zinc-400">Enter a query to search.</div>}

        {q && (
          <div className={`grid grid-cols-1 ${layoutHasAside ? "md:grid-cols-3" : ""} gap-6`}>
            <div className={`${layoutHasAside ? "md:col-span-2" : ""}`}>
              {pendingResults && (
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SearchResultSkeleton key={`sr-skel-${i}`} />
                  ))}
                </div>
              )}
              {!pendingResults && isError && (
                <div className="text-sm text-red-400">Failed to search.</div>
              )}
        {!pendingResults && !isError && (
          <div className="space-y-4">
            {list.length > 0 && (
              <div className="space-y-4">
                {list.map((v, idx) => (
                  <div
                    key={`${v.id}-${idx}`}
                    className="group flex gap-4 p-2 rounded-lg hover:bg-zinc-900/40 transition-colors"
                    onClick={() => {
                        if (v.id) navigate(`/v/${v.id}`);
                      }}
                    >
                      <div className="w-44 shrink-0">
                        <div className="relative aspect-video rounded overflow-hidden border border-zinc-800">
                          <SafeImage
                            src={v.thumbnail}
                            alt={v.title}
                            className="transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Play overlay */}
                          <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
                            <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <div className="w-12 h-12 bg-brand-orange/90 rounded-full flex items-center justify-center">
                                <Play className="h-6 w-6 text-black ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[15px] leading-snug mb-1 line-clamp-2 group-hover:text-brand-orange transition-colors min-h-[2.5rem]">
                          {v.title}
                        </div>
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <div>{v.channel?.name || ""}</div>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {compact(v.view_count)} views
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {timeAgo(v.upload_date)}
                            </span>
                          </div>
                        </div>
                        {v.description && (
                          <div className="text-xs text-zinc-500 mt-2 line-clamp-2">{v.description}</div>
                        )}
                      </div>
                    </div>
                ))}
                {/* Sentinel for infinite reveal (viewport-based) */}
                <div ref={sentinelRef} />
              </div>
            )}
            {!list.length && channelResults.length === 0 && (
              <div className="text-sm text-zinc-400">No results found.</div>
            )}
          </div>
        )}
            </div>
            {layoutHasAside && (
              <aside className="md:col-span-1">
                {pendingResults ? (
                  <ChannelPanelSkeleton />
                ) : (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-auto">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          onClick={() => {
                            if (displayChannel && displayChannel.id) navigate(`/c/${displayChannel.id}`);
                          }}
                          src={displayChannel?.thumbnail || "https://i.pravatar.cc/80"}
                          alt={displayChannel?.name || ""}
                          className="w-14 h-14 rounded-full object-cover border border-zinc-700"
                        />
                        <div>
                          <div className="font-semibold">{displayChannel?.name}</div>
                          <div className="text-[11px] text-zinc-400 flex flex-wrap gap-x-3 gap-y-1">
                            {formatCountLabel(displayChannel?.subscriber_count, 'subscribers') && (
                              <span>{formatCountLabel(displayChannel?.subscriber_count, 'subscribers')}</span>
                            )}
                            {formatCountLabel(displayChannel?.video_count, 'videos') && (
                              <span>{formatCountLabel(displayChannel?.video_count, 'videos')}</span>
                            )}
                            {formatCountLabel(displayChannel?.view_count, 'views') && (
                              <span>{formatCountLabel(displayChannel?.view_count, 'views')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {(channelInfo?.description || primaryChannelResult?.channel_description) && (
                        <>
                          <div className={`text-xs text-zinc-400 whitespace-pre-wrap ${descExpanded ? "" : "line-clamp-8"}`}>
                            {channelInfo?.description || primaryChannelResult?.channel_description || ''}
                          </div>
                          <button
                            className="mt-2 text-[11px] text-zinc-300 hover:text-white underline"
                            onClick={() => setDescExpanded((v) => !v)}
                          >
                            {descExpanded ? "See less" : "See more"}
                          </button>
                        </>
                      )}
                    </div>

                    {channelThumbs.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-0">
                        {channelThumbs.map((v: any, idx: number) => (
                          <div
                            key={`${v.id}-${idx}`}
                            className="relative aspect-video overflow-hidden cursor-pointer"
                            onClick={() => {
                              if (v.id) navigate(`/v/${v.id}`);
                            }}
                          >
                            <SafeImage src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </aside>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
