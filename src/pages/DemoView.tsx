import NetworkBar from "@/features/layout/ui/NetworkBar";
import LegacyHeader from "@/features/layout/ui/Header";
import Footer from "@/features/layout/ui/Footer";
import { useParams, useNavigate } from "react-router-dom";
import CustomVideo from "@/features/video/ui/CustomVideo";
import UnderVideoMeta from "@/features/video/ui/UnderVideoMeta";
import NextVideo from "@/features/video/ui/NextVideo";
import Comment from "@/features/comments/ui/Comment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getTrending, getVideoDetails, getVideoComments } from "@/shared/config/api";
import type { VideoDetails } from "@/entities/video/types";

const toNumericCount = (value?: number | string | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const digits = value.replace(/[^0-9]/g, "");
    if (!digits) return 0;
    const num = Number(digits);
    return Number.isNaN(num) ? 0 : num;
  }
  return 0;
};

const DemoView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentId = id || "dQw4w9WgXcQ";

  const [video, setVideo] = useState<VideoDetails | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data: commentPages,
    isError: commentsError,
    fetchNextPage: fetchMoreComments,
    hasNextPage: commentsHasNextPage,
    isFetchingNextPage: commentsFetchingNext,
  } = useInfiniteQuery({
    queryKey: ["comments", currentId],
    queryFn: async ({ pageParam }) => getVideoComments(currentId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken ?? undefined,
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(currentId),
  });

  const {
    data: recommendedPages,
    fetchNextPage: fetchMoreVideos,
    hasNextPage: videosHasNextPage,
    isFetchingNextPage: videosFetchingNext,
  } = useInfiniteQuery({
    queryKey: ["recommended", currentId],
    queryFn: async ({ pageParam }) => getTrending({ continuation: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.continuation ?? undefined,
    staleTime: 5 * 60 * 1000,
  });

  const comments = useMemo(
    () => (commentPages?.pages || []).flatMap((page) => page.comments || []),
    [commentPages?.pages]
  );

  const recommendedVideos = useMemo(
    () => (recommendedPages?.pages || []).flatMap((page) => page.items || []),
    [recommendedPages?.pages]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const details = await getVideoDetails(currentId);
        if (cancelled) return;
        setVideo(details);
      } catch (e) {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentId]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    if (!commentsHasNextPage && !videosHasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (commentsHasNextPage && !commentsFetchingNext) {
          fetchMoreComments().catch((err) => {
          });
        }
        if (videosHasNextPage && !videosFetchingNext) {
          fetchMoreVideos().catch((err) => {
          });
        }
      },
      { root: null, rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [commentsHasNextPage, commentsFetchingNext, fetchMoreComments, videosHasNextPage, videosFetchingNext, fetchMoreVideos]);

  const manuallyLoadMore = () => {
    let triggered = false;
    if (commentsHasNextPage && !commentsFetchingNext) {
      fetchMoreComments().catch((err) => {
      });
      triggered = true;
    }
    if (videosHasNextPage && !videosFetchingNext) {
      fetchMoreVideos().catch((err) => {
      });
      triggered = true;
    }
    if (!triggered) {
    }
  };

  const viewsLabel = useMemo(() => {
    const count = toNumericCount(video?.view_count as number | string | undefined);
    if (count <= 0) return "";
    return `${Intl.NumberFormat(undefined, { notation: "compact" }).format(count)} Views`;
  }, [video?.view_count]);

  const likeCount = useMemo(() => toNumericCount(video?.like_count as number | string | undefined), [video?.like_count]);

  const relatedList = useMemo(
    () => (video?.related || []).map((r) => ({ videoId: r.id, title: r.title, duration: r.length_seconds })),
    [video?.related]
  );

  const recommendedList = useMemo(
    () => recommendedVideos.map((v) => ({ videoId: v.id, title: v.title, duration: v.length_seconds })),
    [recommendedVideos]
  );

  const hasAnyNextPage = commentsHasNextPage || videosHasNextPage;

  return (
    <div className="min-h-screen bg-red text-red flex flex-col">
      <NetworkBar />
      <LegacyHeader />
      <main className="flex-1 bg-base-100">
        <div className="max-w-[1600px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)] gap-6">
            <section className="space-y-6 ">
              <CustomVideo videoId={currentId} title={video?.title || ""} autoplay />

              <UnderVideoMeta
                videoId={currentId}
                title={video?.title || ""}
                viewsLabel={viewsLabel}
                ageLabel={(video?.upload_date as string) || ""}
                likeCount={likeCount}
                dislikeCount={0}
                channel={{
                  name: (video?.channel?.name as string) || "",
                  verified: Boolean(video?.channel?.badges?.includes("VERIFIED")),
                  videosCount: undefined,
                  subscribersCount: undefined,
                  avatarUrl: video?.channel?.thumbnail || undefined,
                }}
                description={video?.description || ''}
                categories={video?.keywords || []}
              />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Comments</h2>
                <Comment
                  items={(comments || []).map((c: any, idx: number) => ({
                    id: String(c.id || idx),
                    author: String(c.author || ""),
                    time: String(c.published || ""),
                    text: String(c.content || c.text || ""),
                    avatarUrl: c.author_thumbnail,
                    likes: toNumericCount((c as any).likes ?? (c as any).likeCount ?? 0),
                    dislikes: 0,
                    userVote: null,
                  }))}
                  total={comments?.length || 0}
                  defaultSort="popular"
                />
              </div>
              {commentsError && !comments.length && (
                <div className="text-sm text-red-400">Failed to load comments.</div>
              )}

              <div ref={loadMoreRef} className="h-2" />

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={manuallyLoadMore}
                  disabled={!hasAnyNextPage || commentsFetchingNext || videosFetchingNext}
                  className="px-4 py-2 rounded-md border border-zinc-700 bg-zinc-900 text-sm text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
                >
                  {commentsFetchingNext || videosFetchingNext
                    ? "Loading moreâ€¦"
                    : hasAnyNextPage
                      ? "Load more"
                      : "No more content"}
                </button>
              </div>

              <p className="text-zinc-400 text-sm">
                Video ID: <span className="text-brand-orange font-semibold">{id}</span>
              </p>
            </section>

            <aside className="space-y-4 lg:top-6 lg:h-fit">
              <NextVideo
                related={relatedList}
                // recommended={recommendedList}
                onSelect={(vid) => navigate(`/v/${vid}`)}
              />
              {!videosHasNextPage && recommendedList.length === 0 && (
                <div className="text-sm text-zinc-500">No additional recommendations.</div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DemoView;

