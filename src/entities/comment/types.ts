export type ApiComment = {
  id: string;
  author: string;
  author_thumbnail?: string;
  content: string;
  published: string;
  likes?: number | string;
  reply_count?: number;
  repliesToken?: string;
};

export type VideoCommentsResponse = {
  comments: ApiComment[];
  nextPageToken?: string;
  has_more: boolean;
};
