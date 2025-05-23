
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: number | string;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
}

interface ContentCarouselProps {
  title: string;
  data: ContentItem[];
  categories: string[];
  renderItem: (item: ContentItem) => React.ReactNode;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, data, categories, renderItem }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const element = carouselRef.current;
    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 10);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= carouselRef.current.clientWidth * 0.75;
      setTimeout(checkScroll, 100);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += carouselRef.current.clientWidth * 0.75;
      setTimeout(checkScroll, 100);
    }
  };

  React.useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    
    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', checkScroll);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, [data]);

  return (
    <div className="w-full">
      {/* Title and Categories */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center group">
            <span className="inline-block w-1.5 h-8 bg-red-600 mr-3 group-hover:h-10 transition-all duration-300 ease-in-out"></span>
            {title}
          </h2>
          <div className="flex flex-wrap gap-2 mt-3 ml-4">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveCategory(index)}
                className={cn(
                  "text-xs font-medium rounded-full px-4 py-1.5 transition-colors duration-200",
                  index === activeCategory 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-800/70 text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2 ml-4 md:ml-0">
          <button
            onClick={scrollLeft}
            className={cn(
              "rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200",
              canScrollLeft 
                ? "bg-gray-800 hover:bg-red-600 text-white" 
                : "bg-gray-800/30 text-gray-600 cursor-not-allowed"
            )}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            className={cn(
              "rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200",
              canScrollRight 
                ? "bg-gray-800 hover:bg-red-600 text-white" 
                : "bg-gray-800/30 text-gray-600 cursor-not-allowed"
            )}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide py-4 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.map((item) => (
            <div key={item.id} className="min-w-[170px] md:min-w-[200px] transition-transform hover:scale-105">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCarousel;
