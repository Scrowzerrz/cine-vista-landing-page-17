
import React from 'react';
import ContentCarousel from './ContentCarousel';
import ContentCard from './ContentCard';

interface ContentItem {
  id: number | string;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
}

interface ContentCarouselWrapperProps {
  title: string;
  data: ContentItem[];
  categories: string[];
}

const ContentCarouselWrapper: React.FC<ContentCarouselWrapperProps> = ({ 
  title, data, categories 
}) => {
  return (
    <div className="relative w-full py-4">
      <div className="bg-gradient-to-r from-gray-900/40 via-gray-800/20 to-gray-900/40 backdrop-blur-sm rounded-xl p-6">
        <ContentCarousel 
          title={title} 
          data={data}
          categories={categories}
          renderItem={(item) => (
            <ContentCard
              key={item.id}
              id={item.id}
              title={item.title}
              year={item.year}
              duration={item.duration}
              image={item.image}
              quality={item.quality}
              type={item.type}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ContentCarouselWrapper;
