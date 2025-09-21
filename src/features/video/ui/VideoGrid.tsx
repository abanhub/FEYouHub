import { useCallback, useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { useSkeletonTestMode } from "@/shared/lib/hooks/use-test-mode";
import { getBrowseFeed } from "@/shared/config/api";

import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";

const compact = (value: number | string | undefined) => {
  if (value === undefined || value === null) return "0";
  const numeric = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numeric)) return "0";
  return Intl.NumberFormat(undefined, { notation: "compact" }).format(numeric);
};

const timeAgo = (iso?: string) => {
  if (!iso) return "";
  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return "";
  const diff = Math.max(0, Date.now() - timestamp);
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
    queryFn: async ({ pageParam }) => getBrowseFeed(browseId, { region, continuation: pageParam }),
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
      return;
    }
    fetchNextPage().catch((error) => {
      if (import.meta.env.DEV) {
        console.error("Failed to load more videos", error);
      }
    });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    const logHeight = () => {
      console.log("[home] page height", document.documentElement.scrollHeight);
    };
    logHeight();
    window.addEventListener("resize", logHeight);
    window.addEventListener("load", logHeight);
    const observer = new MutationObserver(logHeight);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("resize", logHeight);
      window.removeEventListener("load", logHeight);
      observer.disconnect();
    };
  }, []);

  const videos = useMemo(
    () => (data?.pages || []).flatMap((page) => page.items).filter((item) => item?.id),
    [data?.pages]
  );

  const expectedSkeletons = data?.pages?.[0]?.items?.length ?? 12;
  const initialPending = (videos.length === 0 && isLoading) || testSkeleton;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {initialPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: expectedSkeletons }).map((_, index) => (
            <VideoCardSkeleton key={`skel-${index}`} />
          ))}
        </div>
      )}
      {!initialPending && isError && (
        <div className="text-sm text-red-400">Failed to load videos.</div>
      )}
      {!initialPending && !isError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((video, index) => (
            <VideoCard
              id={video.id}
              key={`${video.id}-${index}`}
              title={video.title}
              channel={video.channel?.name || ""}
              views={compact(video.view_count)}
              duration={video.length_text || ""}
              timeAgo={timeAgo(video.upload_date)}
              thumbnail={video.thumbnail}
              verified={Boolean(video.channel?.badges?.includes?.("VERIFIED"))}
            />
          ))}
        </div>
      )}
      {!initialPending && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={manuallyLoadMore}
            disabled={!hasNextPage || isFetchingNextPage}
            className="rounded-md bg-brand-orange px-4 py-2 font-semibold text-black transition-colors hover:bg-brand-orange-hover disabled:opacity-70"
          >
            {hasNextPage ? (isFetchingNextPage ? "Loading…" : "Load more videos") : "No more videos"}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;

