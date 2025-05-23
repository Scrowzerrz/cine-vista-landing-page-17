
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MovieInfoProps {
  movie: {
    plot: string;
    categories: string[];
    director: string;
    cast: string[];
    producer: string;
  };
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
  return (
    <div>
      {/* Plot */}
      <div className="mb-6">
        <p className="text-gray-300 text-lg leading-relaxed">
          {movie.plot}
          <span className="text-red-500 hover:underline ml-1 cursor-pointer">Ler mais...</span>
        </p>
      </div>
      
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {movie.categories.map((category) => (
          <Badge 
            key={category} 
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-4 py-2"
          >
            {category}
          </Badge>
        ))}
      </div>
      
      {/* Movie Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        <div>
          <h4 className="text-gray-400 text-sm mb-1">Diretor:</h4>
          <p className="text-white">{movie.director}</p>
        </div>
        <div>
          <h4 className="text-gray-400 text-sm mb-1">Elenco:</h4>
          <p className="text-white">{movie.cast.join(", ")}</p>
        </div>
        <div className="md:col-span-2">
          <h4 className="text-gray-400 text-sm mb-1">Produtor:</h4>
          <p className="text-white">{movie.producer}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
