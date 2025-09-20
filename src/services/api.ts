export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type ApiVideo = {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  thumbnails?: Thumbnail[];
  upload_date?: string;
  view_count?: number | string;
  like_count?: number | string;
  length_text?: string;
  length_seconds?: number;
  is_live?: boolean;
  badges?: string[];
  channel?: {
    id?: string;
    name?: string;
    thumbnail?: string | null;
    badges?: string[];
  };
};

export type SearchItem = ApiVideo & {
  kind: 'video' | 'channel' | 'playlist';
  subscriber_count?: number | string;
  channel_description?: string;
};

export type SearchResponse = {
  query: string;
  estimatedResults?: number | string;
  results: ApiVideo[];
  nextPageToken?: string;
};

export type TrendingResponse = {
  browseId: string;
  title?: string;
  items: ApiVideo[];
  continuation?: string;
  region?: string;
  timestamp: string;
};

export type ApiComment = {
  id: string;
  author: string;
  author_thumbnail?: string;
  content: string; // plain text
  published: string;
  likes?: number | string;
  reply_count?: number;
  repliesToken?: string;
};

export type VideoDetails = ApiVideo & {
  keywords?: string[];
  duration_seconds?: number;
  captions?: Array<{ languageCode: string; name: string; url: string; kind?: string; isTranslatable?: boolean }>;
  stats?: { viewCount?: number | string; averageRating?: number };
  publish?: { uploadDate?: string; publishDate?: string; category?: string };
  streaming?: {
    formats?: Array<Record<string, unknown>>;
    adaptiveFormats?: Array<Record<string, unknown>>;
    dashManifestUrl?: string;
    hlsManifestUrl?: string;
  };
  related?: ApiVideo[];
  commentsToken?: string;
};

export type VideoCommentsResponse = {
  comments: ApiComment[];
  nextPageToken?: string;
  has_more: boolean;
};

export type ChannelInfo = {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  banner?: string;
  subscriber_count?: string | number;
  video_count?: string | number;
  view_count?: string | number;
  verified?: boolean;
  videos?: Array<Pick<ApiVideo, 'id' | 'title' | 'description' | 'thumbnail' | 'upload_date'>>;
};

type FetchOptions = {
  hl?: string;
  gl?: string;
};

const { VITE_API_ORIGIN, VITE_API_BASE_PATH } = import.meta.env;

const fallbackOrigin =
  typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://youtubei-proxy.bangngo1509a.workers.dev';

const API_ORIGIN = (VITE_API_ORIGIN || fallbackOrigin).replace(/\/+$/, '');
const API_BASE_PATH = `/${(VITE_API_BASE_PATH || 'youtubei/v1').replace(/^\/+/, '')}`;
const API_BASE = `${API_ORIGIN}${API_BASE_PATH}`;

async function http<T>(path: string, body: unknown, { hl, gl }: FetchOptions = {}): Promise<T> {
  const baseUrl = API_BASE.endsWith('/') ? API_BASE : `${API_BASE}/`;
  const url = new URL(path, baseUrl);
  if (hl) url.searchParams.set('hl', hl);
  if (gl) url.searchParams.set('gl', gl);

  const payload = JSON.stringify(body ?? {});
  const started = Date.now();
  const preview = payload.length > 500 ? `${payload.slice(0, 497)}...` : payload;
  // eslint-disable-next-line no-console
  console.log('[api]', '→ POST', url.toString(), `payload=${preview}`);
  // eslint-disable-next-line no-console
  console.info('[api] → POST', url.toString(), `payload=${preview}`);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
  } catch (error) {
    const duration = Date.now() - started;
    // eslint-disable-next-line no-console
    console.log('[api]', '× POST', url.toString(), `${duration}ms`, error);
    // eslint-disable-next-line no-console
    console.error('[api] × POST', url.toString(), `${duration}ms`, error);
    throw error;
  }

  const duration = Date.now() - started;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // eslint-disable-next-line no-console
    console.log('[api]', '← POST', url.toString(), res.status, `${duration}ms`, text);
    // eslint-disable-next-line no-console
    console.warn('[api] ← POST', url.toString(), res.status, `${duration}ms`, text);
    throw new Error(`Request failed ${res.status}: ${text}`);
  }

  // eslint-disable-next-line no-console
  console.log('[api]', '← POST', url.toString(), res.status, `${duration}ms`);
  // eslint-disable-next-line no-console
  console.info('[api] ← POST', url.toString(), res.status, `${duration}ms`);
  return res.json() as Promise<T>;
}

const normalizeThumbnails = (input: unknown): Thumbnail[] => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((entry) => {
        if (!entry) return null;
        if (typeof entry === 'string') {
          return { url: entry, width: 0, height: 0 } as Thumbnail;
        }
        if (typeof entry === 'object') {
          const anyEntry = entry as any;
          const url = anyEntry.url || anyEntry.src;
          if (typeof url === 'string') {
            return {
              url,
              width: Number(anyEntry.width) || 0,
              height: Number(anyEntry.height) || 0,
            } as Thumbnail;
          }
        }
        return null;
      })
      .filter((entry): entry is Thumbnail => !!entry);
  }
  if (typeof input === 'string') {
    return [{ url: input, width: 0, height: 0 }];
  }
  if (typeof input === 'object') {
    const anyEntry = input as any;
    const url = anyEntry.url || anyEntry.src;
    if (typeof url === 'string') {
      return [{ url, width: Number(anyEntry.width) || 0, height: Number(anyEntry.height) || 0 }];
    }
  }
  return [];
};

const pickThumb = (input?: Thumbnail[] | null | string | unknown): string => {
  const thumbs = normalizeThumbnails(input);
  if (thumbs.length === 0) return '';
  const sorted = [...thumbs].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url ?? '';
};

const parseCount = (value?: number | string | null): number | string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return value;
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) return value;
  const num = Number(digits);
  return Number.isNaN(num) ? value : num;
};

type TrimmedVideo = {
  id?: string;
  title?: string;
  description?: string;
  descriptionSnippet?: string;
  thumbnails?: Thumbnail[];
  channel?: {
    id?: string;
    name?: string;
    badges?: string[];
    thumbnails?: Thumbnail[];
  };
  stats?: {
    views?: number | string;
    publishedTime?: string;
    lengthText?: string;
    lengthSeconds?: number;
    likes?: number | string;
  };
  badges?: string[];
  isLive?: boolean;
};

const toApiVideo = (video: TrimmedVideo | undefined | null): ApiVideo | null => {
  if (!video || typeof video !== 'object') return null;
  const id = video.id ?? '';
  if (!id) return null;
  const thumbnails = normalizeThumbnails((video as any).thumbnails ?? (video as any).thumbnail ?? []);
  const channelSource = (video as any).channel
    || (video as any).owner
    || (video as any).uploader
    || (video as any).author;
  const channelThumb = normalizeThumbnails(channelSource?.thumbnails ?? channelSource?.avatar ?? []);
  const channelId = channelSource?.id || channelSource?.channelId || channelSource?.browseId;
  const channelName = channelSource?.name || channelSource?.title || channelSource?.displayName || '';
  return {
    id,
    title: video.title ?? '',
    description: video.description ?? video.descriptionSnippet,
    thumbnail: pickThumb(thumbnails),
    thumbnails,
    upload_date: video.stats?.publishedTime,
    view_count: parseCount(video.stats?.views ?? (video.stats as any)?.shortViewCountText),
    like_count: parseCount(video.stats?.likes ?? (video.stats as any)?.likeCount),
    length_text: video.stats?.lengthText ?? (video as any).lengthText,
    length_seconds: video.stats?.lengthSeconds,
    is_live: video.isLive ?? false,
    badges: video.badges,
    channel: video.channel
      ? {
          id: video.channel.id || channelId,
          name: video.channel.name || channelName,
          thumbnail: pickThumb(video.channel.thumbnails ?? video.channel.avatar ?? channelThumb) || null,
          badges: video.channel.badges ?? channelSource?.badges,
        }
      : channelSource
        ? {
            id: channelId,
            name: channelName,
            thumbnail: pickThumb(channelThumb) || null,
            badges: channelSource?.badges,
          }
        : undefined,
  };
};

type BrowseOptions = {
  region?: string;
  continuation?: string;
};

export async function getBrowseFeed(browseId: string, options?: string | BrowseOptions): Promise<TrendingResponse> {
  const normalized: BrowseOptions = typeof options === 'string' || options === undefined
    ? { region: typeof options === 'string' ? options : undefined }
    : options;

  const { region, continuation } = normalized;
  const isContinuation = Boolean(continuation);

  const body = isContinuation ? { continuation } : { browseId };
  const res = await http<{
    browseId: string;
    title?: string;
    items?: TrimmedVideo[];
    continuation?: string;
  }>('browse', body, !isContinuation && region ? { gl: region } : undefined);

  const items = (res.items ?? [])
    .map(toApiVideo)
    .filter((v): v is ApiVideo => !!v);

  return {
    browseId: res.browseId,
    title: res.title,
    items,
    continuation: res.continuation,
    region,
    timestamp: new Date().toISOString(),
  };
}

export async function getTrending(options?: string | BrowseOptions): Promise<TrendingResponse> {
  return getBrowseFeed('FEtrending', options);
}

export async function searchVideos(q: string, limit?: number): Promise<SearchItem[]> {
  const res = await http<{
    query: string;
    estimatedResults?: number | string;
    results?: Array<TrimmedVideo & { type?: string }>;
    continuation?: string;
  }>('search', {
    query: q,
    ...(limit ? { limit } : {}),
  });

  const list = Array.isArray(res.results) ? res.results : [];
  return list
    .map((item) => {
      const kind = (item.type ?? 'video') as SearchItem['kind'];
      if (kind === 'channel') {
        const channelId = (item as any).id || (item as any).channelId || '';
        if (!channelId) return null;
        const title = item.title ?? (item as any).name ?? '';
        const thumbs = normalizeThumbnails((item as any).thumbnails ?? (item as any).avatar ?? []);
        return {
          id: channelId,
          title,
          description: item.description ?? (item as any).description ?? (item as any).descriptionSnippet,
          thumbnail: pickThumb(thumbs),
          thumbnails: thumbs,
          channel: {
            id: channelId,
            name: title,
            thumbnail: pickThumb(thumbs) || null,
            badges: (item as any).badges,
          },
          subscriber_count: parseCount((item as any).subscriberCount ?? (item as any).subscriberText),
          channel_description: item.description ?? (item as any).description ?? (item as any).descriptionSnippet,
          kind,
        } satisfies SearchItem;
      }
      if (kind === 'playlist') {
        return null;
      }
      const video = toApiVideo(item);
      if (!video) return null;
      return { ...video, kind } satisfies SearchItem;
    })
    .filter((v): v is SearchItem => !!v);
}

export async function getVideoDetails(videoId: string): Promise<VideoDetails> {
  const [playerRes, nextRes] = await Promise.all([
    http<{
      video?: {
        id?: string;
        title?: string;
        description?: string;
        keywords?: string[];
        thumbnails?: Thumbnail[];
        durationSeconds?: number;
        isLive?: boolean;
        channel?: { id?: string; name?: string; url?: string };
      };
      stats?: { viewCount?: number | string; averageRating?: number };
      publish?: { uploadDate?: string; publishDate?: string; category?: string };
      streaming?: VideoDetails['streaming'];
      captions?: VideoDetails['captions'];
    }>('player', {
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
    }),
    http<{
      metadata?: { title?: string; viewCount?: number | string; publishDate?: string; likeCount?: number | string };
      channel?: {
        id?: string;
        name?: string;
        subscribers?: number | string;
        thumbnails?: Thumbnail[];
      };
      relatedVideos?: { items?: TrimmedVideo[]; continuation?: string };
      comments?: { continuation?: string };
    }>('next', {
      videoId,
    }),
  ]);

  const channelFromNext = nextRes.channel ?? playerRes.video?.channel;

  const baseVideo = toApiVideo({
    id: playerRes.video?.id ?? videoId,
    title: playerRes.video?.title ?? nextRes.metadata?.title ?? '',
    description: playerRes.video?.description,
    thumbnails: playerRes.video?.thumbnails,
    channel: playerRes.video?.channel
      ? {
          id: playerRes.video.channel.id,
          name: playerRes.video.channel.name,
          thumbnails: channelFromNext?.thumbnails ?? playerRes.video?.thumbnails,
        }
      : undefined,
    stats: {
      views: playerRes.stats?.viewCount ?? nextRes.metadata?.viewCount,
      publishedTime: playerRes.publish?.uploadDate ?? nextRes.metadata?.publishDate,
    },
    badges: undefined,
    isLive: playerRes.video?.isLive,
  });

  const related = (nextRes.relatedVideos?.items ?? [])
    .map(toApiVideo)
    .filter((v): v is ApiVideo => !!v);

  return {
    ...(baseVideo ?? { id: videoId, title: '' }),
    keywords: playerRes.video?.keywords,
    duration_seconds: playerRes.video?.durationSeconds,
    captions: playerRes.captions,
    stats: playerRes.stats,
    publish: playerRes.publish,
    streaming: playerRes.streaming,
    related,
    commentsToken: nextRes.comments?.continuation,
  };
}

const toApiComment = (c: any): ApiComment | null => {
  if (!c || typeof c !== 'object') return null;
  const id = c.id ?? '';
  if (!id) return null;
  const author = c.author?.name ?? c.author ?? '';
  return {
    id,
    author,
    author_thumbnail: Array.isArray(c.author?.avatar) ? pickThumb(c.author.avatar) : c.author?.avatar ?? undefined,
    content: c.content ?? '',
    published: c.publishedTime ?? '',
    likes: c.likeCount ?? c.likeCountText,
    reply_count: c.replyCount,
    repliesToken: c.repliesToken,
  };
};

export async function getVideoComments(videoId: string, pageToken?: string): Promise<VideoCommentsResponse> {
  let continuation = pageToken;
  if (!continuation) {
    const bootstrap = await http<{ comments?: { continuation?: string } }>('next', { videoId });
    continuation = bootstrap.comments?.continuation;
    if (!continuation) {
      return { comments: [], has_more: false };
    }
  }

  const res = await http<{
    comments?: any[];
    continuation?: string;
  }>('next', { continuation });

  const comments = (res.comments ?? [])
    .map(toApiComment)
    .filter((c): c is ApiComment => !!c);

  return {
    comments,
    nextPageToken: res.continuation,
    has_more: Boolean(res.continuation),
  };
}

export async function getChannel(channelId: string, limit?: number): Promise<ChannelInfo> {
  const res = await http<{
    channel?: {
      id?: string;
      title?: string;
      description?: string;
      subscriberCount?: number | string;
      avatar?: Thumbnail[];
      banners?: Thumbnail[];
      verified?: boolean;
      viewCount?: number | string;
      videoCount?: number | string;
    };
    tabs?: Array<{
      title?: string;
      items?: TrimmedVideo[];
    }>;
  }>('browse', { browseId: channelId });

  const channel = res.channel ?? {};
  const videosSource = res.tabs?.find((tab) => tab.items && tab.items.length)?.items ?? [];
  const videos = videosSource
    .slice(0, limit || videosSource.length)
    .map(toApiVideo)
    .filter((v): v is ApiVideo => !!v)
    .map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      thumbnail: v.thumbnail,
      upload_date: v.upload_date,
    }));

  return {
    id: channel.id ?? channelId,
    name: channel.title ?? '',
    description: channel.description,
    thumbnail: pickThumb(channel.avatar),
    banner: pickThumb(channel.banners),
    subscriber_count: channel.subscriberCount,
    video_count: channel.videoCount,
    view_count: channel.viewCount,
    verified: channel.verified,
    videos,
  };
}
