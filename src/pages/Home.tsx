import NetworkBar from "@/features/layout/ui/NetworkBar";
import LegacyHeader from "@/features/layout/ui/Header";
import VideoGrid from "@/features/video/ui/VideoGrid";
import GlobalCookieBanner from "@/features/layout/ui/GlobalCookieBanner";
import { Info } from "lucide-react";
import { useLanguage } from "@/shared/lib/contexts/LanguageContext";
import Footer from "@/features/layout/ui/Footer";
import WarningModal from "@/features/layout/ui/WarningModal";
import { useMemo, useState } from "react";


const Index = () => {
  const { t } = useLanguage();
  const feeds = useMemo(
    () => [
      { id: "FEtrending", label: "Trending" },
      { id: "FEtrendingVN", label: "Trending VN", region: "VN" },
      { id: "FEexplore", label: "Explore" },
      { id: "FEsubscriptions", label: "Subscriptions" },
      { id: "FEmusic", label: "Music" },
    ],
    []
  );
  const [activeFeed, setActiveFeed] = useState(feeds[0]);
  return (
    <div className="min-h-screen bg-black">
      <NetworkBar />
      <LegacyHeader />
      <WarningModal />
       <div className="pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{t("hero.title")}</h2>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/90 text-white"><Info className="h-3 w-3" /></span>
          </div>
          <p className="text-gray-400 mb-6">{t("hero.subtitle")}</p>
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
            {feeds.map((feed) => (
              <button
                key={feed.id}
                onClick={() => setActiveFeed(feed)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFeed.id === feed.id
                    ? "bg-brand-orange text-black"
                    : "bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {feed.label}
              </button>
            ))}
          </div>
        </div>
        <VideoGrid browseId={activeFeed.id} regionOverride={activeFeed.region} />
      </div> 
      <GlobalCookieBanner />
      <Footer />
    </div>
  );
};

export default Index;
