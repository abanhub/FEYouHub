import React from "react";

const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="group cursor-pointer h-full">
      <div className="relative rounded-lg overflow-hidden mb-3 border border-gray-800 bg-gray-900">
        <div className="aspect-video bg-muted skeleton" />
        <div className="p-4">
          <div className="h-4 w-11/12 bg-muted rounded-md skeleton mb-2" />
          <div className="h-4 w-9/12 bg-muted rounded-md skeleton mb-4" />
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 bg-muted rounded-md skeleton" />
            <div className="h-3 w-16 bg-muted rounded-md skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;

