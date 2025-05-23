import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FilmIcon, TvIcon, PlayCircleIcon, PlusCircleIcon, StarIcon, InfoIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContentItem {
  id: number;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
  rating?: number;
  genres?: string[];
}

interface ContentCarouselProps {
  title: string;
  data: ContentItem[];
  categories: string[];
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, data, categories }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const SectionIcon = title === "Filmes" ? FilmIcon : TvIcon;

  // Ensure all items have rating and genres
  const enhancedData = data.map(item => ({
    ...item,
    rating: item.rating ?? Math.round((Math.random() * 2 + 3) * 10) / 10,
    genres: item.genres ?? (Math.random() > 0.5 ? ['Ação', 'Aventura'] : ['Drama', 'Suspense']),
  }));

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
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap shadow-sm ${
                activeCategory === index
                  ? 'bg-red-600 text-white ring-2 ring-red-400'
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
          loop: enhancedData.length > 5,
        }}
        className="w-full relative group/carousel"
      >
        <CarouselContent className="-ml-2 md:-ml-3 lg:-ml-4">
          {enhancedData.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-3 lg:pl-4 basis-[48%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[15%] group/item">
              <div className="group/card relative h-full cursor-pointer overflow-hidden rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-red-500/30">
                {/* Card Image Container */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 z-10"></div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  />
                  
                  {/* Top badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
                    <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-semibold shadow-lg backdrop-blur-sm border-0 rounded-md ${
                      item.quality === "4K" 
                        ? "bg-purple-600/80 text-white" 
                        : item.quality === "FULLHD" 
                          ? "bg-red-600/80 text-white" 
                          : "bg-yellow-500/80 text-white"
                    }`}>
                      {item.quality}
                    </Badge>
                    <Badge variant="outline" className="bg-sky-500/80 text-white px-2 py-0.5 border-0 text-[10px] font-semibold shadow-lg backdrop-blur-sm rounded-md">
                      {item.type}
                    </Badge>
                  </div>
                  
                  {/* Bottom title for standard view (visible when not hovering) */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent z-20 transition-opacity duration-300 group-hover/card:opacity-0">
                    <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center text-gray-300 text-xs gap-2">
                      <span>{item.year}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
                
                {/* Hover content - full overlay with info and buttons */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 rounded-xl backdrop-blur-sm z-30">
                  <div className="flex flex-col space-y-2.5">
                    {/* Rating */}
                    <div className="flex items-center space-x-1.5">
                      <StarIcon className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                      <span className="text-white font-semibold text-sm">{item.rating.toFixed(1)}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-white font-bold text-base leading-tight line-clamp-2">{item.title}</h3>
                    
                    {/* Year & Duration */}
                    <div className="flex items-center text-gray-300 text-xs gap-2">
                      <span>{item.year}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>{item.duration}</span>
                    </div>
                    
                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5 my-1.5">
                      {item.genres?.slice(0, 2).map((genre, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-700/60 text-gray-200 border-gray-600 text-[10px] px-1.5 py-0.5 rounded">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 pt-1.5">
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-red-600/40 rounded-md py-2">
                        <PlayCircleIcon className="w-5 h-5" strokeWidth={2} />
                        <span className="font-semibold text-sm">Assistir</span>
                      </Button>
                      
                      <div className="flex gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 gap-1.5 rounded-md py-2">
                          <PlusCircleIcon className="w-4 h-4" strokeWidth={2} />
                          <span className="text-xs font-medium">Lista</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 gap-1.5 rounded-md py-2">
                          <InfoIcon className="w-4 h-4" strokeWidth={2} />
                          <span className="text-xs font-medium">Info</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Custom navigation buttons with improved styling */}
        <CarouselPrevious className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-red-600/90 text-white border-none w-10 h-10 sm:w-12 sm:h-12 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-0 disabled:md:opacity-30" />
        <CarouselNext className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-red-600/90 text-white border-none w-10 h-10 sm:w-12 sm:h-12 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-0 disabled:md:opacity-30" />
      </Carousel>
    </section>
  );
};

export default ContentCarousel;
