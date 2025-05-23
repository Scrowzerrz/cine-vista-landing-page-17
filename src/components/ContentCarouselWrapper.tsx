
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
  contentType?: 'movie' | 'tvshow'; // Define o tipo de conteúdo para roteamento
}

interface ContentCarouselWrapperProps {
  title: string;
  data: ContentItem[];
  categories: string[];
  contentType?: 'movie' | 'tvshow'; // Padrão será 'movie' se não especificado
}

const ContentCarouselWrapper: React.FC<ContentCarouselWrapperProps> = ({ 
  title, data, categories, contentType = 'movie'
}) => {
  // Adiciona o tipo de conteúdo a cada item se ainda não tiver
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
              contentType={item.contentType as 'movie' | 'tvshow'}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ContentCarouselWrapper;
