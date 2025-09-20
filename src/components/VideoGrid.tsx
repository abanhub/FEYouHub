import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBrowseFeed } from "@/services/api";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";
import { useSkeletonTestMode } from "@/hooks/use-test-mode";

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

type Props = {
  browseId: string;
  regionOverride?: string;
};

const VideoGrid = ({ browseId, regionOverride }: Props) => {
  const [params] = useSearchParams();
  const queryRegion = params.get("region") || undefined;
  const region = regionOverride ?? queryRegion;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["videos", browseId, region],
    queryFn: async ({ pageParam }) => {
      const res = await getBrowseFeed(browseId, { region, continuation: pageParam });
      return res;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.continuation || undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const testSkeleton = useSkeletonTestMode();

  const manuallyLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      // eslint-disable-next-line no-console
      console.log('[home] manual load more ignored', { hasNextPage, isFetchingNextPage });
      return;
    }
    const nextToken = data?.pages?.[data.pages.length - 1]?.continuation;
    // eslint-disable-next-line no-console
    console.log('[home] manual load more click', {
      continuation: nextToken ?? null,
      pagesLoaded: data?.pages?.length ?? 0,
    });
    fetchNextPage().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[home] manual load more failed', err);
    });
  }, [data?.pages, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const logHeight = () => {
      const pageHeight = document.documentElement.scrollHeight;
      // eslint-disable-next-line no-console
      console.log('[home] page height', pageHeight);
    };
    logHeight();
    window.addEventListener('resize', logHeight);
    window.addEventListener('load', logHeight);
    const observer = new MutationObserver(() => logHeight());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('resize', logHeight);
      window.removeEventListener('load', logHeight);
      observer.disconnect();
    };
  }, []);

  const videos = useMemo(
    () =>
      (data?.pages || [])
        .flatMap((page) => page.items)
        .filter((item) => item && item.id),
    [data?.pages]
  );

  const expectedSkeletons = data?.pages?.[0]?.items?.length ?? 12;
  const initialPending = (!videos.length && isLoading) || testSkeleton;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {initialPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: expectedSkeletons }).map((_, i) => (
            <VideoCardSkeleton key={`skel-${i}`} />
          ))}
        </div>
      )}
      {!initialPending && isError && (
        <div className="text-sm text-red-400">Failed to load videos.</div>
      )}
      {!initialPending && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(videos || []).map((v, idx) => (
            <VideoCard
              id={v.id}
              key={`${v.id}-${idx}`}
              title={v.title}
              channel={v.channel?.name || ""}
              views={compact(v.view_count)}
              duration={v.length_text || ""}
              timeAgo={timeAgo(v.upload_date)}
              thumbnail={v.thumbnail}
              verified={Boolean(v.channel?.badges?.includes?.('VERIFIED'))}
            />
          ))}
        </div>
      )}
      {!initialPending && isFetchingNextPage && (
        <div className="mt-6 flex justify-center text-sm text-zinc-400">Loading more…</div>
      )}
      {!initialPending && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={manuallyLoadMore}
            disabled={!hasNextPage || isFetchingNextPage}
            className="px-4 py-2 rounded-md bg-brand-orange hover:bg-brand-orange-hover text-black font-semibold disabled:opacity-70"
          >
            {hasNextPage
              ? isFetchingNextPage
                ? 'Loading…'
                : 'Load more videos'
              : 'No more videos'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
