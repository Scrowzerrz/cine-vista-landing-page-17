
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { FileText, Users, Film, User } from 'lucide-react';

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
      className="backdrop-blur-sm bg-gray-800/40 rounded-3xl border border-gray-700/50 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Plot */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-white flex items-center">
          <FileText className="w-5 h-5 text-red-500 mr-2" />
          <span className="inline-block w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
          Sinopse
        </h3>
        <p className="text-gray-300 text-lg leading-relaxed ml-7 bg-gray-900/30 p-4 rounded-xl border border-gray-700/30">
          {movie.plot}
          <span className="text-red-500 hover:underline ml-2 cursor-pointer font-medium">Ler mais...</span>
        </p>
      </div>
      
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8 ml-7">
        {movie.categories.map((category) => (
          <Badge 
            key={category} 
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-4 py-2 rounded-xl shadow-md text-sm hover:shadow-lg transition-all duration-200"
          >
            {category}
          </Badge>
        ))}
      </div>
      
      {/* Movie Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div className="backdrop-blur-sm bg-gray-800/20 p-5 rounded-2xl border border-gray-700/30 hover:border-gray-600 transition-colors shadow-lg hover:shadow-xl">
          <h4 className="text-gray-400 text-sm mb-2 flex items-center">
            <User className="w-5 h-5 text-red-500 mr-2" />
            <span>Diretor:</span>
          </h4>
          <p className="text-white font-medium ml-7">{movie.director}</p>
        </div>
        <div className="backdrop-blur-sm bg-gray-800/20 p-5 rounded-2xl border border-gray-700/30 hover:border-gray-600 transition-colors shadow-lg hover:shadow-xl">
          <h4 className="text-gray-400 text-sm mb-2 flex items-center">
            <Users className="w-5 h-5 text-red-500 mr-2" />
            <span>Elenco:</span>
          </h4>
          <p className="text-white font-medium ml-7">{movie.cast.join(", ")}</p>
        </div>
        <div className="md:col-span-2 backdrop-blur-sm bg-gray-800/20 p-5 rounded-2xl border border-gray-700/30 hover:border-gray-600 transition-colors shadow-lg hover:shadow-xl">
          <h4 className="text-gray-400 text-sm mb-2 flex items-center">
            <Film className="w-5 h-5 text-red-500 mr-2" />
            <span>Produtor:</span>
          </h4>
          <p className="text-white font-medium ml-7">{movie.producer}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieInfo;
