
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
  contentType?: 'movie' | 'tvshow'; // Added contentType to determine the route
}

interface ContentCarouselWrapperProps {
  title: string;
  data: ContentItem[];
  categories: string[];
  contentType?: 'movie' | 'tvshow'; // Default will be 'movie' if not specified
}

const ContentCarouselWrapper: React.FC<ContentCarouselWrapperProps> = ({ 
  title, data, categories, contentType = 'movie'
}) => {
  // Add contentType to each item if not already present
  const enrichedData = data.map(item => ({
    ...item,
    contentType: item.contentType || contentType
  }));

  return (
    <div className="relative w-full py-4">
      <div className="bg-gradient-to-r from-gray-900/40 via-gray-800/20 to-gray-900/40 backdrop-blur-sm rounded-xl p-6">
        <ContentCarousel 
          title={title} 
          data={enrichedData}
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
              contentType={item.contentType}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ContentCarouselWrapper;
