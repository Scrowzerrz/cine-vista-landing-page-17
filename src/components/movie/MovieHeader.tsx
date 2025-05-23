
import React from 'react';
import { Play, ListPlus, Share, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface MovieHeaderProps {
  movie: {
    title: string;
    originalTitle: string;
    poster: string;
    year: string;
    duration: string;
    rating: string;
    quality: string;
  };
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ movie }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-8 w-full"
    >
      {/* Movie Poster */}
      <div className="flex-shrink-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl w-56 h-80 md:w-72 md:h-96 border-2 border-gray-700/50 group"
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-600/90 hover:bg-blue-600 border-0 px-3 py-1 rounded-full text-sm font-medium shadow-lg">LEG</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-600/90 hover:bg-red-600 border-0 px-3 py-1 rounded-full text-sm font-medium shadow-lg">{movie.quality}</Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
      </div>
      
      {/* Movie Info */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col justify-between flex-1"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
            >
              {movie.title}
            </motion.h1>
            <p className="text-gray-400 text-sm md:text-base italic">{movie.originalTitle}</p>
          </div>
          
          <div className="flex items-center space-x-4 bg-gray-800/60 backdrop-blur-md rounded-xl p-3 shadow-lg w-fit">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-yellow-400 font-medium">{movie.rating}</span>
              <span className="text-gray-400">/10</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">{movie.year}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">{movie.duration}</span>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-6 h-auto shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" fill="white" /> 
              <span>ASSISTIR AGORA</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="border border-gray-600 bg-gray-800/70 hover:bg-gray-700 text-white rounded-xl px-5 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={(e) => e.preventDefault()}
            >
              <ListPlus className="mr-2 h-5 w-5" /> 
              <span>Minha Lista</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="border border-gray-600 bg-gray-800/70 hover:bg-gray-700 text-white rounded-xl px-5 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={(e) => e.preventDefault()}
            >
              <Share className="mr-2 h-5 w-5" /> 
              <span>Compartilhar</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MovieHeader;
