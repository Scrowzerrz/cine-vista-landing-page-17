
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= data.length - 4 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? Math.max(0, data.length - 5) : prevIndex - 1
    );
  };

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-8">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-3">📱</span>
            {title}
          </h2>
          <div className="hidden md:flex items-center space-x-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`text-sm transition-colors ${
                  activeCategory === index 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 20}%)` }}
        >
          {data.map((item) => (
            <div key={item.id} className="min-w-[20%] px-2">
              <div className="group relative cursor-pointer">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Quality badges */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {item.quality}
                    </span>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                      ▶ Assistir
                    </button>
                  </div>
                </div>
                
                {/* Content info */}
                <div className="mt-3">
                  <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-400 text-xs">
                    <span>{item.year}</span>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentCarousel;
