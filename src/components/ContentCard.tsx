
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  id: number | string;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  id, title, year, duration, image, quality, type 
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/movie/${id}`);
  };
  
  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-800/60">
        <img 
          src={image} 
          alt={title} 
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-red-600 text-xs border-0 font-medium">{quality}</Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge className="bg-blue-600 text-xs border-0 font-medium">{type}</Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
          <div className="p-3 w-full">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-gray-300">{year} • {duration}</p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium line-clamp-1 group-hover:text-red-400 transition-colors">{title}</h3>
        <p className="text-xs text-gray-400">{year} • {duration}</p>
      </div>
    </div>
  );
};

export default ContentCard;
