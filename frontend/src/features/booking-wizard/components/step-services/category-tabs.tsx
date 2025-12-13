import { Button } from "@/shared/ui/button";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import { useEffect, useRef } from "react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryTabs = ({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    const activeTab = document.getElementById(`tab-${activeCategory}`);
    if (activeTab && scrollRef.current) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-[64px] z-40 w-full bg-background/95 backdrop-blur py-2 border-b">
      <ScrollArea className="w-full whitespace-nowrap" ref={scrollRef}>
        <div className="flex w-max space-x-2 px-4">
          {categories.map((category) => (
            <Button
              key={category}
              id={`tab-${category}`}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category)}
              className={cn(
                "rounded-full transition-all duration-300",
                activeCategory === category
                  ? "shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
};
