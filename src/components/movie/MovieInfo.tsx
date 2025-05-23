
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="backdrop-blur-sm bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 shadow-lg"
    >
      {/* Plot */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 text-white flex items-center">
          <span className="inline-block w-1 h-5 bg-red-600 mr-2"></span>
          Sinopse
        </h3>
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
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-4 py-2 shadow-md"
          >
            {category}
          </Badge>
        ))}
      </div>
      
      {/* Movie Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        <div className="backdrop-blur-sm bg-gray-800/20 p-4 rounded-lg border border-gray-700/30">
          <h4 className="text-gray-400 text-sm mb-1">Diretor:</h4>
          <p className="text-white font-medium">{movie.director}</p>
        </div>
        <div className="backdrop-blur-sm bg-gray-800/20 p-4 rounded-lg border border-gray-700/30">
          <h4 className="text-gray-400 text-sm mb-1">Elenco:</h4>
          <p className="text-white font-medium">{movie.cast.join(", ")}</p>
        </div>
        <div className="md:col-span-2 backdrop-blur-sm bg-gray-800/20 p-4 rounded-lg border border-gray-700/30">
          <h4 className="text-gray-400 text-sm mb-1">Produtor:</h4>
          <p className="text-white font-medium">{movie.producer}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieInfo;
