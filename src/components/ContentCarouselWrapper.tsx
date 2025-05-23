
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
  // Passamos os dados ao ContentCarousel original, mas adicionamos um componente
  // personalizado para renderização do item que permitirá a navegação
  return (
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
  );
};

export default ContentCarouselWrapper;
