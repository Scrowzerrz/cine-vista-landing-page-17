
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { PlayCircle } from 'lucide-react';

interface ContentCardProps {
  id: number | string;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
  contentType?: 'movie' | 'tvshow';
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  id, title, year, duration, image, quality, type, contentType = 'movie'
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/${contentType}/${id}`);
  };
  
  return (
    <div 
      className="relative group cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 flex-grow">
        <img 
          src={image} 
          alt={title} 
          className="w-full aspect-[2/3] object-cover group-hover:opacity-80 transition-all duration-300 ease-out"
          loading="lazy"
        />
        
        <div className="absolute top-3 right-3">
          <Badge className="bg-red-600/90 hover:bg-red-600 text-xs border-0 font-medium px-2.5 py-1">{quality}</Badge>
        </div>
        
        <div className="absolute top-3 left-3">
          <Badge className="bg-blue-600/90 hover:bg-blue-600 text-xs border-0 font-medium px-2.5 py-1">{type}</Badge>
        </div>
        
        {contentType === 'tvshow' && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-purple-600/90 hover:bg-purple-600 text-xs border-0 font-medium px-2.5 py-1">SÉRIE</Badge>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-red-500 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300" />
          </div>
          <div className="p-4 w-full">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-xs text-gray-300">{year} • {duration}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-3 px-1">
        <h3 className="text-sm font-medium line-clamp-1 group-hover:text-red-400 transition-colors">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{year} • {duration}</p>
      </div>
    </div>
  );
};

export default ContentCard;
