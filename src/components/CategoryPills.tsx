import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  "All",
  "Most Popular",
  "Most Recent", 
  "Top Rated",
  "Trending",
  "HD",
  "4K",
  "VR",
  "Live",
  "Interactive",
  "Premium",
  "Verified",
  "Featured",
  "Recommended"
];

const CategoryPills = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`
                  whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border
                  ${activeCategory === category 
                    ? "bg-brand-orange hover:bg-brand-orange-hover text-black border-brand-orange shadow-lg" 
                    : "bg-gray-900 hover:bg-gray-800 text-white border-gray-700 hover:border-brand-orange"
                  }
                `}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryPills;