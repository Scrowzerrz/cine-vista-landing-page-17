import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const element = carouselRef.current;
    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= carouselRef.current.clientWidth;
      setTimeout(checkScroll, 50);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += carouselRef.current.clientWidth;
      setTimeout(checkScroll, 50);
    }
  };

  React.useEffect(() => {
    checkScroll();
    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', checkScroll);
    }
    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  return (
    <div className="w-full">
      {/* Title and Categories */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold flex items-center">
            <span className="inline-block w-1 h-5 bg-red-600 mr-2"></span>
            {title}
          </h2>
          <div className="flex space-x-2 mt-1">
            {categories.map((category) => (
              <button
                key={category}
                className="bg-gray-800/50 hover:bg-gray-700 text-gray-300 text-xs rounded-full px-3 py-1 transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={scrollLeft}
            className={`border border-gray-700 bg-gray-800/50 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 ${
              canScrollLeft ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="sr-only">Página anterior</span>
          </button>
          <button
            onClick={scrollRight}
            className={`border border-gray-700 bg-gray-800/50 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 ${
              canScrollRight ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="sr-only">Próxima página</span>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="carousel flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide py-4"
        >
          {data.map((item) => (
            renderItem(item)
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCarousel;
