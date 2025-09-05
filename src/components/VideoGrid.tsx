import VideoCard from "./VideoCard";

// Placeholder thumbnail URL
const placeholderThumbnail = "https://via.placeholder.com/320x180/1a1a1a/ff9000?text=Video+Thumbnail";

const sampleVideos = [
  {
    title: "Amazing Content - Must Watch!",
    channel: "TopCreator",
    views: "1.2M",
    duration: "15:23",
    timeAgo: "2 days ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 95
  },
  {
    title: "Premium Quality Experience",
    channel: "PremiumStudio",
    views: "856K",
    duration: "12:45",
    timeAgo: "1 week ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 92
  },
  {
    title: "Latest Trending Content",
    channel: "TrendMaster",
    views: "2.1M",
    duration: "18:30",
    timeAgo: "3 days ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 88
  },
  {
    title: "Exclusive Behind the Scenes",
    channel: "ExclusiveContent",
    views: "3.5M",
    duration: "28:15",
    timeAgo: "5 days ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 97
  },
  {
    title: "Hot New Release",
    channel: "NewReleases",
    views: "987K",
    duration: "20:11",
    timeAgo: "1 day ago",
    thumbnail: placeholderThumbnail,
    verified: false,
    rating: 89
  },
  {
    title: "Popular Content Collection",
    channel: "PopularChannel",
    views: "4.2M",
    duration: "60:00",
    timeAgo: "2 weeks ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 94
  },
  {
    title: "Interactive Experience",
    channel: "InteractiveStudio",
    views: "1.8M",
    duration: "22:33",
    timeAgo: "4 days ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 91
  },
  {
    title: "Creative Artistic Content",
    channel: "ArtisticCreators",
    views: "645K",
    duration: "35:42",
    timeAgo: "1 week ago",
    thumbnail: placeholderThumbnail,
    verified: false,
    rating: 86
  },
  {
    title: "Professional Quality Production",
    channel: "ProStudio",
    views: "2.7M",
    duration: "45:18",
    timeAgo: "3 days ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 96
  },
  {
    title: "Fresh New Perspective",
    channel: "FreshContent",
    views: "1.4M",
    duration: "8:24",
    timeAgo: "6 days ago",
    thumbnail: placeholderThumbnail,
    verified: false,
    rating: 87
  },
  {
    title: "High Definition Experience",
    channel: "HDMasters",
    views: "892K",
    duration: "32:17",
    timeAgo: "1 week ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 93
  },
  {
    title: "Trending Now - Don't Miss",
    channel: "TrendingNow",
    views: "5.1M",
    duration: "12:08",
    timeAgo: "2 hours ago",
    thumbnail: placeholderThumbnail,
    verified: true,
    rating: 98
  }
];

const VideoGrid = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {sampleVideos.map((video, index) => (
          <VideoCard key={index} {...video} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;