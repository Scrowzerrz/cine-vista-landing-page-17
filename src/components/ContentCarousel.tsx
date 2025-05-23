
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FilmIcon, TvIcon, PlayIcon, PlusIcon, StarIcon, InfoIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button'; // Importando Button

interface ContentItem {
  id: number;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
  rating?: number; // Opcional: para exibir estrelas
  genres?: string[]; // Opcional: para exibir gêneros
}

interface ContentCarouselProps {
  title: string;
  data: ContentItem[];
  categories: string[];
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, data, categories }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const SectionIcon = title === "Filmes" ? FilmIcon : TvIcon;

  // Adicionando dados de exemplo para rating e genres se não existirem
  const enhancedData = data.map(item => ({
    ...item,
    rating: item.rating ?? Math.round((Math.random() * 2 + 3) * 10) / 10, // Nota aleatória entre 3 e 5
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
        className="w-full relative group/carousel" // Adicionado group/carousel para os botões de navegação aparecerem no hover do carrossel
      >
        <CarouselContent className="-ml-2 md:-ml-3 lg:-ml-4">
          {enhancedData.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-3 lg:pl-4 basis-[48%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[15%]"> {/* Ajustado basis */}
              <div className="group/card relative cursor-pointer overflow-hidden rounded-xl shadow-lg bg-gray-800 transition-all duration-300 ease-in-out hover:shadow-red-500/30 hover:ring-2 hover:ring-red-500 transform hover:-translate-y-1">
                <div className="relative aspect-[2/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-110"
                  />
                  
                  <div className="absolute top-2 left-2 flex flex-col space-y-1.5 z-10">
                    <span className={`text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-semibold shadow-lg ${item.quality === "4K" ? "bg-purple-600" : item.quality === "FULLHD" ? "bg-red-600" : "bg-yellow-500"}`}>
                      {item.quality}
                    </span>
                    <span className="bg-blue-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-semibold shadow-lg">
                      {item.type}
                    </span>
                  </div>

                  {/* Overlay de Informações - aparece no hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-end p-2.5 sm:p-3 text-left">
                    <h3 className="text-white font-bold text-sm sm:text-base mb-1 line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-gray-300 text-[10px] sm:text-xs mb-2">
                      <span>{item.year}</span>
                      <span className="text-gray-500">•</span>
                      <span>{item.duration}</span>
                      {item.rating && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="flex items-center">
                            <StarIcon className="w-3 h-3 text-yellow-400 mr-0.5" /> {item.rating.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                    {item.genres && item.genres.length > 0 && (
                      <div className="text-gray-400 text-[10px] sm:text-xs mb-2.5 line-clamp-1">
                        {item.genres.join(', ')}
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1.5 rounded-md">
                        <PlayIcon className="w-3.5 h-3.5 mr-1" /> Assistir
                      </Button>
                      <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-8 h-8">
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                       <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-8 h-8">
                        <InfoIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Informações Visíveis (sem hover) - simplificado */}
                <div className="p-2.5 sm:p-3 group-hover/card:opacity-0 transition-opacity duration-200"> {/* Esconde no hover */}
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
        {/* Botões de navegação aparecem no hover do carrossel e são maiores */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-red-600/80 text-white border-none w-10 h-10 sm:w-12 sm:h-12 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 disabled:opacity-20 hidden md:flex" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-red-600/80 text-white border-none w-10 h-10 sm:w-12 sm:h-12 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 disabled:opacity-20 hidden md:flex" />
      </Carousel>
    </section>
  );
};

export default ContentCarousel;
