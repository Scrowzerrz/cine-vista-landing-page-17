
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TVShowInfoProps {
  tvshow: {
    plot: string;
    categories: string[];
    creator: string;
    cast: string[];
    network: string;
  };
}

const TVShowInfo: React.FC<TVShowInfoProps> = ({ tvshow }) => {
  return (
    <div>
      {/* Plot */}
      <div className="mb-6">
        <p className="text-gray-300 text-lg leading-relaxed">
          {tvshow.plot}
          <span className="text-red-500 hover:underline ml-1 cursor-pointer">Ler mais...</span>
        </p>
      </div>
      
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tvshow.categories.map((category) => (
          <Badge 
            key={category} 
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-4 py-2"
          >
            {category}
          </Badge>
        ))}
      </div>
      
      {/* TV Show Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        <div>
          <h4 className="text-gray-400 text-sm mb-1">Criador:</h4>
          <p className="text-white">{tvshow.creator}</p>
        </div>
        <div>
          <h4 className="text-gray-400 text-sm mb-1">Elenco:</h4>
          <p className="text-white">{tvshow.cast.join(", ")}</p>
        </div>
        <div>
          <h4 className="text-gray-400 text-sm mb-1">Emissora:</h4>
          <p className="text-white">{tvshow.network}</p>
        </div>
      </div>
    </div>
  );
};

export default TVShowInfo;
