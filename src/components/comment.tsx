import { useEffect, useMemo, useState } from "react";
import { ChevronDown, CheckCircle2, ThumbsUp, ThumbsDown } from "lucide-react";

export type CommentItem = {
  id: string;
  author: string;
  verified?: boolean;
  time: string; // e.g., "3 days ago"
  text: string;
  avatarUrl?: string | null;
  likes: number;
  dislikes?: number;
  userVote?: "up" | "down" | null;
};

type SortKey = "popular" | "recent";

type Props = {
  items?: CommentItem[];
  total?: number;
  defaultSort?: SortKey;
};

const sample: CommentItem[] = [
  {
    id: "c1",
    author: "fb27beb",
    time: "3 days ago",
    text: "Superman in the background, nothing to do with it, LOL",
    avatarUrl: null,
    likes: 1,
    dislikes: 0,
    userVote: null,
  },
  {
    id: "c2",
    author: "34f0d1e",
    time: "3 hours ago",
    text: "Shes go damn hot",
    avatarUrl: null,
    likes: 0,
    dislikes: 0,
    userVote: null,
  },
  {
    id: "c3",
    author: "Vanessa spark",
    verified: true,
    time: "7 hours ago",
    text: "Your so pretty omg",
    avatarUrl: "https://dummyimage.com/40x40/666/fff.png",
    likes: 0,
    dislikes: 0,
    userVote: null,
  },
];

export default function Comment({ items = sample, total, defaultSort = "popular" }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [state, setState] = useState<CommentItem[]>(() => items.map(i => ({ ...i })));

  // Sync internal state when incoming items change
  useEffect(() => {
    setState(items.map(i => ({ ...i })));
  }, [items]);

  const display = useMemo(() => {
    const arr = [...state];
    if (sort === "popular") return arr.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    // "recent": the sample has relative strings; keep input order as "recent" for now
    return arr; // assume incoming order is recent-first
  }, [state, sort]);

  const toggleUp = (id: string) => {
    setState(prev => prev.map(c => {
      if (c.id !== id) return c;
      const wasUp = c.userVote === "up";
      const wasDown = c.userVote === "down";
      const likes = (c.likes ?? 0) + (wasUp ? -1 : 1) + (wasDown ? 1 : 0);
      const dislikes = (c.dislikes ?? 0) + (wasDown ? -1 : 0);
      return { ...c, likes: Math.max(0, likes), dislikes: Math.max(0, dislikes), userVote: wasUp ? null : "up" };
    }));
  };

  const toggleDown = (id: string) => {
    setState(prev => prev.map(c => {
      if (c.id !== id) return c;
      const wasDown = c.userVote === "down";
      const wasUp = c.userVote === "up";
      const dislikes = (c.dislikes ?? 0) + (wasDown ? -1 : 1) + (wasUp ? 1 : 0);
      const likes = (c.likes ?? 0) + (wasUp ? -1 : 0);
      return { ...c, likes: Math.max(0, likes), dislikes: Math.max(0, dislikes), userVote: wasDown ? null : "down" };
    }));
  };

  const totalCount = total ?? items.length;

  return (
    <div className="w-full text-zinc-200">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 mb-2">
        <h2 className="m-0 text-[20px] font-extrabold text-white">All Comments <span className="font-bold opacity-90">({totalCount})</span></h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen(v => !v)}
            className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-zinc-700 text-zinc-300 hover:border-zinc-600"
          >
            {sort === "popular" ? "Popular Comments" : "Recent Comments"}
            <ChevronDown size={16} className="opacity-80" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-zinc-700 bg-black shadow-lg z-10">
              <button
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-zinc-900 ${sort==='popular'?'text-white':'text-zinc-300'}`}
                onClick={() => { setSort('popular'); setSortOpen(false); }}
              >Popular Comments</button>
              <button
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-zinc-900 ${sort==='recent'?'text-white':'text-zinc-300'}`}
                onClick={() => { setSort('recent'); setSortOpen(false); }}
              >Recent Comments</button>
            </div>
          )}
        </div>
      </div>
      <div className="text-[13px] text-amber-500 mb-4">Login or <a href="#" className="underline decoration-transparent hover:decoration-inherit">Sign Up</a> now to post a comment!</div>

      <div className="divide-y divide-zinc-900">
        {display.map((c) => (
          <div key={c.id} className="grid grid-cols-[40px_1fr] gap-3 py-3">
            <div>
              {c.avatarUrl ? (
                <img src={c.avatarUrl} alt={c.author} className="w-10 h-10 rounded-full object-cover bg-zinc-700" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
              )}
            </div>
            <div>
              <div className="text-[13px] text-zinc-400 mb-1">
                <span className="text-[#ff9900] font-bold mr-2">{c.author}</span>
                {c.verified && <CheckCircle2 size={14} className="inline align-middle text-sky-400 mr-1" />}
                <span>{c.time}</span>
              </div>
              <div className="mb-1 whitespace-pre-wrap">{(c.text || '').replace(/<br\s*\/?>(?=\s*|$)/gi, "\n")}</div>
              <div className="flex items-center gap-4 text-[13px] text-zinc-400">
                <button
                  className={`inline-flex items-center gap-1 ${c.userVote==='up'?'text-white':'hover:text-zinc-200'}`}
                  onClick={() => toggleUp(c.id)}
                >
                  <ThumbsUp size={16} className="opacity-90" /> {c.likes}
                </button>
                <button
                  className={`inline-flex items-center gap-1 ${c.userVote==='down'?'text-white':'hover:text-zinc-200'}`}
                  onClick={() => toggleDown(c.id)}
                >
                  <ThumbsDown size={16} className="opacity-90" /> {c.dislikes ?? 0}
                </button>
                <span>• Reply</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
