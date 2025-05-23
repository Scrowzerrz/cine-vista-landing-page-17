
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { FileText, Users, Film, User, Clock, Calendar, Star } from 'lucide-react';

interface MovieInfoProps {
  movie: {
    plot: string;
    categories: string[];
    director: string;
    cast: string[];
    producer: string;
    year: string;
    duration: string;
    rating: string;
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
      {/* Movie Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center space-x-2 bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
          <Calendar className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-xs text-gray-400">Ano</p>
            <p className="text-sm font-medium text-white">{movie.year}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
          <Clock className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-xs text-gray-400">Duração</p>
            <p className="text-sm font-medium text-white">{movie.duration}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-gray-900/50 p-4 rounded-2xl border border-gray-700/30">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-xs text-gray-400">Classificação</p>
            <p className="text-sm font-medium text-yellow-400">{movie.rating}<span className="text-gray-400 text-xs">/10</span></p>
          </div>
        </div>
      </div>

      {/* Plot */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-white flex items-center">
          <FileText className="w-5 h-5 text-red-500 mr-2" />
          <span className="inline-block w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
          Sinopse
        </h3>
        <p className="text-gray-300 text-lg leading-relaxed ml-7 bg-gray-900/50 p-5 rounded-2xl border border-gray-700/30 shadow-inner">
          {movie.plot}
          <span className="text-red-500 hover:underline ml-2 cursor-pointer font-medium">Ler mais...</span>
        </p>
      </div>
      
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-white flex items-center">
          <Film className="w-5 h-5 text-red-500 mr-2" />
          <span className="inline-block w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
          Categorias
        </h3>
        <div className="flex flex-wrap gap-2 mb-8 ml-7">
          {movie.categories.map((category) => (
            <Badge 
              key={category} 
              className="bg-gray-900/70 hover:bg-gray-800 text-white border-gray-700/50 px-4 py-2 rounded-xl shadow-md text-sm hover:shadow-lg transition-all duration-200"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Movie Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div className="backdrop-blur-sm bg-gray-900/50 p-5 rounded-2xl border border-gray-700/30 hover:border-gray-600/70 transition-colors shadow-lg hover:shadow-xl group">
          <h4 className="text-gray-400 text-sm mb-3 flex items-center">
            <User className="w-5 h-5 text-red-500 mr-2 group-hover:text-red-400 transition-colors" />
            <span>Diretor:</span>
          </h4>
          <p className="text-white font-medium ml-7">{movie.director}</p>
        </div>
        <div className="backdrop-blur-sm bg-gray-900/50 p-5 rounded-2xl border border-gray-700/30 hover:border-gray-600/70 transition-colors shadow-lg hover:shadow-xl group">
          <h4 className="text-gray-400 text-sm mb-3 flex items-center">
            <Users className="w-5 h-5 text-red-500 mr-2 group-hover:text-red-400 transition-colors" />
            <span>Elenco:</span>
          </h4>
          <p className="text-white font-medium ml-7">{movie.cast.join(", ")}</p>
        </div>
        <div className="md:col-span-2 backdrop-blur-sm bg-gray-900/50 p-5 rounded-2xl border border-gray-700/30 hover:border-gray-600/70 transition-colors shadow-lg hover:shadow-xl group">
          <h4 className="text-gray-400 text-sm mb-3 flex items-center">
            <Film className="w-5 h-5 text-red-500 mr-2 group-hover:text-red-400 transition-colors" />
            <span>Produtor:</span>
          </h4>
          <p className="text-white font-medium ml-7">{movie.producer}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieInfo;
