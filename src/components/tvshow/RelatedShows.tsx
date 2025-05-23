
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Show {
  id: string;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
}

interface RelatedShowsProps {
  shows: Show[];
}

const RelatedShows: React.FC<RelatedShowsProps> = ({ shows }) => {
  const navigate = useNavigate();
  
  const handleShowClick = (showId: string) => {
    navigate(`/tvshow/${showId}`);
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center">
          <span className="inline-block w-1 h-5 bg-red-600 mr-2"></span>
          SÉRIES RELACIONADAS
        </h2>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="border-gray-700 bg-gray-800/50 hover:bg-gray-700">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button variant="outline" size="icon" className="border-gray-700 bg-gray-800/50 hover:bg-gray-700">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.map((show) => (
          <div 
            key={show.id}
            className="relative group cursor-pointer"
            onClick={() => handleShowClick(show.id)}
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-800">
              <img 
                src={show.image}
                alt={show.title}
                className="w-full h-56 object-cover group-hover:opacity-70 transition-opacity"
              />
              <div className="absolute top-2 left-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${show.type === 'DUB' ? 'bg-blue-600/20 text-blue-400 border-blue-800' : 'bg-blue-500/20 text-blue-300 border-blue-700'}`}
                >
                  {show.type}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge 
                  variant="outline" 
                  className="text-xs bg-gray-700/70 text-gray-200 border-gray-600"
                >
                  {show.quality}
                </Badge>
              </div>
            </div>
            
            <div className="mt-2 p-1">
              <h3 className="text-sm font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                {show.title}
              </h3>
              <p className="text-xs text-gray-400">
                {show.year} • {show.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedShows;
