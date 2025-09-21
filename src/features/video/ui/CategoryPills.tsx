import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useLanguage } from "@/shared/lib/contexts/LanguageContext";

type Category = {
  id: string;
  en: string;
  vi: string;
};

const categories: Category[] = [
  { id: "all", en: "All", vi: "Tất cả" },
  { id: "music", en: "Music", vi: "Âm nhạc" },
  { id: "games", en: "Games", vi: "Trò chơi" },
  { id: "playlist", en: "Playlist", vi: "Danh sách phát" },
  { id: "minecraft_mods", en: "Minecraft Mods", vi: "Bản mod Minecraft" },
  { id: "live", en: "Live", vi: "Trực tiếp" },
  { id: "math", en: "Mathematics", vi: "Toán học" },
  { id: "action_adventure", en: "Action-Adventure Games", vi: "Trò chơi hành động phiêu lưu" },
  { id: "rap", en: "Rap", vi: "Nhạc rap" },
  { id: "recent", en: "Recently Uploaded", vi: "Vừa tải lên" },
  { id: "watched", en: "Watched", vi: "Đã xem" },
  { id: "recommended", en: "Recommended", vi: "Đề xuất" },
];

const CategoryPills = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { lang } = useLanguage();

  return (
    <div className="bg-black border-b border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              const label = lang === "vi" ? category.vi : category.en;

              return (
                <Button
                  key={category.id}
                  size="sm"
                  variant={isActive ? "default" : "secondary"}
                  onClick={() => setActiveCategory(category.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-brand-orange text-black hover:bg-brand-orange-hover border-brand-orange shadow-lg"
                      : "bg-gray-900 text-white hover:bg-gray-800 border-gray-700 hover:border-brand-orange"
                  }`}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryPills;

