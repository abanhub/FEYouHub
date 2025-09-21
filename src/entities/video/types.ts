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

export type VideoDetails = ApiVideo & {
  keywords?: string[];
  duration_seconds?: number;
  captions?: Array<{
    languageCode: string;
    name: string;
    url: string;
    kind?: string;
    isTranslatable?: boolean;
  }>;
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
