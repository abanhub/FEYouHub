import React from "react";

export const SearchResultSkeleton: React.FC = () => {
  return (
    <div className="group flex gap-4 p-2 rounded-lg hover:bg-zinc-900/40 transition-colors">
      <div className="w-44 shrink-0">
        <div className="relative aspect-video rounded overflow-hidden border border-zinc-800 bg-muted skeleton" />
      </div>
      <div className="flex-1 min-w-0 py-1">
        <div className="h-4 w-9/12 bg-muted rounded-md skeleton mb-2" />
        <div className="h-4 w-7/12 bg-muted rounded-md skeleton mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 bg-muted rounded-md skeleton" />
          <div className="flex items-center gap-3">
            <div className="h-3 w-16 bg-muted rounded-md skeleton" />
            <div className="h-3 w-20 bg-muted rounded-md skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChannelPanelSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 sticky top-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 rounded-full bg-muted skeleton border border-zinc-700" />
        <div className="flex-1">
          <div className="h-4 w-40 bg-muted rounded-md skeleton mb-2" />
          <div className="flex gap-3">
            <div className="h-3 w-24 bg-muted rounded-md skeleton" />
            <div className="h-3 w-16 bg-muted rounded-md skeleton" />
            <div className="h-3 w-20 bg-muted rounded-md skeleton" />
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-0">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-video bg-muted skeleton" />
        ))}
      </div>
    </div>
  );
};

