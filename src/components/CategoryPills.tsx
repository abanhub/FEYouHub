import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/context/LanguageContext";

const categories = [
  { id: "all", en: "All", vi: "Tất cả" },
  { id: "music", en: "Music", vi: "Âm nhạc" },
  { id: "games", en: "Games", vi: "Trò chơi" },
  { id: "playlist", en: "Playlist", vi: "Danh sách kết hợp" },
  { id: "minecraft_mods", en: "ĐSTT suck", vi: "Đại số tuyến tính loz" },
  { id: "live", en: "Live", vi: "Trực tiếp" },
  { id: "math", en: "Mathematics", vi: "Toán học" },
  { id: "action_adventure", en: "Action-Adventure Games", vi: "Trò chơi hành động phiêu lưu" },
  { id: "rap", en: "Rap", vi: "Đọc rap" },
  { id: "recent", en: "Recently Uploaded", vi: "Mới tải lên gần đây" },
  { id: "watched", en: "Watched", vi: "Đã xem" },
  { id: "recommended", en: "Recommended", vi: "Đề xuất" },
];

const CategoryPills = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { lang } = useLanguage();

  return (
    <div className="border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`
                  whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border
                  ${activeCategory === category.id 
                    ? "bg-brand-orange hover:bg-brand-orange-hover text-black border-brand-orange shadow-lg" 
                    : "bg-gray-900 hover:bg-gray-800 text-white border-gray-700 hover:border-brand-orange"
                  }
                `}
              >
                {lang === "vi" ? category.vi : category.en}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryPills;
