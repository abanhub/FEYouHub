import { Play, Eye, Clock, Heart, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/ui/button";
import SafeImage from "@/features/safe-mode/ui/SafeImage";
import { useNavigate } from "react-router-dom";
interface VideoCardProps {
  id: string
  title: string;
  channel: string;
  views: string;
  duration: string;
  timeAgo: string;
  thumbnail: string;
  verified?: boolean;
  rating?: number;
}
const VideoCard = ({id, title, channel, views, duration, timeAgo, thumbnail, verified = false, rating }: VideoCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="group cursor-pointer h-full">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-3 hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-brand-orange">
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative overflow-hidden"
                                    onClick={() => {
                              if (id) navigate(`/v/${id}`);
                            }}>
          <SafeImage
            src={thumbnail}
            alt={title}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="fallback hidden absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
            <Play className="h-16 w-16 text-white/40" />
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/90 text-white px-2 py-1 rounded text-xs font-bold">
            {duration}
          </div>
          
          {/* Quality badge */}
          <div className="absolute top-2 left-2 bg-brand-orange text-black px-2 py-1 rounded text-xs font-bold">
            HD
          </div>
          
          {/* Play button overlay (hidden until hover) */}
          <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <div className="w-16 h-16 bg-brand-orange/90 rounded-full flex items-center justify-center">
                <Play className="h-8 w-8 text-black ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/60 hover:bg-black/80">
              <Heart className="h-4 w-4 text-white" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/60 hover:bg-black/80">
              <Share2 className="h-4 w-4 text-white" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/60 hover:bg-black/80">
              <MoreHorizontal className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-medium text-sm leading-tight mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors min-h-[2.5rem]">
            {title}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs ${verified ? "text-brand-orange" : "text-gray-400"}`}>
                {channel}
              </span>
              {verified && (
                <div className="w-4 h-4 bg-brand-orange rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
              )}
            </div>
            {rating && (
              <div className="flex items-center gap-1">
                <span className="text-brand-orange text-xs font-bold">{rating}%</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
