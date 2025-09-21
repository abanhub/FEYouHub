import type { ApiVideo } from "@/entities/video/types";

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
  videos?: Array<Pick<ApiVideo, "id" | "title" | "description" | "thumbnail" | "upload_date">>;
};
