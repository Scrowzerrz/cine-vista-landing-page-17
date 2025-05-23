
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FilmIcon, TvIcon, PlayIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"; // Certifique-se que o caminho está correto

interface ContentItem {
  id: number;
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
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, data, categories }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const SectionIcon = title === "Filmes" ? FilmIcon : TvIcon;

  return (
    <section className="mb-12 md:mb-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-0">
          <SectionIcon className="w-7 h-7 md:w-8 md:h-8 text-red-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {title}
          </h2>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto pb-2 md:pb-0">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`text-xs sm:text-sm px-3 py-1.5 rounded-md transition-all duration-300 whitespace-nowrap ${
                activeCategory === index
                  ? 'bg-red-600 text-white font-semibold'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: data.length > 5, // Enable loop if more than 5 items
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {data.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <div className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:bg-gray-700">
                <div className="relative aspect-[2/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Quality badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
                    <span className="bg-red-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-semibold shadow-md">
                      {item.quality}
                    </span>
                    <span className="bg-blue-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-semibold shadow-md">
                      {item.type}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3 text-center">
                    <button className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center space-x-1.5 sm:space-x-2 transition-colors mb-2">
                      <PlayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Assistir</span>
                    </button>
                  </div>
                </div>
                
                {/* Content info */}
                <div className="p-2.5 sm:p-3">
                  <h3 className="text-white font-semibold text-xs sm:text-sm mb-1 line-clamp-2 h-8 sm:h-10 leading-tight">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-gray-400 text-[10px] sm:text-xs">
                    <span>{item.year}</span>
                    <span className="text-gray-600">•</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/70 hover:bg-red-600/90 text-white border-none disabled:opacity-30 hidden sm:flex" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gray-800/70 hover:bg-red-600/90 text-white border-none disabled:opacity-30 hidden sm:flex" />
      </Carousel>
    </section>
  );
};

export default ContentCarousel;
